import React, { useState } from 'react';
import { UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon, HomeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { registerUser } from '../services/authService';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyEmail, setEmergencyEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Added confirm password state
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState('');
  const [address, setAddress] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          username,
          email,
          emergencyEmail,
          password,
          phone,
          address,
          photo,
        }),
      });
  
      // Intenta leer la respuesta como texto primero
      const text = await response.text();
      console.log('Respuesta del servidor:', text);
  
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('No se pudo parsear JSON:', err);
        alert('Error inesperado del servidor (no JSON válido)');
        return;
      }
  
      if (response.ok) {
        alert('Registro exitoso 🎉');
        window.location.href = '/login';
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      alert('No se pudo registrar el usuario.');
    }
  };
  
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="calm-leaves" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
              <path d="M75 0 Q 100 25, 75 50 Q 50 25, 75 0" fill="#6EE7B7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#calm-leaves)" />
        </svg>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg relative z-10 border border-gray-100">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mb-4 shadow-md">
            <span className="text-white text-2xl font-bold">MB</span>
          </div>
          <h2 className="text-3xl font-semibold text-gray-800">Únete a MindBalance</h2>
          <p className="text-gray-500 mt-2">Comienza tu viaje hacia el equilibrio mental</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  placeholder="Elige un usuario"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="emergencyEmail" className="block text-sm font-medium text-gray-700 mb-1">Correo de Emergencia</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="emergencyEmail"
                  value={emergencyEmail}
                  onChange={(e) => setEmergencyEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  placeholder="emergencia@email.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {console.log('Password input:', e.target.value); setPassword(e.target.value)}}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  placeholder="Crea una contraseña segura"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  placeholder="Confirma tu contraseña"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Número de Teléfono</label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <div className="relative">
                <HomeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  placeholder="Tu dirección"
                  required
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
              URL de Foto de Perfil
            </label>
            <div className="relative">
              <input
                type="text"
                id="photo"
                value={photo || ''}
                onChange={(e) => setPhoto(e.target.value)}
                className="w-full pl-3 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                placeholder="https://ejemplo.com/mi-foto.jpg"
                
              />
            </div>
          </div>


          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-3 rounded-lg hover:from-green-500 hover:to-green-600 transition duration-300 shadow-md font-medium"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          ¿Ya eres miembro? <a href="/login" className="text-green-500 hover:text-green-600 font-medium transition">Inicia Sesión</a>
        </p>
      </div>
    </div>
  );
};

export default Register;