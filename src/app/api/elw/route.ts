import { NextResponse } from 'next/server';
import KISService from '@/services/kisService';

export async function GET() {
  try {
    const config = {
      appKey: process.env.KIS_APP_KEY!,
      appSecret: process.env.KIS_APP_SECRET!,
      accountNumber: process.env.KIS_ACCOUNT_NUMBER!
    };

    const kisService = new KISService(config);
    
    // 테스트를 위한 간단한 응답
    return NextResponse.json({ 
      message: 'API 연결 테스트',
      config: {
        appKey: config.appKey?.substring(0, 5) + '...',
        appSecret: config.appSecret?.substring(0, 5) + '...',
        accountNumber: config.accountNumber?.substring(0, 5) + '...'
      }
    });

  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    return NextResponse.json(
      { error: 'API 호출 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 