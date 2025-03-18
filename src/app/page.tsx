'use client';

import { useState, useEffect } from 'react';
import Balance from '@/components/Balance';

interface ELW {
  symbol: string;
  name: string;
  currentPrice: number;
  volume: number;
  type: string;
  strikePrice: number;
  expiryDate: string;
}

export default function Home() {
  const [elws, setElws] = useState<ELW[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchELWs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/elw');
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // 현재는 빈 배열로 설정 (추후 실제 데이터로 교체)
        setElws([]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchELWs();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">ELW 거래 시스템</h1>
        
        {/* 잔고 정보 */}
        <div className="mb-8">
          <Balance />
        </div>

        {/* ELW 목록 */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">ELW 종목 목록</h2>
            <p className="mt-1 text-sm text-gray-500">실시간 ELW 거래 정보</p>
          </div>

          {loading ? (
            <div className="p-4 text-center">
              <p>데이터를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">
              <p>{error}</p>
            </div>
          ) : elws.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>표시할 ELW 데이터가 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">종목코드</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">종목명</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">현재가</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">거래량</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">권리유형</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">행사가</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">만기일</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {elws.map((elw) => (
                    <tr key={elw.symbol}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{elw.symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{elw.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{elw.currentPrice.toLocaleString()}원</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{elw.volume.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{elw.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{elw.strikePrice.toLocaleString()}원</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{elw.expiryDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 