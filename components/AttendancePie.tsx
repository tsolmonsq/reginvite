import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';
  
  const COLORS = ['#4CAF50', '#E0E0E0']; // Ирсэн - ногоон, Ирээгүй - саарал
  
  export const AttendancePie = ({ total, checkedIn }: { total: number; checkedIn: number }) => {
    const data = [
      { name: 'Ирсэн', value: checkedIn },
      { name: 'Ирээгүй', value: total - checkedIn },
    ];
  
    return (
      <div className="w-full mt-8">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Ирцийн тойм</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              dataKey="value"
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };
  