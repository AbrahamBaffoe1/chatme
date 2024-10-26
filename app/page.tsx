
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LandingPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        // Store the user ID/token in localStorage or cookies
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/chat');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl mb-8">Welcome to ChatApp</h1>
      <button
        onClick={handleSignup}
        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Signing Up...' : 'Get Started'}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default LandingPage;
