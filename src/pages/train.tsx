// src/pages/train.tsx
import { useState } from 'react';

export default function TrainPage() {
  const [data, setData] = useState('');
  const [responseMsg, setResponseMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/train', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    const result = await res.json();
    setResponseMsg(JSON.stringify(result));
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl mb-4">Upload Training Data</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="border rounded p-2 w-full"
          value={data}
          onChange={(e) => setData(e.target.value)}
          rows={6}
          placeholder="Enter training data here..."
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
          Upload
        </button>
      </form>
      {responseMsg && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold">Response:</h2>
          <p>{responseMsg}</p>
        </div>
      )}
    </div>
  );
}
