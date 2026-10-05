import React, { useState, useEffect } from 'react';
import {
  Users, Shield, ShieldCheck, Trash2, RefreshCw,
  BarChart3, BookOpen, CheckSquare, FolderGit2,
  Search, ChevronDown, Crown, UserCheck, AlertTriangle,
  Eye, ThumbsUp, ThumbsDown, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { TOPICS } from '../data/roadmap';
import { VIDEOS } from '../data/videos';
import { PROJECTS } from '../data/learningData';

// ─── Stat Card ──────────────────────────────────────────────
function StatCard({ icon, label, value, color = 'primary' }) {
  const colorMap = {
    primary: 'from-primary/20 to-primary/5 border-primary/20 text-primary',
    green:   'from-green-500/20 to-green-500/5 border-green-500/20 text-green-400',
    amber:   'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
    red:     'from-red-500/20 to-red-500/5 border-red-500/20 text-red-400',
  };
  return (
    <div className={`rounded-xl border bg-gradient-to-br p-5 ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-3xl font-bold mt-1 text-foreground">{value ?? '—'}</p>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </div>
  );
}

// ─── Role Badge ──────────────────────────────────────────────
function RoleBadge({ role }) {
  return role === 'admin' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
      <Crown className="w-3 h-3" /> Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border">
      <UserCheck className="w-3 h-3" /> User
    </span>
  );
}

// ─── Status Badge ────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:  'bg-amber-500/15 text-amber-400 border-amber-500/30',
    approved: 'bg-green-500/15 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${map[status] || 'bg-secondary'}`}>
      {status === 'pending' && <Clock className="w-3 h-3" />}
      {status === 'approved' && <ThumbsUp className="w-3 h-3" />}
      {status === 'rejected' && <ThumbsDown className="w-3 h-3" />}
      {status}
    </span>
  );
}

// ─── Tabs ────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',     label: 'Overview',    icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'users',        label: 'Users',       icon: <Users className="w-4 h-4" /> },
  { id: 'submissions',  label: 'Submissions', icon: <CheckSquare className="w-4 h-4" /> },
];

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats]         = useState(null);
  const [users, setUsers]         = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [actionLoading, setActionLoading] = useState({});

  // ── Fetch data ─────────────────────────────────────────────
  const fetchData = async (tab) => {
    setLoading(true); setError('');
    try {
      if (tab === 'overview') {
        const data = await api.admin.getStats();
        setStats(data.stats ?? data);
      } else if (tab === 'users') {
        const data = await api.admin.getUsers();
        setUsers(data.users ?? data);
      } else if (tab === 'submissions') {
        const data = await api.admin.getSubmissions();
        setSubmissions(data.submissions ?? data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(activeTab); }, [activeTab]);

  // ── Actions ────────────────────────────────────────────────
  const setActionState = (key, val) => setActionLoading(prev => ({ ...prev, [key]: val }));

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmed = window.confirm(
      `Change ${currentRole === 'admin' ? 'admin → user' : 'user → admin'}?`
    );
    if (!confirmed) return;
    setActionState(userId, true);
    try {
      await api.admin.updateRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId || u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionState(userId, false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    setActionState('del_' + userId, true);
    try {
      await api.admin.deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId && u.id !== userId));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionState('del_' + userId, false);
    }
  };

  const handleReview = async (subId, status) => {
    setActionState('rev_' + subId, true);
    try {
      const submission = submissions.find(s => (s._id || s.id) === subId);
      if (!submission?.type) throw new Error('Submission type is missing.');
      await api.admin.reviewSubmission(subId, submission.type, status);
      setSubmissions(prev => prev.map(s => s._id === subId || s.id === subId ? { ...s, status } : s));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionState('rev_' + subId, false);
    }
  };

  // ── Filter ─────────────────────────────────────────────────
  const filteredUsers = users.filter(u =>
    !searchQuery ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="text-primary font-medium">{user?.username || user?.email}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchData(activeTab)}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/70 transition-colors text-sm font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <strong>Error:</strong> {error}
            <p className="text-xs mt-0.5 opacity-70">Some admin features require the backend API to be running.</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-secondary/60 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ─────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-secondary/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={<Users className="w-8 h-8" />}       label="Total Users"       value={stats?.totalUsers}       color="primary" />
                <StatCard icon={<ShieldCheck className="w-8 h-8" />} label="Admins"             value={stats?.totalAdmins}      color="amber" />
                <StatCard icon={<CheckSquare className="w-8 h-8" />} label="Submissions"        value={stats?.totalSubmissions} color="green" />
                <StatCard icon={<Clock className="w-8 h-8" />}       label="Pending Reviews"    value={stats?.pendingReviews}   color="red" />
              </div>

              {/* Activity Overview */}
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Platform Overview
                </h2>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  {[
                    { label: 'Total Topics', value: TOPICS.length, icon: <BookOpen className="w-4 h-4" /> },
                    { label: 'Total Videos', value: VIDEOS.length, icon: <Eye className="w-4 h-4" /> },
                    { label: 'Total Projects', value: PROJECTS.length, icon: <FolderGit2 className="w-4 h-4" /> },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 p-4 rounded-lg bg-secondary/40">
                      <span className="text-primary">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-lg">{item.value}</p>
                        <p className="text-muted-foreground text-xs">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── USERS TAB ────────────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-4 py-2.5 bg-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-border"
            />
          </div>

          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Role</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Joined</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(5)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 rounded bg-secondary animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-muted-foreground">
                        {searchQuery ? 'No users match your search.' : 'No users found. Is the backend running?'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const uid = u._id || u.id;
                      const isSelf = uid === (user?._id || user?.id);
                      return (
                        <tr key={uid} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xs">
                                {(u.username || u.email || 'U').slice(0, 2).toUpperCase()}
                              </div>
                              <span className="font-medium">{u.username || '—'}</span>
                              {isSelf && <span className="text-xs text-primary">(you)</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                          <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {/* Role toggle */}
                              <button
                                onClick={() => handleRoleChange(uid, u.role)}
                                disabled={actionLoading[uid] || isSelf}
                                title={isSelf ? "Can't change your own role" : `Make ${u.role === 'admin' ? 'User' : 'Admin'}`}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-secondary hover:bg-primary/20 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {actionLoading[uid] ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : u.role === 'admin' ? (
                                  <><Shield className="w-3 h-3" /> Demote</>
                                ) : (
                                  <><ShieldCheck className="w-3 h-3" /> Promote</>
                                )}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteUser(uid, u.username || u.email)}
                                disabled={actionLoading['del_' + uid] || isSelf}
                                title={isSelf ? "Can't delete yourself" : 'Delete user'}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {actionLoading['del_' + uid] ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {filteredUsers.length > 0 && (
              <div className="px-4 py-3 border-t bg-secondary/20 text-xs text-muted-foreground">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SUBMISSIONS TAB ──────────────────────────────────── */}
      {activeTab === 'submissions' && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Item</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Submitted</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 rounded bg-secondary animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                      No submissions found.
                    </td>
                  </tr>
                ) : (
                  submissions.map(sub => {
                    const sid = sub._id || sub.id;
                    return (
                      <tr key={sid} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{sub.username || sub.userId || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-xs bg-secondary capitalize">{sub.type || '—'}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{sub.itemId || sub.title || '—'}</td>
                        <td className="px-4 py-3"><StatusBadge status={sub.status} /></td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3">
                          {sub.status === 'pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleReview(sid, 'approved')}
                                disabled={actionLoading['rev_' + sid]}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/15 text-green-400 hover:bg-green-500/30 transition-all disabled:opacity-50"
                              >
                                {actionLoading['rev_' + sid] ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ThumbsUp className="w-3 h-3" />}
                                Approve
                              </button>
                              <button
                                onClick={() => handleReview(sid, 'rejected')}
                                disabled={actionLoading['rev_' + sid]}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
                              >
                                <ThumbsDown className="w-3 h-3" />
                                Reject
                              </button>
                            </div>
                          )}
                          {sub.status !== 'pending' && (
                            <span className="text-xs text-muted-foreground text-right block">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
