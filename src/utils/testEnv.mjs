import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 로드
dotenv.config({ path: join(__dirname, '../../.env.local') });

console.log('API Key:', process.env.KIS_APP_KEY);
console.log('API Secret:', process.env.KIS_APP_SECRET);
console.log('Account Number:', process.env.KIS_ACCOUNT_NUMBER);
console.log('Mock Mode:', process.env.KIS_MOCK); 