import React, { useState } from 'react';

const MoodForm = ({ onSaved }) => {
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Por favor inicia sesión primero.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/save-mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          puntuacion: Number(score),
          nota: note.trim(),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Humor guardado correctamente');

        // Mapea score a moodLevel
        let moodLevel = 'neutral';
        if (score <= 3) moodLevel = 'negative';
        else if (score >= 8) moodLevel = 'positive';

        // ACTUALIZA EL USUARIO EN localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          user.moodLevel = moodLevel;
          localStorage.setItem('user', JSON.stringify(user));
        }

        setNote('');
        setScore(5);
        if (onSaved) onSaved(); // refresca gráfico
      } else {
        alert('Error al guardar el humor: ' + (result.error || 'Desconocido'));
      }
    } catch (err) {
      console.error('Error en MoodForm:', err);
      alert('No se pudo guardar el humor.');
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg space-y-4 mt-6"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">
        Registra tu humor diario
      </h2>

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
        className={`w-full text-white py-2 rounded-lg transition duration-300 shadow-md font-medium ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600'
        }`}
      >
        {loading ? 'Guardando...' : 'Guardar Humor'}
      </button>
    </form>
  );
};

export default MoodForm;