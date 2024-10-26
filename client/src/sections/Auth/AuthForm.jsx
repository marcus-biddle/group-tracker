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
    <div className="bg-secondaryMenu p-6 rounded-md space-y-8 mx-6">
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
              className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Toggle Form Button */}
        <div className="text-center mt-4">
          {isLogin ? (
            <Text size='small' color='mutedText'>
              Don't have an account?{' '}
              <Button
                size='small'
                type="button"
                onClick={toggleForm}
              >
                Create Account
              </Button>
            </Text>
          ) : (
            <Text size='small' color='mutedText'>
              Already have an account?{' '}
              <Button
                size='small'
                type="button"
                onClick={toggleForm}
                className="text-indigo-600 hover:underline"
              >
                Sign In
              </Button>
            </Text>
          )}
        </div>
    </div>
  );
};
