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
    const balance = await kisService.getBalance();

    return NextResponse.json(balance);
  } catch (error) {
    console.error('잔고 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '잔고 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 