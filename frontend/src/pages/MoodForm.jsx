import React, { useState } from 'react';

const MoodForm = ({ userId, onSaved }) => {
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/save-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, puntuacion: score, nota: note }),
      });

      if (response.ok) {
        setNote('');
        onSaved();
      } else {
        alert('Error al guardar el humor.');
      }
    } catch (err) {
      console.error('Error en MoodForm:', err);
      alert('No se pudo guardar el humor.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Califica tu humor (1 = mal, 10 = excelente)
      </label>
      <select
        value={score}
        onChange={(e) => setScore(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
      >
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Escribe una nota sobre tu día..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 h-24 resize-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-2 rounded-lg hover:from-green-500 hover:to-green-600 transition duration-300 shadow-md font-medium"
      >
        {loading ? 'Guardando...' : 'Guardar Humor'}
      </button>
    </form>
  );
};

export default MoodForm;
