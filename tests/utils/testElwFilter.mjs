import { filterELWs } from './elwFilter.js';

// 테스트 데이터
const testData = [
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
  },
  {
    symbol: '345678',
    name: 'KOSPI200 CALL 310',
    currentPrice: 150, // 200원 미만
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15일 후
    leverage: 2.8,
    type: 'CALL',
    strikePrice: 310,
    underlyingPrice: 320,
    volume: 500
  },
  {
    symbol: '901234',
    name: 'KOSPI200 PUT 290',
    currentPrice: 450, // 400원 초과
    expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25일 후
    leverage: 2.2,
    type: 'PUT',
    strikePrice: 290,
    underlyingPrice: 320,
    volume: 1200
  }
];

// 필터링 실행
const filteredELWs = filterELWs(testData);

// 결과 출력
console.log('Original Data:', testData);
console.log('\nFiltered ELWs:', filteredELWs); 