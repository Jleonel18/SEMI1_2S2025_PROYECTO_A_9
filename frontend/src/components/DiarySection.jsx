import React, { useState, useEffect } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/solid';

const DiarySection = ({ user, onRefresh }) => {
  const [audios, setAudios] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchAudios();
  }, [user.id, onRefresh]);

  const fetchAudios = async () => {
    try {
      const response = await fetch(`/analyze/get-user-audios?user_id=${user.id}`);
      if (!response.ok) throw new Error('Error fetching audios');
      const data = await response.json();
      setAudios(data);
    } catch (err) {
      console.error('Error fetching audios:', err);
    }
  };

  const analyzeAudio = async (audioId) => {
    try {
      const response = await fetch('/analyze/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio_id: audioId }),
      });
      if (!response.ok) throw new Error('Error analyzing audio');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error analyzing audio:', err);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <DocumentTextIcon className="h-8 w-8 text-blue-500 mr-2" />
        <h3 className="text-xl font-semibold text-gray-700">Entradas de Diario Anteriores</h3>
      </div>
      <p className="text-gray-500 mb-4 text-sm">
        Aquí podrás ver análisis de emociones basados en tus audios.
      </p>
      <ul className="list-disc pl-5">
        {audios.map((audio) => (
          <li
            key={audio.Id_File}
            className="cursor-pointer text-blue-600 hover:text-blue-800"
            onClick={() => analyzeAudio(audio.Id_File)}
          >
            {audio.file_key} - {new Date(audio.upload_date).toLocaleDateString()}
          </li>
        ))}
      </ul>
      {!audios.length && (
        <div className="text-center text-gray-400">No hay entradas aún. ¡Sube un audio para comenzar!</div>
      )}
      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="font-medium">Estado: {result.status}</p>
          <p className="text-gray-600">Recomendación: {result.recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default DiarySection;