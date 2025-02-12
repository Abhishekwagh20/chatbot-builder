import { useState } from 'react';

export default function UploadPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus('Fetching upload URL...');
    // Get the pre-signed URL from our API
    const res = await fetch('/api/get-presigned-url');
    const { url, fileName } = await res.json();
    setUploadStatus('Uploading file...');
    // Upload the file directly to S3 using the pre-signed URL
    const uploadRes = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/pdf' },
      body: file,
    });
    if (uploadRes.ok) {
      setUploadStatus(`File uploaded successfully! File name: ${fileName}`);
      // Optionally, store fileName for later use (e.g., parsing)
    } else {
      setUploadStatus('Upload failed.');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl mb-4">Upload PDF File</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        Upload PDF
      </button>
      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
    </div>
  );
}
