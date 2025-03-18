import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { IndexGraph } from "@/components/modules/IndexGraph"
import { FuturesNetBuying } from "@/components/modules/FuturesNetBuying"
import { ELWList } from "@/components/modules/ELWList"
import { TradingStrategy } from "@/components/modules/TradingStrategy"
import { SignalLog } from "@/components/modules/SignalLog"
import { TradingResults } from "@/components/modules/TradingResults"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <IndexGraph />
      <FuturesNetBuying />
      <ELWList />
      <TradingStrategy />
      <SignalLog />
      <TradingResults />
    </DashboardLayout>
  )
} 