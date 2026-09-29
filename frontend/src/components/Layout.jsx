import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  BookOpen, 
  Map, 
  BrainCircuit, 
  CheckSquare, 
  FolderGit2, 
  BarChart, 
  Library, 
  GitBranch,
  Menu,
  X,
  Search,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from './ui/button';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initially set dark mode
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: <BarChart className="w-5 h-5" /> },
    { name: 'Learning', path: '/learning', icon: <Map className="w-5 h-5" /> },
    { name: 'Roadmap', path: '/roadmap', icon: <BrainCircuit className="w-5 h-5" /> },
    { name: 'Playlists', path: '/playlists', icon: <Library className="w-5 h-5" /> },
    { name: 'Projects', path: '/projects', icon: <FolderGit2 className="w-5 h-5" /> },
    { name: 'Progress', path: '/progress', icon: <BarChart className="w-5 h-5" /> }
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <BrainCircuit className="w-6 h-6 text-primary" />
            <span>AI Engineer</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md font-medium' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t space-y-2">
          {/* Bottom links removed as per final functionality */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-10">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
            
            {/* Search Bar - hidden on small screens */}
            <div className="hidden sm:flex relative items-center">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search resources, topics..." 
                className="pl-9 pr-4 py-2 bg-secondary rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    window.location.href = `/resources?q=${encodeURIComponent(e.target.value.trim())}`;
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
              JS
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto pb-20 md:pb-0">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/90 backdrop-blur-lg flex justify-around p-2 pb-safe z-50">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
