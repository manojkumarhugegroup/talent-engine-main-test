import React from 'react';
import {
  FunnelChart,
  Funnel,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

interface Stage {
  name: string;
  value: number;
  color: string;
}

const stages: Stage[] = [
  { name: 'Received', value: 9, color: '#1F3B96' },
  { name: 'Shortlisted', value: 4, color: '#009B52' },
  { name: 'Interview Scheduled', value: 3, color: '#4C7AED' },
  { name: 'Selected Candidate', value: 2, color: '#EF6C1D' },
  { name: 'Work Order', value: 1, color: '#DD5B58' },
  { name: 'Onboarded', value: 1, color: '#009B52' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    payload: Stage;
    value: number;
  }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, color } = payload[0].payload;

    return (
      <div
        className="rounded-md p-2 shadow-md"
        style={{
          backgroundColor: color,
          border: `2px solid ${color}`,
        }}
      >
        <p className="text-sm font-semibold text-white">
          {name}: {value}
        </p>
      </div>
    );
  }
  return null;
};

const RecruitmentFunnel = () => {
  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      <div className="col-span-2 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip content={<CustomTooltip />} />
            <Funnel data={stages} dataKey="value" isAnimationActive>
              {stages.map((s) => (
                <Cell
                  key={s.name}
                  fill={s.color}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-1 flex items-center h-75">
        <ul className="flex flex-col gap-4">
          {stages.map((s) => (
            <li key={s.name} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-block h-3.5 w-3.5 rounded-[4px]"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-md text-gray-900">
                {s.name}: {s.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecruitmentFunnel;
