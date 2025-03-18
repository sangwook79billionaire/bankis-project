'use client'

import { ModuleCard } from "./ModuleCard"
import { Card, CardContent } from "@/components/ui/card"

const dummyStrategies = [
  {
    name: "삼성전자 콜옵션 전략",
    description: "RSI 30 이하 + 볼린저밴드 하단 접근 시 매수",
    status: "활성",
    performance: "+2.5%",
  },
  {
    name: "SK하이닉스 풋옵션 전략",
    description: "MACD 골든크로스 + 거래량 증가 시 매수",
    status: "대기",
    performance: "-1.2%",
  },
  {
    name: "NAVER 콜옵션 전략",
    description: "이동평균선 정배열 + 거래량 증가 시 매수",
    status: "활성",
    performance: "+0.8%",
  },
]

export function TradingStrategy() {
  return (
    <ModuleCard title="매매 전략 요약">
      <div className="h-[300px] overflow-auto space-y-2">
        {dummyStrategies.map((strategy, index) => (
          <Card key={index}>
            <CardContent className="p-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">{strategy.name}</div>
                  <div className="text-xs text-muted-foreground">{strategy.description}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs ${strategy.status === '활성' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {strategy.status}
                  </div>
                  <div className={`text-xs ${strategy.performance.startsWith('+') ? 'text-red-500' : 'text-blue-500'}`}>
                    {strategy.performance}
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