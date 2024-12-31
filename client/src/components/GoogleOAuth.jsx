import React from 'react';
import { handleGoogleSignIn } from '../api/Auth';

const GoogleOAuth = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in with Google</h1>
        <button
          onClick={() => handleGoogleSignIn()}
          className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <svg
            className="w-6 h-6 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.03 0 5.76 1.06 7.91 2.8l5.93-5.93C34.59 3.08 29.6 1 24 1 14.88 1 7.17 6.58 3.91 14.26l6.87 5.34C12.12 14.2 17.63 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.51 24.62c0-1.35-.12-2.64-.34-3.88H24v7.41h12.72c-.54 2.93-2.17 5.4-4.6 7.08l7.18 5.59c4.18-3.85 6.61-9.52 6.61-16.2z"
            />
            <path
              fill="#FBBC05"
              d="M10.77 29.6A13.48 13.48 0 0 1 10 24c0-1.9.37-3.71 1.03-5.34l-6.87-5.34C2.33 16.86 1 20.3 1 24s1.33 7.14 3.63 10.69l6.14-5.09z"
            />
            <path
              fill="#34A853"
              d="M24 47c5.6 0 10.3-1.87 13.74-5.07l-7.18-5.59C28.98 37.59 26.62 38.5 24 38.5c-6.37 0-11.88-4.7-13.77-11.1l-6.87 5.34C7.17 41.42 14.88 47 24 47z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default GoogleOAuth;
