import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { auth, projects, Project } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = auth.getCurrentUser();
  const [allProjects, setAllProjects] = useState(projects.getAll());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast({ title: 'Access denied', description: 'Admin access required', variant: 'destructive' });
      navigate('/dashboard');
    }
  }, [user, navigate, toast]);

  if (!user || user.role !== 'admin') return null;

  const handleCreateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProject = projects.create({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      location: formData.get('location') as string,
      duration: formData.get('duration') as string,
      volunteers: 0,
      maxVolunteers: parseInt(formData.get('maxVolunteers') as string),
      startDate: formData.get('startDate') as string,
      status: formData.get('status') as 'active' | 'completed' | 'upcoming',
      organizer: formData.get('organizer') as string,
      requirements: (formData.get('requirements') as string).split(',').map(r => r.trim()),
      image: formData.get('image') as string || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
    });
    setAllProjects(projects.getAll());
    setIsDialogOpen(false);
    toast({ title: 'Project created successfully!' });
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      projects.delete(id);
      setAllProjects(projects.getAll());
      toast({ title: 'Project deleted' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage volunteer projects and activities</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizer">Organizer</Label>
                    <Input id="organizer" name="organizer" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" name="duration" placeholder="e.g., 3 hours" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxVolunteers">Max Volunteers</Label>
                    <Input id="maxVolunteers" name="maxVolunteers" type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" name="startDate" type="date" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue="active">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements (comma separated)</Label>
                  <Input id="requirements" name="requirements" placeholder="e.g., Physical fitness, Team player" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" name="image" type="url" placeholder="https://..." />
                </div>
                <Button type="submit" className="w-full">Create Project</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Volunteers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell>{project.location}</TableCell>
                    <TableCell>{project.volunteers}/{project.maxVolunteers}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        project.status === 'active' ? 'bg-accent/20 text-accent-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {project.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${project.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
