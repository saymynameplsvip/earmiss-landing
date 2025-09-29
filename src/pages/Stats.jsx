import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Header from "../components/Header";

const userData = [
  { date: "Пн", value: 120 },
  { date: "Вт", value: 200 },
  { date: "Ср", value: 180 },
  { date: "Чт", value: 250 },
  { date: "Пт", value: 300 },
  { date: "Сб", value: 280 },
  { date: "Вс", value: 350 },
];

const notesData = [
  { date: "Пн", value: 40 },
  { date: "Вт", value: 55 },
  { date: "Ср", value: 50 },
  { date: "Чт", value: 70 },
  { date: "Пт", value: 90 },
  { date: "Сб", value: 85 },
  { date: "Вс", value: 100 },
];

const viewsData = [
  { date: "Пн", value: 500 },
  { date: "Вт", value: 650 },
  { date: "Ср", value: 700 },
  { date: "Чт", value: 900 },
  { date: "Пт", value: 1200 },
  { date: "Сб", value: 1100 },
  { date: "Вс", value: 1500 },
];

function StatCard({ title, value, today, color, data }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-gray-500 mb-4">{today}</div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function StatsPage() {
  return (
    <div className="bg-[#FFF8E7]">
      <Header />
      <div className="max-w-6xl mx-auto px-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
        <StatCard title="Пользователи" value="3,542" today="+120 сегодня" color="#2563eb" data={userData} />
        <StatCard title="Конспекты" value="1,230" today="+35 сегодня" color="#16a34a" data={notesData} />
        <StatCard title="Просмотры" value="1,500" today="за сегодня" color="#f59e0b" data={viewsData} />
      </div>
    </div>
  );
}
