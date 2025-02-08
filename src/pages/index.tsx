// src/pages/index.tsx
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [llmType, setLlmType] = useState('openai');
  const [responseText, setResponseText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, llmType })
    });
    const data = await res.json();
    setResponseText(data.response);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl mb-4">Chatbot Builder</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Prompt:
          <textarea
            className="border rounded p-2 w-full"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </label>
        <label className="block mb-2">
          Select LLM:
          <select
            className="border rounded p-2 w-full"
            value={llmType}
            onChange={(e) => setLlmType(e.target.value)}
          >
            <option value="openai">OpenAI</option>
            <option value="gemini">Gemini</option>
          </select>
        </label>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Send
        </button>
      </form>
      {responseText && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold">Response:</h2>
          <p>{responseText}</p>
        </div>
      )}
    </div>
  );
}
