import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Login() {
  const [mode,setMode]=useState('login');
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const { login, register }=useAuth();
  const navigate=useNavigate();
  const location=useLocation();

  const handleSubmit=async e=>{
    e.preventDefault(); setError(''); setBusy(true);
    try{
      if(mode==='register') await register(username,email,password);
      else await login(email,password);
      const redirect=new URLSearchParams(location.search).get('redirect');
      navigate(redirect&&redirect.startsWith('/')&&!redirect.startsWith('//')?redirect:'/');
    }catch(err){setError(err.message||'Authentication failed.');}
    finally{setBusy(false);}
  };

  return <div className="flex items-center justify-center min-h-[70vh] px-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl">{mode==='login'?'Welcome Back':'Create Account'}</CardTitle>
        <p className="text-sm text-muted-foreground">Sign in to save progress, assignments, projects and video progress.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode==='register'&&<div className="space-y-2"><label className="text-sm font-medium">Username</label><Input value={username} onChange={e=>setUsername(e.target.value)} required minLength={3}/></div>}
          <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
          <div className="space-y-2"><label className="text-sm font-medium">Password</label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8}/></div>
          {error&&<p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>{busy?'Please wait…':mode==='login'?'Sign In':'Create Account'}</Button>
        </form>
        <button type="button" className="w-full mt-4 text-sm text-primary hover:underline" onClick={()=>{setMode(mode==='login'?'register':'login');setError('')}}>
          {mode==='login'?'Need an account? Create one':'Already have an account? Sign in'}
        </button>
      </CardContent>
    </Card>
  </div>;
}