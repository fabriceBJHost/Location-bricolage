import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  
  import { Line } from 'react-chartjs-2';
  
  // Register the components you want to use
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  // Example chart data
  const data = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Sales',
        data: [150, 200, 170],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.4
      }
    ]
  };
  
  // Optional chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Monthly Sales'
      }
    }
  };
  
  const MyLineChart = () => {
    return <Line data={data} options={options} />;
  };
  
  export default MyLineChart;
  
  import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchNotifications = async () => {
  const response = await axios.get('/api/notifications');
  return response.data;
};

const Notifications = () => {
  const [showModal, setShowModal] = useState(false);
  const previousLength = useRef(0); // store previous count between renders

  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 5000,
    onSuccess: (newData) => {
      if (newData.length > previousLength.current) {
        // New notification detected
        setShowModal(true); // open modal
      }
      previousLength.current = newData.length; // update old length
    },
  });

  return (
    <div>
      <h2>Notifications</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading notifications</p>}
      <ul>
        {data?.map((n) => (
          <li key={n.id}>{n.description}</li>
        ))}
      </ul>

      {showModal && (
        <div className="modal">
          <p>You have new notifications!</p>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
};
