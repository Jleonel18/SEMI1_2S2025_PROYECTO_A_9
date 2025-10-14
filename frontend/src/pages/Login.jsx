import React, { useState } from 'react';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
      {/* Subtle background pattern for calm */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="calm-waves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q 25 30, 50 50 T 100 50" fill="none" stroke="#60A5FA" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#calm-waves)" />
        </svg>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md relative z-10 border border-gray-100">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center mb-4 shadow-md">
            <span className="text-white text-2xl font-bold">MB</span>
          </div>
          <h2 className="text-3xl font-semibold text-gray-800">Bienvenido a MindBalance</h2>
          <p className="text-gray-500 mt-2">Cuida tu mente, un paso a la vez</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                placeholder="Tu usuario"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                placeholder="Tu contraseña"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 rounded-lg hover:from-blue-500 hover:to-blue-600 transition duration-300 shadow-md font-medium"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          ¿Nuevo en MindBalance? <a href="/register" className="text-blue-500 hover:text-blue-600 font-medium transition">Crea una cuenta</a>
        </p>
      </div>
    </div>
  );
};

export default Login;