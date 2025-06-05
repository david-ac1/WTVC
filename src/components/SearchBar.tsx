
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockProjects } from "@/data/mockData";
import { Link } from "react-router-dom";
import ScoreBadge from "./ScoreBadge";

interface SearchBarProps {
  onSearchResults?: (results: any[]) => void;
  className?: string;
}

const SearchBar = ({ onSearchResults, className = "" }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      onSearchResults?.(mockProjects);
      return;
    }

    const queryLower = query.toLowerCase();
    
    const projectResults = mockProjects.filter(project => 
      project.repoName.toLowerCase().includes(queryLower) ||
      project.description.toLowerCase().includes(queryLower) ||
      project.submittedBy.toLowerCase().includes(queryLower) ||
      project.tags?.some(tag => tag.toLowerCase().includes(queryLower))
    );

    const results = [
      ...projectResults.map(project => ({
        ...project,
        type: 'project'
      }))
    ];

    setSearchResults(results);
    setShowResults(true);
    onSearchResults?.(results.filter(r => r.type === 'project'));
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    onSearchResults?.(mockProjects);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search r/WasThisVibeCodedAI"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-10 bg-gray-100 border-gray-300 rounded-full focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-sm text-gray-600 font-medium mb-2 px-2">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </div>
            
            {searchResults.map((result) => (
              <Link
                key={result.id}
                to={`/project/${result.id}`}
                className="block p-3 hover:bg-gray-50 rounded border-b border-gray-100 last:border-b-0"
                onClick={() => setShowResults(false)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {result.repoName}
                    </div>
                    <div className="text-gray-600 text-xs mt-1 line-clamp-2">
                      {result.description}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      u/{result.submittedBy} • {result.submittedDate}
                    </div>
                  </div>
                  <ScoreBadge score={result.aiVibeScore} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showResults && searchResults.length === 0 && searchQuery.trim() !== "" && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 p-4 text-center">
          <div className="text-gray-600 text-sm">
            No results found for "{searchQuery}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
