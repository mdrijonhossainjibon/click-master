'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';


export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Handle successful login (e.g., redirect)
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg transition-all duration-300">


          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-blue-500/10 dark:bg-blue-400/20 rounded-full">
                <i className="fas fa-robot text-4xl text-blue-500 dark:text-blue-400"></i>
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Admin Panel
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Secure access to bot management
            </p>
          </div>

          {/* Social Login Section */}
          <div className="space-y-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/admin' })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-300 transition-all duration-200 text-gray-700 font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.766 12.277c0-.816-.067-1.636-.207-2.438H12.24v4.621h6.482c-.28 1.564-1.13 2.888-2.405 3.772v3.133h3.887c2.27-2.097 3.578-5.183 3.578-9.088z" fill="#4285F4"/>
                <path d="M12.24 24c3.24 0 5.956-1.075 7.932-2.907l-3.887-3.133c-1.079.748-2.46 1.189-4.045 1.189-3.114 0-5.748-2.103-6.688-4.928H1.54v3.238C3.48 21.2 7.575 24 12.24 24z" fill="#34A853"/>
                <path d="M5.552 14.22c-.239-.717-.376-1.482-.376-2.27 0-.788.137-1.553.376-2.27V6.442H1.54C.563 8.011 0 9.949 0 12c0 2.051.563 3.989 1.54 5.558l4.012-3.338z" fill="#FBBC05"/>
                <path d="M12.24 4.8c1.754 0 3.332.603 4.572 1.786l3.45-3.45C18.203 1.17 15.487 0 12.24 0 7.575 0 3.48 2.8 1.54 6.442l4.012 3.338c.94-2.825 3.574-4.928 6.688-4.928z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => signIn('facebook', { callbackUrl: '/admin' })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] rounded-lg border border-[#1877F2] transition-all duration-200 text-white font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>

            <button
              onClick={() => signIn('telegram', { callbackUrl: '/admin' })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#0088cc] hover:bg-[#0077b3] rounded-lg border border-[#0088cc] transition-all duration-200 text-white font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Continue with Telegram
            </button>

            <button
              onClick={() => signIn('github')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#24292F] hover:bg-[#1C2024] rounded-lg border border-gray-700 transition-all duration-200 text-white font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>
 
 

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Need help?{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              Contact support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}