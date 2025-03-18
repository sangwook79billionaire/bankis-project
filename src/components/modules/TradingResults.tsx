import { ModuleCard } from "./ModuleCard"
import { Card, CardContent } from "@/components/ui/card"

const dummyAccountInfo = {
  totalBalance: 50000000,
  availableBalance: 45000000,
  totalProfit: 2500000,
  profitRate: 5.2,
}

const dummyTradingResults = [
  {
    date: "2024-03-15",
    symbol: "삼성전자 3월 75000콜",
    type: "매수",
    price: 1200,
    quantity: 10,
    profit: 500000,
  },
  {
    date: "2024-03-14",
    symbol: "SK하이닉스 3월 150000콜",
    type: "매도",
    price: 850,
    quantity: 5,
    profit: -100000,
  },
  {
    date: "2024-03-13",
    symbol: "NAVER 3월 250000콜",
    type: "매수",
    price: 420,
    quantity: 20,
    profit: 600000,
  },
]

export function TradingResults() {
  return (
    <ModuleCard title="매매 결과 및 잔고">
      <div className="h-[300px] overflow-auto space-y-2">
        <Card>
          <CardContent className="p-2">
            <div className="space-y-1">
              <div className="flex justify-between">
                <div className="text-sm font-medium">총 잔고</div>
                <div className="text-sm">{dummyAccountInfo.totalBalance.toLocaleString()}원</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm font-medium">사용 가능</div>
                <div className="text-sm">{dummyAccountInfo.availableBalance.toLocaleString()}원</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm font-medium">총 수익</div>
                <div className={`text-sm ${dummyAccountInfo.totalProfit >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  {dummyAccountInfo.totalProfit.toLocaleString()}원 ({dummyAccountInfo.profitRate}%)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-1">
          {dummyTradingResults.map((result, index) => (
            <Card key={index}>
              <CardContent className="p-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">{result.symbol}</div>
                    <div className="text-xs text-muted-foreground">{result.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${result.type === '매수' ? 'text-red-500' : 'text-blue-500'}`}>
                      {result.type} {result.quantity}주
                    </div>
                    <div className={`text-xs ${result.profit >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                      {result.profit.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ModuleCard>
  )
} 