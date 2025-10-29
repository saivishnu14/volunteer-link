import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/ProjectCard';
import { Heart, Users, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projects } from '@/lib/storage';

const Index = () => {
  const navigate = useNavigate();
  const featuredProjects = projects.getAll().slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Connect. Volunteer. Make an Impact.
            </h1>
            <p className="text-xl text-muted-foreground">
              Join Volunteer Link to discover meaningful opportunities and connect with projects that matter to your community.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => navigate('/projects')} className="gap-2">
                <Heart className="h-5 w-5" />
                Browse Projects
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-3xl font-bold text-foreground">500+</h3>
              <p className="text-muted-foreground">Active Volunteers</p>
            </div>
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 mx-auto text-secondary" />
              <h3 className="text-3xl font-bold text-foreground">120+</h3>
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 mx-auto text-accent" />
              <h3 className="text-3xl font-bold text-foreground">10K+</h3>
              <p className="text-muted-foreground">Hours Contributed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Opportunities</h2>
            <p className="text-muted-foreground">Discover projects that need your help right now</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" onClick={() => navigate('/projects')}>
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-card/50">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 Volunteer Link. Empowering communities through volunteering.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
