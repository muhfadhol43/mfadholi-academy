"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#5d5be8", "#34d399", "#f59e0b", "#f53569", "#94a3b8"];

interface LevelDistributionChartProps {
  data: { level: string; percent: number }[];
}

export function LevelDistributionChart({ data }: LevelDistributionChartProps) {
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} dataKey="percent" nameKey="level" innerRadius={50} outerRadius={75} paddingAngle={3}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name) => [`${value}%`, `Level ${name}`]} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-2 grid w-full grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={item.level} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-muted-foreground">
              Level {item.level} ({item.percent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
