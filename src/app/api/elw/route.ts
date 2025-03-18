import { NextResponse } from 'next/server';
import KISService from '@/services/kisService';

export const maxDuration = 60; // 60초 타임아웃

export async function GET() {
  try {
    const config = {
      appKey: process.env.KIS_APP_KEY!,
      appSecret: process.env.KIS_APP_SECRET!,
      accountNumber: process.env.KIS_ACCOUNT_NUMBER!
    };

    // 환경 변수 확인
    if (!config.appKey || !config.appSecret || !config.accountNumber) {
      console.error('필수 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '필수 환경 변수가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const kisService = new KISService(config);
    
    try {
      // ELW 종목 목록 조회
      const elwList = await kisService.getELWList({
        FID_COND_MRKT_DIV_CODE: 'J', // 주식
        FID_ELW_WRNT_TYPE_CODE: '01' // 콜
      });

      // 응답 데이터 확인
      if (!elwList || typeof elwList !== 'object') {
        console.error('잘못된 응답 형식:', elwList);
        return NextResponse.json(
          { error: '잘못된 응답 형식입니다.' },
          { status: 500 }
        );
      }

      return NextResponse.json(elwList);
    } catch (apiError) {
      console.error('KIS API 호출 중 오류:', apiError);
      const errorMessage = apiError instanceof Error ? apiError.message : '알 수 없는 오류';
      const status = errorMessage.includes('시간 초과') ? 504 : 500;
      
      return NextResponse.json(
        { 
          error: 'KIS API 호출 중 오류가 발생했습니다.',
          details: errorMessage
        },
        { status }
      );
    }

  } catch (error) {
    console.error('서버 오류:', error);
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 