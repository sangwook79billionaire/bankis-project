'use client'

import { ModuleCard } from "./ModuleCard"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const dummyData = [
  {
    name: "삼성전자 3월 75000콜",
    currentPrice: 1250,
    changeRate: 2.5,
    volume: 15000,
  },
  {
    name: "SK하이닉스 3월 150000콜",
    currentPrice: 850,
    changeRate: -1.2,
    volume: 12000,
  },
  {
    name: "NAVER 3월 250000콜",
    currentPrice: 450,
    changeRate: 0.8,
    volume: 8000,
  },
  {
    name: "카카오 3월 50000콜",
    currentPrice: 950,
    changeRate: 3.1,
    volume: 9500,
  },
  {
    name: "LG에너지솔루션 3월 400000콜",
    currentPrice: 1250,
    changeRate: -2.3,
    volume: 11000,
  },
]

export function ELWList() {
  return (
    <ModuleCard title="매매 가능한 ELW">
      <div className="h-[300px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>종목명</TableHead>
              <TableHead className="text-right">현재가</TableHead>
              <TableHead className="text-right">등락률</TableHead>
              <TableHead className="text-right">거래량</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyData.map((elw, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{elw.name}</TableCell>
                <TableCell className="text-right">{elw.currentPrice.toLocaleString()}원</TableCell>
                <TableCell className={`text-right ${elw.changeRate > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  {elw.changeRate > 0 ? '+' : ''}{elw.changeRate}%
                </TableCell>
                <TableCell className="text-right">{elw.volume.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ModuleCard>
  )
} 