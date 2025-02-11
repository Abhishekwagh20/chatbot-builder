// src/pages/chat-history.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ChatHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching chat history:', error.message);
      } else {
        setHistory(data || []);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl mb-4">Chat History</h1>
      {loading ? (
        <p>Loading chat history...</p>
      ) : history.length === 0 ? (
        <p>No chat history found.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((entry) => (
            <li key={entry.id} className="border p-4 rounded">
              <p className="text-sm text-gray-500">
                {new Date(entry.created_at).toLocaleString()}
              </p>
              <pre className="whitespace-pre-wrap">{entry.conversation}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
