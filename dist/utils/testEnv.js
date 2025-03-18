import dotenv from 'dotenv';
// .env.local 파일 로드
dotenv.config({ path: '.env.local' });
console.log('API Key:', process.env.KIS_APP_KEY);
console.log('API Secret:', process.env.KIS_APP_SECRET);
console.log('Account Number:', process.env.KIS_ACCOUNT_NUMBER);
console.log('Mock Mode:', process.env.KIS_MOCK);
