import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { projects, auth } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const project = projects.getById(id!);
  const user = auth.getCurrentUser();

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project not found</h1>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  const isApplied = user?.joinedProjects.includes(project.id);

  const handleApply = () => {
    if (!user) {
      toast({ title: 'Please login to apply', variant: 'destructive' });
      navigate('/auth');
      return;
    }

    const success = projects.applyToProject(project.id);
    if (success) {
      toast({ title: 'Application submitted!', description: 'You have successfully joined this project.' });
      window.location.reload();
    } else {
      toast({ title: 'Unable to apply', description: 'Project is full or you have already applied.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/projects')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg overflow-hidden h-96">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-foreground">{project.title}</h1>
                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground mb-6">{project.description}</p>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Project Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">{new Date(project.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">{project.duration}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">{project.volunteers}/{project.maxVolunteers} volunteers enrolled</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Requirements</h2>
                  <ul className="space-y-2">
                    {project.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2 text-foreground">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Organized by</p>
                  <p className="font-semibold text-foreground">{project.organizer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <Badge>{project.category}</Badge>
                </div>
                {isApplied ? (
                  <Button className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Already Applied
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={handleApply}
                    disabled={project.volunteers >= project.maxVolunteers}
                  >
                    {project.volunteers >= project.maxVolunteers ? 'Project Full' : 'Apply Now'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
