"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AuthStatus {
  authenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
  env: {
    nextAuthUrl: string | undefined;
    nodeEnv: string | undefined;
  };
}

export default function TestPage() {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/test');
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        setAuthStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error checking auth:', err);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">NeuroLog Test Page</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">App Status</h2>
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
            <p>Loading authentication status...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 border border-red-300 rounded">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="p-4 bg-gray-100 border border-gray-300 rounded overflow-auto">
            <h3 className="text-lg font-medium">Authentication Status</h3>
            <pre className="mt-2 whitespace-pre-wrap">
              {JSON.stringify(authStatus, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/"
          className="block p-4 bg-purple-100 border border-purple-300 rounded hover:bg-purple-200 transition"
        >
          <h3 className="text-lg font-medium text-purple-800">Home Page</h3>
          <p className="text-purple-700">Return to the landing page</p>
        </Link>

        <Link
          href="/login"
          className="block p-4 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200 transition"
        >
          <h3 className="text-lg font-medium text-blue-800">Login Page</h3>
          <p className="text-blue-700">Test the authentication</p>
        </Link>

        <Link
          href="/templates"
          className="block p-4 bg-green-100 border border-green-300 rounded hover:bg-green-200 transition"
        >
          <h3 className="text-lg font-medium text-green-800">Templates</h3>
          <p className="text-green-700">Test the template functionality</p>
        </Link>

        <Link
          href="/media-showcase"
          className="block p-4 bg-amber-100 border border-amber-300 rounded hover:bg-amber-200 transition"
        >
          <h3 className="text-lg font-medium text-amber-800">Media Showcase</h3>
          <p className="text-amber-700">Test the media components</p>
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Login Test</h2>
        <div className="p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="mb-2"><strong>Email:</strong> neurosurgeon@example.com</p>
          <p className="mb-2"><strong>Password:</strong> password123</p>
          <p className="text-xs text-gray-600">These are mock credentials for demonstration purposes only.</p>
        </div>
      </div>
    </div>
  );
}
