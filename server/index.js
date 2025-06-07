const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Joi = require('joi');
const { Octokit } = require('@octokit/rest');
const OpenAI = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize external APIs
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: {
    timeout: parseInt(process.env.GITHUB_API_TIMEOUT) || 10000
  }
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: parseInt(process.env.OPENAI_API_TIMEOUT) || 30000
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5, // 5 requests per minute
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Validation schemas
const projectSubmissionSchema = Joi.object({
  githubUrl: Joi.string()
    .uri()
    .pattern(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/)
    .required()
    .messages({
      'string.pattern.base': 'GitHub URL must be in format: https://github.com/username/repository'
    }),
  description: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must not exceed 1000 characters'
    })
});

// Helper function to extract owner and repo from GitHub URL
function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub URL format');
  }
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '') // Remove .git suffix if present
  };
}

// Helper function to analyze repository structure and content
async function analyzeRepository(owner, repo) {
  try {
    // Get repository information
    const { data: repoInfo } = await octokit.rest.repos.get({
      owner,
      repo
    });

    // Get repository contents (root directory)
    const { data: contents } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: ''
    });

    // Get repository languages
    const { data: languages } = await octokit.rest.repos.listLanguages({
      owner,
      repo
    });

    // Get recent commits (last 10)
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 10
    });

    // Analyze key files (package.json, README, etc.)
    const keyFiles = [];
    const maxFilesToAnalyze = parseInt(process.env.MAX_FILES_TO_ANALYZE) || 50;
    let filesAnalyzed = 0;

    for (const item of contents) {
      if (filesAnalyzed >= maxFilesToAnalyze) break;
      
      if (item.type === 'file' && shouldAnalyzeFile(item.name)) {
        try {
          const { data: fileContent } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: item.path
          });

          if (fileContent.content && fileContent.size < 100000) { // Skip files larger than 100KB
            const content = Buffer.from(fileContent.content, 'base64').toString('utf-8');
            keyFiles.push({
              name: item.name,
              path: item.path,
              content: content.substring(0, 5000), // Limit content to first 5000 chars
              size: fileContent.size
            });
            filesAnalyzed++;
          }
        } catch (error) {
          console.warn(`Could not fetch file ${item.path}:`, error.message);
        }
      }
    }

    return {
      repoInfo: {
        name: repoInfo.name,
        fullName: repoInfo.full_name,
        description: repoInfo.description,
        language: repoInfo.language,
        size: repoInfo.size,
        stargazersCount: repoInfo.stargazers_count,
        forksCount: repoInfo.forks_count,
        createdAt: repoInfo.created_at,
        updatedAt: repoInfo.updated_at
      },
      languages,
      commits: commits.map(commit => ({
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date
      })),
      keyFiles,
      structure: contents.map(item => ({
        name: item.name,
        type: item.type,
        path: item.path
      }))
    };
  } catch (error) {
    if (error.status === 404) {
      throw new Error('Repository not found or is private');
    }
    throw new Error(`GitHub API error: ${error.message}`);
  }
}

