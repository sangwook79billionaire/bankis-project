'use client';

import { useEffect, useState } from 'react';

interface BalanceData {
  dnca_tot_amt?: string; // 예수금총금액
  nxdy_excc_amt?: string; // 익일정산금액
  prvs_rcdl_excc_amt?: string; // 가수도정산금액
  cma_evlu_amt?: string; // CMA평가금액
  bfdy_buy_amt?: string; // 전일매수금액
  thdt_buy_amt?: string; // 금일매수금액
  nxdy_auto_rdpt_amt?: string; // 익일자동상환금액
  bfdy_sel_amt?: string; // 전일매도금액
  thdt_sel_amt?: string; // 금일매도금액
  d2_auto_rdpt_amt?: string; // D+2자동상환금액
  tot_evlu_amt?: string; // 총평가금액
}

export default function Balance() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/balance');
      if (!response.ok) {
        throw new Error('잔고 데이터를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setBalance(data.output[0]); // API 응답 구조에 따라 조정
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    // 10초마다 잔고 갱신
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">계좌 잔고 조회 중...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-600">{error}</h3>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">계좌 잔고 현황</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">예수금 총액</p>
          <p className="text-lg font-semibold text-gray-900">
            {Number(balance?.dnca_tot_amt || 0).toLocaleString()}원
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">총평가금액</p>
          <p className="text-lg font-semibold text-gray-900">
            {Number(balance?.tot_evlu_amt || 0).toLocaleString()}원
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">금일매수금액</p>
          <p className="text-lg font-semibold text-gray-900">
            {Number(balance?.thdt_buy_amt || 0).toLocaleString()}원
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">금일매도금액</p>
          <p className="text-lg font-semibold text-gray-900">
            {Number(balance?.thdt_sel_amt || 0).toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
} 