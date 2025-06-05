
import { useParams } from "react-router-dom";
import TopBar from "@/components/TopBar";
import ProjectCard from "@/components/ProjectCard";
import { User, Calendar, Code } from "lucide-react";
import { mockProjects } from "@/data/mockData";

const Profile = () => {
  const { username } = useParams();
  
  // Filter projects by user (placeholder logic)
  const userProjects = mockProjects.filter(project => 
    project.submittedBy === username
  );

  const userStats = {
    joinDate: "March 2024",
    totalProjects: userProjects.length,
    totalVotes: userProjects.reduce((sum, project) => sum + project.voteCount, 0),
    avgAiScore: userProjects.length > 0 
      ? Math.round(userProjects.reduce((sum, project) => sum + project.aiVibeScore, 0) / userProjects.length)
      : 0
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <TopBar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{username}</h1>
              <div className="flex items-center text-gray-400 text-sm mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                Joined {userStats.joinDate}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userStats.totalProjects}</div>
              <div className="text-gray-400 text-sm">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{userStats.totalVotes}</div>
              <div className="text-gray-400 text-sm">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{userStats.avgAiScore}%</div>
              <div className="text-gray-400 text-sm">Avg AI Score</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Code className="h-5 w-5 text-gray-400" />
            <h2 className="text-xl font-bold text-white">Submitted Projects</h2>
          </div>
          
          {userProjects.length > 0 ? (
            <div className="space-y-6">
              {userProjects.map((project) => (
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <Code className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No projects yet</h3>
              <p className="text-gray-500">This user hasn't submitted any projects to evaluate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