// Helper function to determine if a file should be analyzed
function shouldAnalyzeFile(filename) {
  const importantFiles = [
    'package.json',
    'README.md',
    'tsconfig.json',
    'vite.config.js',
    'vite.config.ts',
    'webpack.config.js',
    'next.config.js',
    'tailwind.config.js',
    'tailwind.config.ts',
    '.eslintrc.js',
    '.eslintrc.json',
    'prettier.config.js'
  ];

  const importantExtensions = [
    '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rs', '.php'
  ];

  // Check if it's an important config file
  if (importantFiles.includes(filename.toLowerCase())) {
    return true;
  }

  // Check if it has an important extension
  return importantExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

// AI analysis function
async function performAIAnalysis(repositoryData, userDescription) {
  try {
    const prompt = `
Analyze this GitHub repository to determine how likely it is that the code was generated or heavily assisted by AI tools like ChatGPT, GitHub Copilot, or similar AI coding assistants.

Repository Information:
- Name: ${repositoryData.repoInfo.name}
- Description: ${repositoryData.repoInfo.description || 'No description'}
- User Description: ${userDescription}
- Primary Language: ${repositoryData.repoInfo.language}
- Languages: ${Object.keys(repositoryData.languages).join(', ')}
- Created: ${repositoryData.repoInfo.createdAt}
- Last Updated: ${repositoryData.repoInfo.updatedAt}

Recent Commit Messages:
${repositoryData.commits.slice(0, 5).map(commit => `- ${commit.message}`).join('\n')}

Key Files Analysis:
${repositoryData.keyFiles.map(file => `
File: ${file.name}
Content Preview: ${file.content.substring(0, 1000)}...
`).join('\n')}

Project Structure:
${repositoryData.structure.map(item => `${item.type}: ${item.name}`).join('\n')}

Please analyze this repository and provide:
1. An AI likelihood score from 0-100 (where 100 = definitely AI-generated, 0 = definitely human-written)
2. A detailed analysis explaining your reasoning
3. Specific patterns or indicators that suggest AI vs human authorship

Consider factors like:
- Code consistency and patterns
- Comment quality and style
- Naming conventions
- Error handling patterns
- Project structure organization
- Commit message patterns
- Documentation quality
- Complexity and sophistication level

Respond in JSON format:
{
  "aiLikelihoodScore": number,
  "analysis": "detailed explanation",
  "indicators": {
    "aiPatterns": ["list of AI-suggesting patterns"],
    "humanPatterns": ["list of human-suggesting patterns"]
  },
  "confidence": "high|medium|low"
}
`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code analyst specializing in detecting AI-generated code patterns. Provide accurate, unbiased analysis based on coding patterns, structure, and style.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const response = completion.choices[0].message.content;
    
    try {
      return JSON.parse(response);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        aiLikelihoodScore: 50,
        analysis: response,
        indicators: {
          aiPatterns: [],
          humanPatterns: []
        },
        confidence: 'low'
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Main project submission endpoint
app.post('/api/projects', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = projectSubmissionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const { githubUrl, description } = value;

    // Parse GitHub URL
    let owner, repo;
    try {
      ({ owner, repo } = parseGitHubUrl(githubUrl));
    } catch (parseError) {
      return res.status(400).json({
        error: 'Invalid GitHub URL',
        message: parseError.message
      });
    }

    // Check if repository exists and is accessible
    try {
      await octokit.rest.repos.get({ owner, repo });
    } catch (repoError) {
      if (repoError.status === 404) {
        return res.status(404).json({
          error: 'Repository not found',
          message: 'The repository does not exist or is private'
        });
      }
      throw repoError;
    }

    // Analyze repository
    console.log(`Analyzing repository: ${owner}/${repo}`);
    const repositoryData = await analyzeRepository(owner, repo);

    // Perform AI analysis
    console.log('Performing AI analysis...');
    const aiAnalysis = await performAIAnalysis(repositoryData, description);

    // Create project data
    const projectData = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      repoName: `${owner}/${repo}`,
      description,
      githubUrl,
      aiVibeScore: aiAnalysis.aiLikelihoodScore,
      analysis: aiAnalysis.analysis,
      indicators: aiAnalysis.indicators,
      confidence: aiAnalysis.confidence,
      submittedBy: 'anonymous', // TODO: Replace with actual user when auth is implemented
      submittedDate: new Date().toISOString(),
      voteCount: 0,
      commentCount: 0,
      repositoryData: {
        languages: repositoryData.languages,
        size: repositoryData.repoInfo.size,
        stars: repositoryData.repoInfo.stargazersCount,
        forks: repositoryData.repoInfo.forksCount,
        createdAt: repositoryData.repoInfo.createdAt,
        updatedAt: repositoryData.repoInfo.updatedAt
      },
      tags: [
        repositoryData.repoInfo.language,
        ...Object.keys(repositoryData.languages).slice(0, 3)
      ].filter(Boolean)
    };

    // TODO: Save to database
    console.log('Project analyzed successfully:', projectData.id);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Project submitted and analyzed successfully',
      project: {
        id: projectData.id,
        repoName: projectData.repoName,
        aiVibeScore: projectData.aiVibeScore,
        analysis: projectData.analysis,
        confidence: projectData.confidence
      }
    });

  } catch (error) {
    console.error('Project submission error:', error);
    
    // Handle specific error types
    if (error.message.includes('GitHub API error')) {
      return res.status(502).json({
        error: 'GitHub API unavailable',
        message: 'Unable to access GitHub at this time. Please try again later.'
      });
    }
    
    if (error.message.includes('AI analysis failed')) {
      return res.status(502).json({
        error: 'AI analysis unavailable',
        message: 'Unable to perform AI analysis at this time. Please try again later.'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get all projects endpoint (placeholder for future database integration)
app.get('/api/projects', (req, res) => {
  // TODO: Implement database query to fetch projects
  res.json({
    message: 'Projects endpoint - database integration pending',
    projects: []
  });
});

// Get specific project endpoint (placeholder for future database integration)
app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  // TODO: Implement database query to fetch specific project
  res.json({
    message: `Project ${id} endpoint - database integration pending`,
    project: null
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 GitHub API: ${process.env.GITHUB_TOKEN ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🤖 OpenAI API: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
});

module.exports = app;