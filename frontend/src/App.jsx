import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LearningPaths } from './pages/LearningPaths';
import { Roadmap } from './pages/Roadmap';
import { ProgressProvider } from './context/ProgressContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/use-toast';
import { TopicDetail } from './pages/TopicDetail';
import { PhaseDetail } from './pages/PhaseDetail';
import { Projects } from './pages/Projects';
import { Assignments } from './pages/Assignments';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Resources } from './pages/Resources';
import { Playlists } from './pages/Playlists';
import { ProgressDashboard } from './pages/ProgressDashboard';
import { SubtopicDetail } from './pages/SubtopicDetail';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ProgressProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="learning" element={<LearningPaths />} />
                <Route path="learning/:pathId" element={<LearningPaths />} />
                <Route path="learning/:pathId/:phaseId" element={<PhaseDetail />} />
                <Route path="learning/:pathId/:phaseId/:topicId" element={<TopicDetail />} />
                <Route path="learning/:pathId/:phaseId/:topicId/:subtopicId" element={<SubtopicDetail />} />
                <Route path="roadmap" element={<Roadmap />} />
                <Route path="playlists" element={<Playlists />} />
                <Route path="projects" element={<Projects />} />
                <Route path="assignments" element={<Assignments />} />
                <Route path="knowledge-base" element={<KnowledgeBase />} />
                <Route path="progress" element={<ProgressDashboard />} />
                <Route path="resources" element={<Resources />} />
                <Route path="login" element={<Login />} />
                {/* Admin-only route */}
                <Route
                  path="admin"
                  element={
                    <ProtectedRoute requireAuth requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </Router>
        </ProgressProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
