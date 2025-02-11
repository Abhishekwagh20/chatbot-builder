// src/pages/chat.tsx
import { useState } from 'react';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [llmType, setLlmType] = useState('openai');
  const [saveStatus, setSaveStatus] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user's message
    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Send request to the chat API endpoint
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input, llmType }),
    });
    const data = await res.json();

    // Add bot's response
    const botMessage: Message = { sender: 'bot', text: data.response };
    setMessages((prev) => [...prev, botMessage]);

    setInput('');
  };

  const handleSaveConversation = async () => {
    // Convert messages array to a JSON string
    const conversation = JSON.stringify(messages, null, 2);

    try {
      const res = await fetch('/api/save-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: null, conversation }),
      });
      const result = await res.json();
      setSaveStatus(result.message || 'Conversation saved.');
    } catch (err) {
      setSaveStatus('Error saving conversation.');
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl mb-4">Chat Conversation</h1>
      <div className="border rounded p-4 mb-4 h-80 overflow-y-scroll bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-2 rounded ${
              msg.sender === 'user' ? 'text-right bg-blue-100' : 'text-left bg-green-100'
            }`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex space-x-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border rounded p-2"
          required
        />
        <select
          value={llmType}
          onChange={(e) => setLlmType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="openai">OpenAI</option>
          <option value="gemini">Gemini</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">
          Send
        </button>
      </form>
      <button
        onClick={handleSaveConversation}
        className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
      >
        Save Conversation
      </button>
      {saveStatus && <p>{saveStatus}</p>}
    </div>
  );
}
