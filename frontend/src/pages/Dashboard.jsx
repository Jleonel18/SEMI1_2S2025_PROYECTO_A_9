import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  HeartIcon, 
  FaceSmileIcon, 
  MicrophoneIcon, 
  DocumentTextIcon, 
  CalendarIcon 
} from '@heroicons/react/24/solid';
import MoodForm from './MoodForm';
import MoodChart from './MoodChart';
import AudioUpload from '../components/AudioUpload';
import DiarySection from '../components/DiarySection';
import Chatbot from '../components/Chatbot'; // Importado correctamente

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Carga el usuario y moodLevel desde localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser({
        ...parsed,
        moodLevel: parsed.moodLevel || 'neutral' // Asegura moodLevel
      });
    }
  }, []);

  // Si no hay usuario, muestra pantalla de carga
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <p className="text-xl text-gray-600">Cargando tu sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">MindBalance</h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="text-gray-600 hover:text-red-500 font-medium transition"
        >
          Cerrar sesión
        </button>
      </nav>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          ¡Hola, <span className="text-green-600">{user.username}</span>! 
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-4 font-medium transition whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`pb-2 px-4 font-medium transition whitespace-nowrap ${
              activeTab === 'audio' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Audio Diario
          </button>
          <button
            onClick={() => setActiveTab('diary')}
            className={`pb-2 px-4 font-medium transition whitespace-nowrap ${
              activeTab === 'diary' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Diario Escrito
          </button>
          <button
            onClick={() => setActiveTab('therapy')}
            className={`pb-2 px-4 font-medium transition whitespace-nowrap ${
              activeTab === 'therapy' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Terapia
          </button>
        </div>

        {/* === PESTAÑA: RESUMEN === */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Formulario de humor */}
              <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <FaceSmileIcon className="h-8 w-8 text-green-500 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-700">Registro de Humor Diario</h3>
                </div>
                <p className="text-gray-500 mb-4 text-sm">
                  Evalúa cómo te sientes hoy y escribe una breve nota sobre tu día.
                </p>
                <MoodForm 
                  userId={user.id} 
                  onSaved={() => setRefresh(!refresh)} 
                />
              </div>

              {/* Gráfico de progreso */}
              <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <ChartBarIcon className="h-8 w-8 text-blue-500 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-700">Tu Progreso Reciente</h3>
                </div>
                <MoodChart key={refresh} userId={user.id} />
              </div>
            </div>

            {/* Mensaje motivacional */}
            <div className="mt-12 text-center">
              <HeartIcon className="h-8 w-8 text-pink-500 mx-auto mb-3" />
              <p className="text-lg text-gray-600 italic">
                “Cada día cuenta. Escucha a tu mente y celebra tu progreso.” 
              </p>
            </div>
          </>
        )}

        {/* === PESTAÑA: AUDIO DIARIO === */}
        {activeTab === 'audio' && (
          <AudioUpload user={user} onUploadSuccess={() => setRefresh(!refresh)} />
        )}

        {/* === PESTAÑA: DIARIO ESCRITO === */}
        {activeTab === 'diary' && (
          <DiarySection user={user} onRefresh={() => setRefresh(!refresh)} />
        )}

        {/* === PESTAÑA: TERAPIA VIRTUAL === */}
        {activeTab === 'therapy' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <HeartIcon className="h-8 w-8 text-pink-500 mr-2" />
                <h3 className="text-xl font-semibold text-gray-700">Terapia Virtual</h3>
              </div>
              <p className="text-gray-500 mb-6 text-sm">
                Habla con tu terapeuta virtual. Todo es confidencial y seguro.
              </p>
              <Chatbot 
                userId={user.id} 
                moodLevel={user.moodLevel}           // Usa moodLevel real
                sessionId={`user_${user.id}`}         // sessionId válido para Lex
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;