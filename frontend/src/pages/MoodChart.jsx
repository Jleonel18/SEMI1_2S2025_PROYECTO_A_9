import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const MoodChart = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/get-history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          console.error('Error HTTP:', response.status);
          return;
        }
  
        const json = await response.json();
        setData(Array.isArray(json) ? json : []); // evita errores si la respuesta no es array
      } catch (err) {
        console.error('Error al cargar historial:', err);
      }
    };
  
    fetchHistory();
  }, []);
  

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No hay registros de humor aún.</p>;
  }

  const labels = data.map((d) => d.Fecha || d.fecha);
  const values = data.map((d) => d.Puntuacion || d.puntuacion);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Nivel de Humor',
        data: values,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Tu progreso de humor</h2>
      <div className="h-64">
        <Line data={chartData} options={{ scales: { y: { min: 0, max: 10 } } }} />
      </div>
    </div>
  );
};

export default MoodChart;
