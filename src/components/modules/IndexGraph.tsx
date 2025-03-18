import { ModuleCard } from "./ModuleCard"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const dummyDailyData = [
  { date: "2024-03-10", open: 350.5, high: 352.3, low: 349.8, close: 351.2 },
  { date: "2024-03-11", open: 351.2, high: 353.1, low: 350.5, close: 352.8 },
  { date: "2024-03-12", open: 352.8, high: 354.2, low: 351.5, close: 353.5 },
  { date: "2024-03-13", open: 353.5, high: 355.0, low: 352.8, close: 354.2 },
  { date: "2024-03-14", open: 354.2, high: 355.5, low: 353.5, close: 354.8 },
  { date: "2024-03-15", open: 354.8, high: 356.0, low: 354.0, close: 355.5 },
]

const dummyMinuteData = [
  { time: "09:00", price: 354.8 },
  { time: "09:30", price: 355.2 },
  { time: "10:00", price: 355.5 },
  { time: "10:30", price: 355.8 },
  { time: "11:00", price: 355.3 },
  { time: "11:30", price: 355.6 },
  { time: "13:00", price: 355.9 },
  { time: "13:30", price: 356.0 },
  { time: "14:00", price: 355.7 },
  { time: "14:30", price: 355.5 },
]

type TimeFrame = "daily" | "minute"

export function IndexGraph() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("daily")

  const data = timeFrame === "daily" ? dummyDailyData : dummyMinuteData
  const xAxisKey = timeFrame === "daily" ? "date" : "time"

  return (
    <ModuleCard title="KOSPI200 선물">
      <div className="space-y-2">
        <div className="flex justify-end space-x-2">
          <Button
            variant={timeFrame === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFrame("daily")}
          >
            일봉
          </Button>
          <Button
            variant={timeFrame === "minute" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFrame("minute")}
          >
            분봉
          </Button>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ModuleCard>
  )
} 