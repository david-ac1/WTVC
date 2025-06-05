
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, ArrowDown, User } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  votes: number;
}

interface CommentBoxProps {
  comments: Comment[];
  onAddComment?: (content: string) => void;
}

const CommentBox = ({ comments, onAddComment }: CommentBoxProps) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded border border-gray-300 p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Comment as u/anonymous
        </h3>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
            rows={4}
          />
          <div className="flex justify-end mt-3 space-x-2">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => setNewComment("")}
              className="text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!newComment.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Comment
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-gray-400 hover:text-orange-500">
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <span className="text-xs font-bold text-gray-600">{comment.votes}</span>
                  <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-gray-400 hover:text-blue-500">
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">u/{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <button className="hover:text-gray-700">Reply</button>
                    <button className="hover:text-gray-700">Share</button>
                    <button className="hover:text-gray-700">Report</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
