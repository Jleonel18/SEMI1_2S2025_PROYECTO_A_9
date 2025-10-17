import React, { useState, useEffect } from 'react';
import { DocumentTextIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const DiarySection = ({ user, onRefresh }) => {
  const [analyses, setAnalyses] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState(null); // Añadimos el estado para errores

  useEffect(() => {
    fetchAnalyses();
  }, [user.id, onRefresh]);

  const fetchAnalyses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token available');
      const response = await fetch(`http://localhost:4000/api/listado/get-user-analyses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const data = await response.json();
      setAnalyses(data);
      setError(null); // Limpiamos el error si la solicitud es exitosa
    } catch (err) {
      console.error('Error fetching analyses:', err);
      setError(err.message); // Guardamos el mensaje de error
    }
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE': return 'bg-green-100 text-green-800';
      case 'NEGATIVE': return 'bg-red-100 text-red-800';
      case 'NEUTRAL': return 'bg-gray-100 text-gray-800';
      case 'MIXED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <DocumentTextIcon className="h-8 w-8 text-blue-500 mr-2" />
        <h3 className="text-xl font-semibold text-gray-700">Entradas de Diario Anteriores</h3>
      </div>
      <p className="text-gray-500 mb-4 text-sm">
        Descubre insights emocionales de tus audios con un diseño innovador: tarjetas interactivas, colores intuitivos y recomendaciones personalizadas para un viaje de autodescubrimiento sereno.
      </p>
      {error && (
        <div className="text-red-600 text-center mb-4">{error}</div> // Mostramos el error al usuario
      )}
      {analyses.length > 0 ? (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <div key={analysis.id_analyses} className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(analysis.id_analyses)}>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(analysis.sentiment_result.sentiment)}`}>
                    {analysis.sentiment_result.sentiment}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">{analysis.file_key}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <span>{new Date(analysis.analysis_date).toLocaleDateString()}</span>
                  <ChevronDownIcon className={`h-5 w-5 ml-2 transition-transform ${expanded[analysis.id_analyses] ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {expanded[analysis.id_analyses] && (
                <div className="mt-4 text-sm text-gray-700 animate-fadeIn">
                  <p><strong>Transcripción:</strong> {analysis.transcription}</p>
                  <p><strong>Estado:</strong> {analysis.statusanalysis}</p>
                  <p><strong>Recomendación:</strong> {analysis.recommendation}</p>
                  <p><strong>Puntuaciones:</strong></p>
                  <ul className="list-disc pl-5">
                    <li>Positivo: {(analysis.sentiment_result.scores.Positive * 100).toFixed(2)}%</li>
                    <li>Negativo: {(analysis.sentiment_result.scores.Negative * 100).toFixed(2)}%</li>
                    <li>Neutral: {(analysis.sentiment_result.scores.Neutral * 100).toFixed(2)}%</li>
                    <li>Mixto: {(analysis.sentiment_result.scores.Mixed * 100).toFixed(2)}%</li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">No hay entradas aún. ¡Sube un audio para comenzar!</div>
      )}
    </div>
  );
};

export default DiarySection;