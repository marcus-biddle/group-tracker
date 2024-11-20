import React, { useState } from 'react';
import { loginUser, registerUser } from '../../api/authApi';
import { useNavigate } from 'react-router';
import Header from '../../components/Header';
import Text from '../../components/Text';
import Button from '../../components/Button';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup
  const [ newUserCreated, setNewUserCreated ] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ firstname, setFirstname ] = useState('');
  const [ lastname, setLastname ] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => setIsLogin(!isLogin); // Toggle between login and signup

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginPayload = { email, password };
    const signUpPayload = { email, password, firstname, lastname };

    if (isLogin) {
      // Handle login logic here
      // console.log('Login:', { email, password });
      const data = await loginUser(loginPayload);
      console.log('User logged in: ', data);
      navigate('/')
    } else {
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      // Handle sign-up logic here
      // console.log('Sign Up:', { email, password });
      const data = await registerUser(signUpPayload);
      console.log('User register: ', data);
      setIsLogin(true);
      setNewUserCreated(true);
    }
  };

  return (
    <div className="space-y-8 mx-6 mt-8">
      <Header level='h1' color='primaryText'>{isLogin ? 'Login' : 'Create Account'}</Header>
        {newUserCreated && <Text size='medium' color='mutedText'>New user created. Please login.</Text>}
        
        <form onSubmit={handleSubmit} className="space-y-4 text-secondaryText">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
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
            <label htmlFor="password" className="block text-sm font-medium ">
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
            <>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
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
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium ">
                  First Name
                </label>
                <input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium">
                  Last Name
                </label>
                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Last Name"
                />
              </div>
            </>
            
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full text-[#00B2CC] border border-[#00B2CC] bg-transparent"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Toggle Form Button */}
        <div className="text-center mt-4">
          {isLogin ? (
            <span className='text-[#7C7986]'>
              Don't have an account?{' '}
              <button
                onClick={toggleForm}
                className='bg-transparent p-0 underline text-[#00B2CC]'
              >
                Create Account
              </button>
            </span>
          ) : (
            <span className='text-[#7C7986]'>
              Already have an account?{' '}
              <button
                onClick={toggleForm}
                className="bg-transparent p-0 underline text-[#00B2CC]"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
    </div>
  );
};
