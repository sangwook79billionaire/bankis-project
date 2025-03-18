import KISService from '../services/kisService.js';
import { filterELWs } from './elwFilter.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env.local 파일에서 환경 변수 로드
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testKISELW() {
  // 환경 변수 확인
  if (!process.env.KIS_APP_KEY || !process.env.KIS_APP_SECRET || !process.env.KIS_ACCOUNT_NUMBER) {
    throw new Error('필수 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
  }

  const config = {
    appKey: process.env.KIS_APP_KEY,
    appSecret: process.env.KIS_APP_SECRET,
    accountNumber: process.env.KIS_ACCOUNT_NUMBER
  };

  console.log('Config loaded:', {
    appKey: config.appKey.substring(0, 5) + '...',
    appSecret: config.appSecret.substring(0, 5) + '...',
    accountNumber: config.accountNumber
  });

  try {
    const kisService = new KISService(config);
    
    // ELW 종목 목록 조회
    console.log('ELW 종목 목록 조회 중...');
    const elwList = await kisService.getELWList();
    
    if (elwList.output && elwList.output.length > 0) {
      console.log('첫 번째 ELW 종목 정보:');
      console.log(JSON.stringify(elwList.output[0], null, 2));
      
      // 첫 번째 종목의 현재가 조회
      const firstELWCode = elwList.output[0].FID_INPUT_ISCD;
      console.log(`\nELW 현재가 조회 중... (종목코드: ${firstELWCode})`);
      const elwData = await kisService.getELWData(firstELWCode);
      console.log('ELW 시세 데이터:', elwData);
    } else {
      console.log('ELW 종목 목록이 비어있습니다.');
    }

  } catch (error) {
    console.error('테스트 실행 중 오류 발생:', error);
  }
}

// 테스트 실행
testKISELW(); 