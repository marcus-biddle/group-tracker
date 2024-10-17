import React, { useState } from 'react';
import { loginUser, registerUser } from '../../api/authApi';
import { useNavigate } from 'react-router';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup
  const [ newUserCreated, setNewUserCreated ] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => setIsLogin(!isLogin); // Toggle between login and signup

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Handle login logic here
      // console.log('Login:', { email, password });
      const data = await loginUser({ email, password });
      console.log('User logged in: ', data);
      navigate('/')
    } else {
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      // Handle sign-up logic here
      // console.log('Sign Up:', { email, password });
      const data = await registerUser({ email, password });
      console.log('User register: ', data);
      setIsLogin(true);
      setNewUserCreated(true);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Login' : 'Create Account'}
        </h2>
        {newUserCreated && <p>New user created. Please login.</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password Field (Only for Signup) */}
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Toggle Form Button */}
        <div className="text-center mt-4">
          {isLogin ? (
            <p className="text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={toggleForm}
                className="text-indigo-600 hover:underline"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p className="text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={toggleForm}
                className="text-indigo-600 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
