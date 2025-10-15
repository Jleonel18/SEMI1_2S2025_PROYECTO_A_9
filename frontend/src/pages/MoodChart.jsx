import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const MoodChart = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch(`http://localhost:4000/api/get-history/${userId}`);
      const json = await response.json();
      setData(json);
    };
    fetchHistory();
  }, [userId]);

  const chartData = {
    labels: data.map((d) => d.fecha),
    datasets: [
      {
        label: 'Nivel de Humor',
        data: data.map((d) => d.puntuacion),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={{ scales: { y: { min: 0, max: 10 } } }} />
    </div>
  );
};

export default MoodChart;
