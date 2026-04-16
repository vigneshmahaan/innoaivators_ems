"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui";

type Point = { date: string; total_hours?: number; status?: string };

export function EmployeeCharts({ attendance, logs }: { attendance: Point[]; logs: Point[] }) {
  const attendanceRatio = [
    { name: "Present", value: attendance.filter((a) => !!a.total_hours).length },
    { name: "Missing", value: Math.max(attendance.length - attendance.filter((a) => !!a.total_hours).length, 0) },
  ];

  const tasksByDay = logs.reduce<Record<string, number>>((acc, row) => {
    if (row.status === "Completed") acc[row.date] = (acc[row.date] ?? 0) + 1;
    return acc;
  }, {});

  const taskPoints = Object.entries(tasksByDay).map(([date, count]) => ({ date, count }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h3 className="mb-3 text-sm font-semibold">Daily Working Hours</h3>
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total_hours" stroke="#1d4ed8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 text-sm font-semibold">Tasks Completed</h3>
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={taskPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="lg:col-span-2">
        <h3 className="mb-3 text-sm font-semibold">Attendance Ratio</h3>
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={attendanceRatio} dataKey="value" nameKey="name" outerRadius={90} label>
                <Cell fill="#1d4ed8" />
                <Cell fill="#94a3b8" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
