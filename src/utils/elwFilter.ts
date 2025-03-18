interface ELWData {
  symbol: string;
  name: string;
  currentPrice: number;
  remainingDays: number;
  leverage: number;
  type: 'CALL' | 'PUT';
  strikePrice: number;
  underlyingPrice: number;
  volume: number;
}

interface FilteredELW {
  symbol: string;
  name: string;
  currentPrice: number;
  remainingDays: number;
  leverage: number;
  type: 'CALL' | 'PUT';
  strikePrice: number;
  underlyingPrice: number;
  volume: number;
  delta: number;
  theta: number;
}

export function filterELWs(data: any[]): FilteredELW[] {
  const today = new Date();
  
  return data
    .map(item => {
      // 만기일 계산
      const expiryDate = new Date(item.expiryDate);
      const remainingDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // 현재가가 200-400원 사이이고, 만기일이 30일 이하인 ELW만 필터링
      if (item.currentPrice >= 200 && item.currentPrice <= 400 && remainingDays <= 30) {
        // 델타와 세타 계산 (간단한 근사값)
        const delta = calculateDelta(item);
        const theta = calculateTheta(item, remainingDays);
        
        return {
          symbol: item.symbol,
          name: item.name,
          currentPrice: item.currentPrice,
          remainingDays,
          leverage: item.leverage,
          type: item.type,
          strikePrice: item.strikePrice,
          underlyingPrice: item.underlyingPrice,
          volume: item.volume,
          delta,
          theta
        };
      }
      return null;
    })
    .filter((item): item is FilteredELW => item !== null)
    .sort((a, b) => {
      // 거래량 기준으로 정렬
      return b.volume - a.volume;
    });
}

function calculateDelta(item: any): number {
  // 간단한 델타 계산 (실제로는 Black-Scholes 모델 사용 필요)
  const moneyness = (item.underlyingPrice - item.strikePrice) / item.strikePrice;
  if (item.type === 'CALL') {
    return Math.max(0, Math.min(1, 0.5 + moneyness));
  } else {
    return Math.min(0, Math.max(-1, -0.5 + moneyness));
  }
}

function calculateTheta(item: any, remainingDays: number): number {
  // 간단한 세타 계산 (실제로는 Black-Scholes 모델 사용 필요)
  const timeValue = item.currentPrice - Math.max(0, item.underlyingPrice - item.strikePrice);
  return -timeValue / remainingDays;
}

// 테스트 함수
export function testELWFilter() {
  const sampleData = [
    {
      symbol: '123456',
      name: 'KOSPI200 CALL 300',
      currentPrice: 250,
      expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20일 후
      leverage: 2.5,
      type: 'CALL',
      strikePrice: 300,
      underlyingPrice: 320,
      volume: 1000
    },
    {
      symbol: '789012',
      name: 'KOSPI200 PUT 300',
      currentPrice: 350,
      expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35일 후
      leverage: 2.0,
      type: 'PUT',
      strikePrice: 300,
      underlyingPrice: 320,
      volume: 800
    }
  ];

  const filtered = filterELWs(sampleData);
  console.log('Filtered ELWs:', filtered);
} 