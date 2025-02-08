// src/pages/login.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4 text-center">Login</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
          Send Magic Link
        </button>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
}
