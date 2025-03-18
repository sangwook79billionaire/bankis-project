import axios from 'axios';

interface KISConfig {
  appKey: string;
  appSecret: string;
  accountNumber: string;
}

interface TokenInfo {
  token: string;
  type: string;
  expiresAt: number;
}

class KISService {
  private config: KISConfig;
  private static tokenInfo: TokenInfo | null = null;
  private static lastTokenRequestTime: number | null = null;
  private readonly TOKEN_REQUEST_INTERVAL = 180 * 1000; // 3분
  private readonly TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5분
  private readonly API_TIMEOUT = 60000; // 60초

  constructor(config: KISConfig) {
    this.config = config;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isTokenValid(): boolean {
    return !!(
      KISService.tokenInfo &&
      KISService.tokenInfo.token &&
      Date.now() < KISService.tokenInfo.expiresAt - this.TOKEN_REFRESH_THRESHOLD
    );
  }

  private async refreshToken(): Promise<string> {
    try {
      // 유효한 토큰이 있으면 재사용
      if (this.isTokenValid()) {
        return KISService.tokenInfo!.token;
      }

      // 토큰 발급 간격 체크
      const now = Date.now();
      if (KISService.lastTokenRequestTime && now - KISService.lastTokenRequestTime < this.TOKEN_REQUEST_INTERVAL) {
        const waitTime = this.TOKEN_REQUEST_INTERVAL - (now - KISService.lastTokenRequestTime);
        console.log(`토큰 발급 제한으로 ${Math.ceil(waitTime / 1000)}초 대기`);
        await this.delay(waitTime);
        
        // 대기 후 다시 유효성 체크
        if (this.isTokenValid()) {
          return KISService.tokenInfo!.token;
        }
      }

      KISService.lastTokenRequestTime = Date.now();
      
      const response = await axios.post(
        'https://openapi.koreainvestment.com:9443/oauth2/tokenP',
        {
          grant_type: 'client_credentials',
          appkey: this.config.appKey,
          appsecret: this.config.appSecret,
          custtype: 'P'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: this.API_TIMEOUT
        }
      );

      if (!response.data.access_token) {
        throw new Error('토큰 발급 응답에 access_token이 없습니다.');
      }

      KISService.tokenInfo = {
        token: response.data.access_token,
        type: response.data.token_type,
        expiresAt: Date.now() + (response.data.expires_in * 1000)
      };

      return KISService.tokenInfo.token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          console.error('토큰 발급 요청 시간 초과');
          throw new Error('토큰 발급 요청 시간 초과');
        }
        if (error.response?.status === 403) {
          console.error('토큰 발급 중 오류 발생:', error.message);
          console.error('에러 응답:', error.response.data);
          
          // 토큰 발급 제한 에러인 경우 재시도
          console.log('토큰 발급 제한으로 3분 대기 후 재시도');
          await this.delay(this.TOKEN_REQUEST_INTERVAL);
          return this.refreshToken();
        }
      }
      throw error;
    }
  }

  private async getAccessToken(): Promise<string> {
    try {
      return await this.refreshToken();
    } catch (error) {
      console.error('토큰 발급 실패:', error);
      throw error;
    }
  }

  private async retryWithToken<T>(
    operation: (token: string) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const token = await this.getAccessToken();
        return await operation(token);
      } catch (error) {
        lastError = error as Error;
        console.error(`작업 실패 (시도 ${i + 1}/${maxRetries}):`, error);
        
        if (axios.isAxiosError(error)) {
          if (error.code === 'ECONNABORTED') {
            console.error('API 요청 시간 초과');
            if (i < maxRetries - 1) {
              await this.delay(1000);
              continue;
            }
          }
          if (error.response?.status === 401) {
            // 토큰 만료된 경우에만 토큰 갱신
            KISService.tokenInfo = null;
            if (i < maxRetries - 1) {
              await this.delay(1000);
              continue;
            }
          }
        }
        throw error;
      }
    }
    
    throw lastError || new Error('알 수 없는 오류가 발생했습니다.');
  }

  // ELW 종목 목록 조회
  async getELWList(params: {
    FID_COND_MRKT_DIV_CODE: string;
    FID_INPUT_ISCD?: string;
    FID_ELW_ULY_CMP_CD?: string;
    FID_ELW_WRNT_TYPE_CODE?: string;
    FID_ELW_EXER_TYPE?: string;
  }): Promise<any> {
    const url = 'https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/elw-search';
    const tr_id = 'HHDFS76410000';
    console.log('ELW 종목 목록 조회 중...');
    return this.retryWithToken(async (token) => {
      const response = await axios.get(
        url,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${token}`,
            appkey: this.config.appKey,
            appsecret: this.config.appSecret,
            tr_id: tr_id,
            custtype: 'P'
          },
          params: params,
          timeout: this.API_TIMEOUT
        }
      );

      if (!response.data) {
        throw new Error('ELW 종목 목록 조회 응답이 비어있습니다.');
      }

      return response.data;
    });
  }

  // ELW 현재가 시세 조회
  async getELWData(params: {
    FID_INPUT_ISCD: string;
  }): Promise<any> {
    const url = 'https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price';
    const tr_id = 'HHDFS76200000';
    console.log(`ELW 현재가 조회 중... (${params.FID_INPUT_ISCD})`);
    return this.retryWithToken(async (token) => {
      const response = await axios.get(
        url,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${token}`,
            appkey: this.config.appKey,
            appsecret: this.config.appSecret,
            tr_id: tr_id,
            custtype: 'P'
          },
          params: params,
          timeout: this.API_TIMEOUT
        }
      );

      if (!response.data) {
        throw new Error(`ELW 현재가 조회 응답이 비어있습니다. (${params.FID_INPUT_ISCD})`);
      }

      return response.data;
    });
  }

  // 계좌 잔고 조회
  async getBalance(): Promise<any> {
    const url = 'https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/trading/inquire-balance';
    const tr_id = 'VTTC8434R'; // 실전 계좌
    console.log('계좌 잔고 조회 중...');
    
    return this.retryWithToken(async (token) => {
      const response = await axios.get(
        url,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${token}`,
            appkey: this.config.appKey,
            appsecret: this.config.appSecret,
            tr_id,
            custtype: 'P'
          },
          params: {
            CANO: this.config.accountNumber.substring(0, 8), // 계좌번호 앞 8자리
            ACNT_PRDT_CD: this.config.accountNumber.substring(8), // 계좌상품코드
            AFHR_FLPR_YN: 'N', // 시간외 단일가 여부
            OFL_YN: '', // 오프라인 여부
            INQR_DVSN: '01', // 조회구분
            UNPR_DVSN: '01', // 단가구분
            FUND_STTL_ICLD_YN: 'N', // 펀드결제분 포함여부
            FNCG_AMT_AUTO_RDPT_YN: 'N', // 융자금액자동상환여부
            PRCS_DVSN: '01', // 처리구분
            CTX_AREA_FK100: '', // 연속조회검색조건
            CTX_AREA_NK100: '' // 연속조회키
          },
          timeout: this.API_TIMEOUT
        }
      );

      if (!response.data) {
        throw new Error('계좌 잔고 조회 응답이 비어있습니다.');
      }

      return response.data;
    });
  }
}

export default KISService; 