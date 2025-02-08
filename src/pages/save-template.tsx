// src/pages/save-template.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SaveTemplate() {
  const [template, setTemplate] = useState('');
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('chat_templates')
      .insert([{ template }]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Template saved successfully!');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl mb-4">Save Chatbot Template</h1>
      <form onSubmit={handleSave}>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="Paste your chatbot JSON configuration here..."
          className="border rounded p-2 w-full h-64"
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded mt-4"
        >
          Save Template
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
