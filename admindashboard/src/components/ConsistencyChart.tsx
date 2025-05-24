import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DailyPostCount, User } from '../types/listing';
import { format, parseISO, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ConsistencyChartProps {
  data: DailyPostCount[];
  users: User[];
  shopName: string;
  onUserSelect?: (userId: string) => void;
}

const ConsistencyChart: React.FC<ConsistencyChartProps> = ({ data, users, shopName, onUserSelect }) => {
  // Get last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'yyyy-MM-dd');
  });

  // Format date for display
  const formatDateLabel = (dateStr: string) => {
    return format(parseISO(dateStr), 'dd MMM');
  };
  
  // Process data for chart
  const chartData = {
    labels: last7Days.map(formatDateLabel),
    datasets: users.map((user, index) => {
      // Generate a deterministic color based on index
      const hue = (index * 137) % 360;
      const color = `hsl(${hue}, 70%, 60%)`;
      
      return {
        label: user.name,
        data: last7Days.map(day => {
          const dayData = data.find(d => d.date === day && d.userId === user.id);
          return dayData ? dayData.count : 0;
        }),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      };
    }),
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Listing Consistency by User',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value} listing${value !== 1 ? 's' : ''}`;
          },
        },
      },
    },
    onClick: (_: any, elements: any[]) => {
      if (elements.length > 0 && onUserSelect) {
        const datasetIndex = elements[0].datasetIndex;
        const userId = users[datasetIndex].id;
        onUserSelect(userId);
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  // Calculate averages and changes
  const getTotalPosts = () => {
    return data.reduce((sum, item) => sum + item.count, 0);
  };

  const getAveragePerDay = () => {
    return Math.round((getTotalPosts() / 7) * 10) / 10;
  };

  const getCurrentWeekTotal = () => {
    return data.reduce((sum, item) => sum + item.count, 0);
  };

  const getPreviousWeekChange = () => {
    // For demo purposes, generate a random percent change
    const change = Math.round((Math.random() * 40) - 20);
    return change;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Consistency Overview ({shopName})</h2>
        <div className="flex gap-4 text-sm">
          <div className="px-3 py-1.5 bg-blue-50 rounded-md">
            <span className="block text-blue-700 font-semibold">{getAveragePerDay()}</span>
            <span className="text-gray-600">Avg/day</span>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 rounded-md">
            <span className={`block font-semibold ${getPreviousWeekChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {getPreviousWeekChange() >= 0 ? '+' : ''}{getPreviousWeekChange()}%
            </span>
            <span className="text-gray-600">vs last week</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">Click on a user's bar to filter the listing table below</p>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ConsistencyChart;