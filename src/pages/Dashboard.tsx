import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { auth, projects } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { User, Heart, Award } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(auth.getCurrentUser());
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  const myProjects = projects.getAll().filter(p => user.joinedProjects.includes(p.id));

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: interests.split(',').map(i => i.trim()).filter(Boolean),
    };
    auth.updateUser(updates);
    setUser(auth.getCurrentUser());
    toast({ title: 'Profile updated successfully!' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Manage your volunteer activities and profile</p>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">
              <Heart className="h-4 w-4 mr-2" />
              My Projects
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold text-foreground">{myProjects.length}</p>
                    <p className="text-sm text-muted-foreground">Projects Joined</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-secondary" />
                    <p className="text-2xl font-bold text-foreground">{myProjects.length * 3}</p>
                    <p className="text-sm text-muted-foreground">Hours Volunteered</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <User className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <p className="text-2xl font-bold text-foreground">{user.role}</p>
                    <p className="text-sm text-muted-foreground">Role</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {myProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground mb-4">You haven't joined any projects yet</p>
                  <Button onClick={() => navigate('/projects')}>Browse Projects</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" defaultValue={user.name} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      defaultValue={user.bio} 
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input 
                      id="skills" 
                      value={skills || user.skills.join(', ')} 
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g., Teaching, Gardening, Organizing"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests (comma separated)</Label>
                    <Input 
                      id="interests" 
                      value={interests || user.interests.join(', ')} 
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="e.g., Environment, Education, Community"
                    />
                  </div>
                  
                  {user.skills.length > 0 && (
                    <div className="space-y-2">
                      <Label>Current Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
