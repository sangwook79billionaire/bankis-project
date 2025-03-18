import { ModuleCard } from "./ModuleCard"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const dummyData = [
  { time: "09:00", netBuying: 150 },
  { time: "09:30", netBuying: -80 },
  { time: "10:00", netBuying: 200 },
  { time: "10:30", netBuying: -120 },
  { time: "11:00", netBuying: 180 },
  { time: "11:30", netBuying: -90 },
  { time: "13:00", netBuying: 250 },
  { time: "13:30", netBuying: -150 },
  { time: "14:00", netBuying: 300 },
  { time: "14:30", netBuying: -200 },
]

export function FuturesNetBuying() {
  return (
    <ModuleCard title="외국인 선물 순매수">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dummyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="netBuying"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ModuleCard>
  )
} 