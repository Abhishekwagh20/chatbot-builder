// src/pages/view-templates.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ViewTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('chat_templates')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching templates:', error.message);
      } else {
        setTemplates(data || []);
      }
      setLoading(false);
    };

    fetchTemplates();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl mb-4">Saved Chatbot Templates</h1>
      {loading ? (
        <p>Loading templates...</p>
      ) : templates.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        <ul>
          {templates.map((template) => (
            <li key={template.id} className="border p-4 rounded mb-4">
              <p className="text-sm text-gray-500">
                Created at: {new Date(template.created_at).toLocaleString()}
              </p>
              <pre className="whitespace-pre-wrap">{template.template}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
