import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Plus, User } from "lucide-react";
import SearchBar from "./SearchBar";

const TopBar = () => {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-300 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-2 flex justify-between items-center gap-4">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <img 
            src="/ChatGPT Image Jun 6, 2025, 03_21_24 PM.png" 
            alt="VibeCode Logo" 
            className="w-10 h-10 object-contain rounded-full border border-black"
            style={{ borderWidth: '0.5px' }}
          />
          <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
            WasThisVibeCoded?
          </h1>
        </Link>
        
        {/* Desktop search bar */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <SearchBar />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="hidden md:flex text-gray-600 hover:text-gray-900">
            <Search className="h-4 w-4" />
          </Button>
          
          <Link to="/submit">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Create Post</span>
            </Button>
          </Link>
          
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Log In</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;