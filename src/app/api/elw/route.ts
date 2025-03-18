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
    
    // ELW 종목 목록 조회
    const elwList = await kisService.getELWList({
      FID_COND_MRKT_DIV_CODE: 'J', // 주식
      FID_ELW_WRNT_TYPE_CODE: '01' // 콜
    });

    return NextResponse.json(elwList);

  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    return NextResponse.json(
      { error: 'API 호출 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 