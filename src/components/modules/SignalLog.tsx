import { ModuleCard } from "./ModuleCard"
import { Card, CardContent } from "@/components/ui/card"

const dummySignals = [
  {
    time: "14:30:15",
    symbol: "삼성전자 3월 75000콜",
    type: "매수",
    reason: "RSI 28.5 (과매도)",
    price: 1250,
  },
  {
    time: "14:25:30",
    symbol: "SK하이닉스 3월 150000콜",
    type: "매도",
    reason: "MACD 데드크로스",
    price: 850,
  },
  {
    time: "14:20:45",
    symbol: "NAVER 3월 250000콜",
    type: "매수",
    reason: "볼린저밴드 하단 접근",
    price: 450,
  },
  {
    time: "14:15:20",
    symbol: "카카오 3월 50000콜",
    type: "매수",
    reason: "거래량 급증",
    price: 950,
  },
]

export function SignalLog() {
  return (
    <ModuleCard title="매수/매도 신호 로그">
      <div className="h-[300px] overflow-auto space-y-2">
        {dummySignals.map((signal, index) => (
          <Card key={index}>
            <CardContent className="p-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">{signal.symbol}</div>
                  <div className="text-xs text-muted-foreground">{signal.reason}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${signal.type === '매수' ? 'text-red-500' : 'text-blue-500'}`}>
                    {signal.type} 신호
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {signal.time} / {signal.price.toLocaleString()}원
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ModuleCard>
  )
} 