import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 로드
dotenv.config({ path: join(__dirname, '../../.env.local') });

// API 설정
const APP_KEY = process.env.KIS_APP_KEY;
const APP_SECRET = process.env.KIS_APP_SECRET;
const ACCOUNT_NUMBER = process.env.KIS_ACCOUNT_NUMBER;

// API 호스트
const HOST = 'https://openapi.koreainvestment.com:9443';

// 인증 토큰 생성
function generateToken() {
  const timestamp = new Date().getTime().toString();
  const nonce = CryptoJS.lib.WordArray.random(16).toString();
  
  const message = timestamp + nonce + APP_KEY;
  const signature = CryptoJS.HmacSHA256(message, APP_SECRET).toString();
  
  return {
    'appkey': APP_KEY,
    'appsecret': APP_SECRET,
    'custtype': 'P',
    'seq': '0',
    'mac_address': '00:00:00:00:00:00',
    'phone_number': '00000000000',
    'ip_addr': '127.0.0.1',
    'hashkey': signature,
    'gt_uid': `GT${timestamp}${nonce}`
  };
}

// 토큰 발급
async function getAccessToken() {
  try {
    const response = await axios.post(`${HOST}/oauth2/tokenP`, {
      'grant_type': 'client_credentials',
      'appkey': APP_KEY,
      'appsecret': APP_SECRET
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Token Generation Error:', error.message);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    throw error;
  }
}

// ELW 데이터 조회
async function getELWData(accessToken) {
  try {
    const response = await axios.get(`${HOST}/uapi/domestic-stock/v1/quotations/inquire-elw-price`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${accessToken}`,
        'appkey': APP_KEY,
        'appsecret': APP_SECRET,
        'tr_id': 'FHKST01010400'
      },
      params: {
        'FID_COND_MRKT_DIV_CODE': 'W',  // ELW
        'FID_COND_SCR_DIV_CODE': '20171',  // KOSPI200
        'FID_INPUT_ISCD': '0000',  // 전체
        'FID_DIV_CLS_CODE': '',
        'FID_BLNG_CLS_CODE': '',
        'FID_TRGT_CLS_CODE': '',
        'FID_TRGT_EXLS_CLS_CODE': '',
        'FID_INPUT_PRICE': '',
        'FID_VOL_CNT': '',
        'FID_INPUT_DATE_1': '20240103'
      }
    });

    return response.data;
  } catch (error) {
    console.error('ELW Data Error:', error.message);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    throw error;
  }
}

// API 호출 테스트
async function testAPI() {
  try {
    // 1. 인증 토큰 생성
    const token = generateToken();
    console.log('Generated Token:', token);

    // 2. 액세스 토큰 발급
    const accessToken = await getAccessToken();
    console.log('Access Token:', accessToken);

    // 3. ELW 데이터 조회
    const elwData = await getELWData(accessToken);
    console.log('ELW Data:', elwData);

  } catch (error) {
    console.error('API Test Error:', error.message);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
  }
}

// 테스트 실행
testAPI(); 