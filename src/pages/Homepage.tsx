
import { useState } from "react";
import TopBar from "@/components/TopBar";
import ProjectCard from "@/components/ProjectCard";
import SearchBar from "@/components/SearchBar";
import { mockProjects } from "@/data/mockData";

const Homepage = () => {
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchResults = (results: any[]) => {
    setFilteredProjects(results);
    setIsSearchActive(results.length !== mockProjects.length);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      
      <div className="max-w-5xl mx-auto flex gap-6 px-4 py-6">
        {/* Main content area */}
        <div className="flex-1 space-y-4">
          {/* Popular communities section (Reddit-style) */}
          <div className="bg-white rounded border border-gray-300 p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              w/WasThisVibeCodedAI
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Does your code pass the vibe check? Let's see! 🤖
            </p>
            
            {/* Mobile search bar */}
            <div className="md:hidden mb-4">
              <SearchBar onSearchResults={handleSearchResults} />
            </div>

            {isSearchActive && (
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Posts */}
          <div className="space-y-2">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  repoName={project.repoName}
                  description={project.description}
                  aiVibeScore={project.aiVibeScore}
                  voteCount={project.voteCount}
                  commentCount={project.commentCount}
                  submittedBy={project.submittedBy}
                  submittedDate={project.submittedDate}
                />
              ))
            ) : (
              <div className="bg-white rounded border border-gray-300 p-8 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse all projects</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-80 space-y-4">
          <div className="bg-white rounded border border-gray-300 p-4">
            <h3 className="font-bold text-gray-900 mb-3">About Community</h3>
            <p className="text-sm text-gray-600 mb-3">
              A community dedicated to analyzing code and determining whether it was written by humans or AI.
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <div>👥 {mockProjects.length} members</div>
              <div>🟢 Online now</div>
            </div>
          </div>

          <div className="bg-white rounded border border-gray-300 p-4">
            <h3 className="font-bold text-gray-900 mb-3">Rules</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div>1. Be respectful to all users</div>
              <div>2. No spam or self-promotion</div>
              <div>3. Provide constructive feedback</div>
              <div>4. Use proper flair for posts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
