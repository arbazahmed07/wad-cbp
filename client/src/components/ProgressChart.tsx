
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressEntry } from '@/types';
import { format } from 'date-fns';
import { useState } from 'react';

interface ProgressChartProps {
  entries: ProgressEntry[];
  metric: 'weight' | 'bodyFat';
  title: string;
  color?: string;
}

const ProgressChart = ({ entries, metric, title, color = '#3B82F6' }: ProgressChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Format data for chart
  const chartData = entries
    .filter(entry => entry[metric] !== undefined)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((entry, index) => ({
      date: format(entry.date, 'MMM dd'),
      fullDate: entry.date,
      value: entry[metric],
      index
    }));

  const handleMouseOver = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="progress-chart-wrapper">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                onMouseLeave={handleMouseLeave}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#E2E8F0' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#E2E8F0' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  width={30}
                />
                <Tooltip
                  formatter={(value) => [`${value} ${metric === 'weight' ? 'kg' : '%'}`, title]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  dot={(props) => {
                    const { cx, cy, index } = props;
                    const isActive = activeIndex === index;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isActive ? 5 : 4}
                        fill="white"
                        stroke={color}
                        strokeWidth={isActive ? 2 : 1}
                        onMouseOver={() => handleMouseOver(null, index)}
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
