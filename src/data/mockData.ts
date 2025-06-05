
export const mockProjects = [
  {
    id: "1",
    repoName: "openai/chatgpt-web",
    description: "A modern ChatGPT web interface built with React and TypeScript. Features include real-time streaming, conversation history, and custom prompts.",
    aiVibeScore: 92,
    voteCount: 234,
    commentCount: 45,
    submittedBy: "techdev_alex",
    submittedDate: "2 days ago",
    githubUrl: "https://github.com/openai/chatgpt-web",
    analysis: "This project exhibits strong AI-coding patterns with consistent TypeScript interfaces, standardized component structure, and predictable naming conventions. The use of modern React patterns and clean separation of concerns suggests heavy AI assistance in development.",
    tags: ["React", "TypeScript", "AI", "Chat"]
  },
  {
    id: "2", 
    repoName: "vercel/next.js-commerce",
    description: "An e-commerce template built with Next.js, featuring product catalogs, shopping cart, and payment integration with Stripe.",
    aiVibeScore: 76,
    voteCount: 189,
    commentCount: 32,
    submittedBy: "commerce_guru",
    submittedDate: "1 day ago",
    githubUrl: "https://github.com/vercel/commerce",
    analysis: "Mixed coding patterns suggest human creativity with AI assistance. Custom business logic shows human insight, while boilerplate components show AI generation patterns.",
    tags: ["Next.js", "E-commerce", "Stripe", "TypeScript"]
  },
  {
    id: "3",
    repoName: "microsoft/vscode-extension",
    description: "VS Code extension for enhanced productivity with AI-powered code suggestions and automated refactoring tools.",
    aiVibeScore: 88,
    voteCount: 156,
    commentCount: 28,
    submittedBy: "code_wizard",
    submittedDate: "3 days ago", 
    githubUrl: "https://github.com/microsoft/vscode-extension",
    analysis: "High AI coding patterns evident in consistent error handling, standardized extension APIs usage, and predictable folder structure. Comment patterns suggest automated documentation generation.",
    tags: ["VS Code", "Extension", "AI", "Productivity"]
  },
  {
    id: "4",
    repoName: "facebook/react-dashboard",
    description: "Modern dashboard template with data visualization, user management, and real-time analytics using React and D3.js.",
    aiVibeScore: 65,
    voteCount: 201,
    commentCount: 38,
    submittedBy: "dashboard_dev",
    submittedDate: "4 days ago",
    githubUrl: "https://github.com/facebook/react-dashboard", 
    analysis: "Creative data visualization implementations show human expertise, while component structure and styling patterns suggest AI assistance for boilerplate code generation.",
    tags: ["React", "Dashboard", "D3.js", "Analytics"]
  },
  {
    id: "5",
    repoName: "tailwindcss/ui-components",
    description: "Collection of beautiful UI components built with Tailwind CSS and React, featuring dark mode support and accessibility.",
    aiVibeScore: 94,
    voteCount: 312,
    commentCount: 67,
    submittedBy: "ui_master",
    submittedDate: "5 days ago",
    githubUrl: "https://github.com/tailwindcss/ui-components",
    analysis: "Extremely consistent component patterns, standardized prop interfaces, and systematic naming conventions strongly indicate AI-generated code with minimal human customization.",
    tags: ["Tailwind CSS", "React", "UI Components", "Dark Mode"]
  }
];

export const mockComments = [
  {
    id: "1",
    author: "code_reviewer",
    content: "The TypeScript interfaces are suspiciously perfect - no human writes this consistently clean code without some AI help!",
    timestamp: "2 hours ago",
    votes: 12
  },
  {
    id: "2", 
    author: "frontend_dev",
    content: "I disagree - this looks like experienced developer work. The custom hooks show real understanding of React patterns.",
    timestamp: "1 hour ago",
    votes: 8
  },
  {
    id: "3",
    author: "ai_detector",
    content: "The error handling patterns are too consistent across components. Definitely AI-assisted at minimum.",
    timestamp: "45 minutes ago", 
    votes: 15
  }
];
