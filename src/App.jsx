import React, { useState, useRef } from 'react';
import './index.css';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('http://127.0.0.1:5000/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setResult('Error: Unable to contact backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoice = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    recognition.onresult = (event) => {
      setQuery(event.results[0][0].transcript);
    };
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    setResult('');

    try {
      const response = await fetch('http://127.0.0.1:5000/image-nutrition', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setResult('Image error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-6">🥗 AI Nutrition Agent</h1>
        <form onSubmit={handleSubmit} className="flex gap-4 justify-center mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 1 apple, 2 eggs, 1 banana"
            className="flex-grow border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
          >
            {loading ? 'Analyzing...' : 'Get Nutrition'}
          </button>
        </form>

        <div className="flex gap-4 justify-center mb-6">
          <button onClick={handleVoice} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            🎤 Voice Input
          </button>
          <button onClick={() => fileInputRef.current.click()} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            📷 Upload Image
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>

        <div className="mt-6 text-left bg-gray-50 rounded p-4 border shadow">
          <h2 className="text-xl font-semibold text-green-800 mb-2">AI Response:</h2>
          <p className="whitespace-pre-wrap text-gray-700">
            {loading ? '⏳ Thinking...' : result || 'No result yet.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;