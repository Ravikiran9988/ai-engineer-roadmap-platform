import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldOff, Loader2 } from 'lucide-react';

/**
 * <ProtectedRoute>
 *   requireAuth   — redirect to /login if not logged in (default: true)
 *   requireAdmin  — show 403 if user is not admin (default: false)
 */
export function ProtectedRoute({ children, requireAuth = true, requireAdmin = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // ── Still checking auth token ──────────────────────────────
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Not logged in → redirect to login ─────────────────────
  if (requireAuth && !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // ── Logged in but not admin → 403 Forbidden ───────────────
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldOff className="w-10 h-10 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground max-w-sm">
            You don't have permission to access this page.
            This area is restricted to administrators only.
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
}
