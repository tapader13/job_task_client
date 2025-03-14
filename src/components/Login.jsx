import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [message, setMessage] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false); // Track if admin is logged in
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/admin/login', {
        username,
        password,
      });
      setToken(res.data.token);
      setAdminLoggedIn(true);
      setMessage('Login successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed.');
    }
  };

  if (!adminLoggedIn) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
          <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>
            Admin Login
          </h1>
          <div className='mb-4'>
            <input
              type='text'
              placeholder='Username'
              className='w-full p-3 mb-4 border rounded-lg'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type='password'
              placeholder='Password'
              className='w-full p-3 mb-4 border rounded-lg'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={handleLogin}
            className='w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300'
          >
            Login
          </button>
          {message && (
            <p
              className={`mt-4 text-center p-3 rounded-md ${
                message.includes('error')
                  ? 'bg-red-200 text-red-800'
                  : 'bg-green-200 text-green-800'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default Login;
