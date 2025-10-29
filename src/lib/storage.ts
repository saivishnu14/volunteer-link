// LocalStorage-based data management for Volunteer Link

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'volunteer' | 'admin';
  skills: string[];
  interests: string[];
  bio: string;
  joinedProjects: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  duration: string;
  volunteers: number;
  maxVolunteers: number;
  startDate: string;
  status: 'active' | 'completed' | 'upcoming';
  organizer: string;
  requirements: string[];
  image: string;
}

const STORAGE_KEYS = {
  USERS: 'volunteer_link_users',
  PROJECTS: 'volunteer_link_projects',
  CURRENT_USER: 'volunteer_link_current_user',
};

// Initialize with mock data
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'Community Garden Cleanup',
        description: 'Help us maintain and beautify our local community garden. Activities include weeding, planting, and general maintenance.',
        category: 'Environment',
        location: 'Central Park Community Garden',
        duration: '3 hours',
        volunteers: 12,
        maxVolunteers: 20,
        startDate: '2025-11-05',
        status: 'active',
        organizer: 'Green Earth Initiative',
        requirements: ['Physical fitness', 'Outdoor work experience'],
        image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      },
      {
        id: '2',
        title: 'Food Bank Distribution',
        description: 'Assist with sorting, packing, and distributing food to families in need.',
        category: 'Community',
        location: 'City Food Bank',
        duration: '4 hours',
        volunteers: 8,
        maxVolunteers: 15,
        startDate: '2025-11-08',
        status: 'active',
        organizer: 'Helping Hands',
        requirements: ['Lifting capability', 'Team player'],
        image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
      },
      {
        id: '3',
        title: 'Youth Mentorship Program',
        description: 'Mentor young students in academics, career planning, and personal development.',
        category: 'Education',
        location: 'Lincoln High School',
        duration: 'Ongoing',
        volunteers: 15,
        maxVolunteers: 25,
        startDate: '2025-11-12',
        status: 'upcoming',
        organizer: 'Future Leaders',
        requirements: ['Background check', 'Communication skills'],
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(mockProjects));
  }
};

export const auth = {
  signup: (email: string, password: string, name: string): { success: boolean; error?: string } => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.find((u: User) => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'volunteer',
      skills: [],
      interests: [],
      bio: '',
      joinedProjects: [],
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return { success: true };
  },

  login: (email: string, password: string): { success: boolean; error?: string } => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u: User) => u.email === email);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return { success: true };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex((u: User) => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  },
};

export const projects = {
  getAll: (): Project[] => {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
  },

  getById: (id: string): Project | null => {
    const allProjects = projects.getAll();
    return allProjects.find(p => p.id === id) || null;
  },

  create: (project: Omit<Project, 'id'>): Project => {
    const allProjects = projects.getAll();
    const newProject = { ...project, id: Date.now().toString() };
    allProjects.push(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(allProjects));
    return newProject;
  },

  update: (id: string, updates: Partial<Project>) => {
    const allProjects = projects.getAll();
    const index = allProjects.findIndex(p => p.id === id);
    if (index !== -1) {
      allProjects[index] = { ...allProjects[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(allProjects));
    }
  },

  delete: (id: string) => {
    const allProjects = projects.getAll();
    const filtered = allProjects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
  },

  applyToProject: (projectId: string) => {
    const user = auth.getCurrentUser();
    if (!user) return false;
    
    const project = projects.getById(projectId);
    if (!project || project.volunteers >= project.maxVolunteers) return false;

    if (user.joinedProjects.includes(projectId)) return false;

    projects.update(projectId, { volunteers: project.volunteers + 1 });
    auth.updateUser({ joinedProjects: [...user.joinedProjects, projectId] });
    return true;
  },
};
