// src/pages/import-template.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ImportTemplatePage() {
  const [fileContent, setFileContent] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        JSON.parse(text); // Validate JSON
        setFileContent(text);
        setError('');
      } catch (err) {
        setError('Invalid JSON file');
        setFileContent('');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (fileContent) {
      // Save the imported template in localStorage
      localStorage.setItem('importedTemplate', fileContent);
      // Redirect to the Builder page
      router.push('/builder');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl mb-4">Import Chatbot Template</h1>
      <input type="file" accept=".json" onChange={handleFileChange} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {fileContent && (
        <div className="mt-4">
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{fileContent}</pre>
          <button
            onClick={handleImport}
            className="bg-green-500 text-white py-2 px-4 rounded mt-4"
          >
            Import Template and Open Builder
          </button>
        </div>
      )}
    </div>
  );
}
