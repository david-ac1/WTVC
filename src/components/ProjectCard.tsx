
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown, MessageSquare, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScoreBadge from "./ScoreBadge";

interface ProjectCardProps {
  id: string;
  repoName: string;
  description: string;
  aiVibeScore: number;
  voteCount: number;
  commentCount: number;
  submittedBy: string;
  submittedDate: string;
}

const ProjectCard = ({
  id,
  repoName,
  description,
  aiVibeScore,
  voteCount,
  commentCount,
  submittedBy,
  submittedDate
}: ProjectCardProps) => {
  const handleVote = (e: React.MouseEvent, direction: 'up' | 'down') => {
    e.preventDefault();
    console.log(`${direction} voted for project ${id}`);
  };

  return (
    <div className="bg-white rounded border border-gray-300 hover:border-gray-400 transition-colors">
      <div className="flex">
        {/* Vote section */}
        <div className="flex flex-col items-center bg-gray-50 p-2 w-12 rounded-l">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleVote(e, 'up')}
            className="p-1 h-6 w-6 text-gray-400 hover:text-orange-500 hover:bg-orange-50"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <span className="text-xs font-bold text-gray-900 py-1">{voteCount}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleVote(e, 'down')}
            className="p-1 h-6 w-6 text-gray-400 hover:text-blue-500 hover:bg-blue-50"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Content section */}
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">
                Posted by u/{submittedBy} • {submittedDate}
              </div>
              <Link 
                to={`/project/${id}`}
                className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors block mb-2"
              >
                {repoName}
              </Link>
              <p className="text-gray-700 text-sm mb-3 line-clamp-3">{description}</p>
            </div>
            <div className="ml-4">
              <ScoreBadge score={aiVibeScore} />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-gray-500">
            <Link to={`/project/${id}`}>
              <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:bg-gray-100 h-8 px-2">
                <MessageSquare className="h-3 w-3 mr-1" />
                {commentCount} Comments
              </Button>
            </Link>
            
            <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:bg-gray-100 h-8 px-2">
              <Share className="h-3 w-3 mr-1" />
              Share
            </Button>
            
            <Link to={`/project/${id}`}>
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:bg-blue-50 h-8 px-2">
                View Post
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
