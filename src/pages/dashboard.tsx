// src/pages/dashboard.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) return <p>Loading...</p>;

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>You must be logged in to access the dashboard.</p>
        <Link href="/login" className="text-blue-500 underline mt-4">Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl mb-4">Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link href="/" className="text-blue-500 underline">Home</Link>
          </li>
          <li>
            <Link href="/builder" className="text-blue-500 underline">Chatbot Builder</Link>
          </li>
          <li>
            <Link href="/save-template" className="text-blue-500 underline">Save Template</Link>
          </li>
          <li>
            <Link href="/view-templates" className="text-blue-500 underline">View Templates</Link>
          </li>
          <li>
            <Link href="/payment" className="text-blue-500 underline">Payment</Link>
          </li>
        </ul>
      </nav>
      <button
        onClick={handleSignOut}
        className="mt-8 bg-red-500 text-white py-2 px-4 rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
