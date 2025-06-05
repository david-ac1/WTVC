
import { useParams, Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import ScoreBadge from "@/components/ScoreBadge";
import CommentBox from "@/components/CommentBox";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ExternalLink, Share, ArrowLeft } from "lucide-react";
import { mockProjects, mockComments } from "@/data/mockData";

const ProjectDetails = () => {
  const { id } = useParams();
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100">
        <TopBar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const handleVote = (direction: 'up' | 'down') => {
    console.log(`${direction} voted for project ${id}`);
  };

  const handleAddComment = (content: string) => {
    console.log("Adding comment:", content);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to r/WasThisVibeCodedAI
        </Link>

        {/* Main post */}
        <div className="bg-white rounded border border-gray-300 mb-6">
          <div className="flex">
            {/* Vote section */}
            <div className="flex flex-col items-center bg-gray-50 p-4 w-16 rounded-l">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('up')}
                className="p-2 h-8 w-8 text-gray-400 hover:text-orange-500 hover:bg-orange-50"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
              <span className="text-sm font-bold text-gray-900 py-2">{project.voteCount}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('down')}
                className="p-2 h-8 w-8 text-gray-400 hover:text-blue-500 hover:bg-blue-50"
              >
                <ArrowDown className="h-5 w-5" />
              </Button>
            </div>

            {/* Content section */}
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-2">
                    Posted by u/{project.submittedBy} • {project.submittedDate}
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <h1 className="text-2xl font-bold text-gray-900">{project.repoName}</h1>
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                  <p className="text-gray-700 text-base mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <ScoreBadge score={project.aiVibeScore} size="lg" />
              </div>

              <div className="bg-gray-50 rounded p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h2>
                <p className="text-gray-700 leading-relaxed">{project.analysis}</p>
              </div>

              <div className="flex items-center space-x-4 text-gray-500 border-t pt-4">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <span className="text-sm">{project.commentCount} comments</span>
              </div>
            </div>
          </div>
        </div>

        <CommentBox 
          comments={mockComments}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
