
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Github, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SubmitProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    githubUrl: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.githubUrl || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Placeholder for project submission logic
    console.log("Submitting project:", formData);
    
    toast({
      title: "Project Submitted!",
      description: "Your project has been submitted for community evaluation.",
    });

    // Navigate back to homepage
    navigate("/");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative">
      {/* Humorous background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-20 text-5xl opacity-10 rotate-12">🚀</div>
        <div className="absolute bottom-40 left-20 text-4xl opacity-10 -rotate-12">📝</div>
        <div className="absolute top-60 left-1/4 text-3xl opacity-10">🎯</div>
      </div>

      <TopBar />
      
      <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <Github className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-purple-800 mb-4">Submit Your Project 🚀</h1>
          <p className="text-purple-600">
            Ready to find out if your code passes the vibe check? Let's see what the internet thinks! 🤔
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-purple-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="githubUrl" className="text-purple-800 text-sm font-medium">
                GitHub Repository URL *
              </Label>
              <Input
                id="githubUrl"
                type="url"
                placeholder="https://github.com/username/repository"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                className="mt-2 bg-white border-purple-200 text-purple-800 placeholder-purple-400"
                required
              />
              <p className="text-xs text-purple-500 mt-1">
                Must be a public GitHub repository (we're not hackers... yet)
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="text-purple-800 text-sm font-medium">
                Project Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Tell us about your masterpiece... or your 3 AM coding disaster"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="mt-2 bg-white border-purple-200 text-purple-800 placeholder-purple-400 resize-none"
                rows={4}
                required
              />
              <p className="text-xs text-purple-500 mt-1">
                Help others understand what your project does (or attempts to do)
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
              <h3 className="text-yellow-800 font-medium mb-2">What happens next? 🎭</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• The community will vote on how AI-coded your project feels</li>
                <li>• Our AI detective will analyze your code patterns</li>
                <li>• You'll discover if you code like a robot or a caffeinated human</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-200 hover:bg-blue-300 text-blue-800 border border-blue-300"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Project
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitProject;
