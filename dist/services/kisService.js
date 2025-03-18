import axios from 'axios';
class KISService {
    constructor(config) {
        this.tokenInfo = null;
        this.lastTokenRequestTime = null;
        this.TOKEN_REQUEST_INTERVAL = 60 * 1000; // 1분
        this.TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5분
        this.config = config;
    }
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async waitForTokenRequestInterval() {
        if (!this.lastTokenRequestTime)
            return;
        const timeSinceLastRequest = Date.now() - this.lastTokenRequestTime;
        if (timeSinceLastRequest < this.TOKEN_REQUEST_INTERVAL) {
            const waitTime = this.TOKEN_REQUEST_INTERVAL - timeSinceLastRequest;
            console.log(`토큰 발급 제한으로 ${Math.ceil(waitTime / 1000)}초 대기`);
            await this.delay(waitTime);
        }
    }
    isTokenValid() {
        return !!(this.tokenInfo &&
            this.tokenInfo.token &&
            Date.now() < this.tokenInfo.expiresAt - this.TOKEN_REFRESH_THRESHOLD);
    }
    async refreshToken() {
        try {
            // 유효한 토큰이 있으면 재사용
            if (this.isTokenValid()) {
                return this.tokenInfo.token;
            }
            // 토큰 발급 간격 체크
            const now = Date.now();
            if (this.lastTokenRequestTime && now - this.lastTokenRequestTime < this.TOKEN_REQUEST_INTERVAL) {
                const waitTime = this.TOKEN_REQUEST_INTERVAL - (now - this.lastTokenRequestTime);
                console.log(`토큰 발급 제한으로 ${Math.ceil(waitTime / 1000)}초 대기`);
                await this.delay(waitTime);
                // 대기 후 다시 유효성 체크
                if (this.isTokenValid()) {
                    return this.tokenInfo.token;
                }
            }
            this.lastTokenRequestTime = Date.now();
            const response = await axios.post('https://openapi.koreainvestment.com:9443/oauth2/tokenP', {
                grant_type: 'client_credentials',
                appkey: this.config.appKey,
                appsecret: this.config.appSecret,
                custtype: 'P',
                seq_no: '0',
                mac_address: '00-00-00-00-00-00',
                phone_number: '00000000000',
                ip_addr: '127.0.0.1'
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            if (!response.data.access_token) {
                throw new Error('토큰 발급 응답에 access_token이 없습니다.');
            }
            this.tokenInfo = {
                token: response.data.access_token,
                type: response.data.token_type,
                expiresAt: Date.now() + (response.data.expires_in * 1000)
            };
            return this.tokenInfo.token;
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                const errorCode = error.response.data?.error_code;
                console.error('토큰 발급 중 오류 발생:', error.message);
                console.error('에러 응답:', error.response.data);
                if (errorCode === 'EGW00133') {
                    // 토큰 발급 제한 에러인 경우 재시도
                    console.log('토큰 발급 제한으로 1분 대기 후 재시도');
                    await this.delay(this.TOKEN_REQUEST_INTERVAL);
                    return this.refreshToken();
                }
            }
            throw error;
        }
    }
    async getAccessToken() {
        try {
            return await this.refreshToken();
        }
        catch (error) {
            console.error('토큰 발급 실패:', error);
            throw error;
        }
    }
    async retryWithToken(operation, maxRetries = 3) {
        let lastError = null;
        for (let i = 0; i < maxRetries; i++) {
            try {
                const token = await this.getAccessToken();
                if (!token) {
                    throw new Error('유효한 토큰을 얻을 수 없습니다.');
                }
                return await operation(token);
            }
            catch (error) {
                lastError = error;
                console.error(`작업 실패 (시도 ${i + 1}/${maxRetries}):`, error);
                if (axios.isAxiosError(error) &&
                    (error.response?.status === 401 || error.response?.status === 403)) {
                    // 토큰 관련 오류인 경우 토큰 갱신 후 재시도
                    this.tokenInfo = null;
                    if (i < maxRetries - 1) {
                        const waitTime = Math.min(this.TOKEN_REQUEST_INTERVAL, 1000 * Math.pow(2, i));
                        await this.delay(waitTime);
                        continue;
                    }
                }
                throw error;
            }
        }
        throw lastError || new Error('알 수 없는 오류가 발생했습니다.');
    }
    // ELW 종목 목록 조회
    async getELWList() {
        console.log('ELW 종목 목록 조회 중...');
        return this.retryWithToken(async (token) => {
            const response = await axios.get('https://openapi.koreainvestment.com:9443/uapi/domestic-elw/v1/quotations/elw-search', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                    appkey: this.config.appKey,
                    appsecret: this.config.appSecret,
                    tr_id: 'FHKEW15010000',
                    custtype: 'P'
                },
                params: {
                    FID_COND_MRKT_DIV_CODE: 'W',
                    FID_INPUT_ISCD: '',
                    FID_ELW_ULY_CMP_CD: '005930', // 삼성전자
                    FID_ELW_WRNT_TYPE_CODE: 'C', // 콜
                    FID_ELW_EXER_TYPE: '01' // 유럽형
                }
            });
            if (!response.data) {
                throw new Error('ELW 종목 목록 조회 응답이 비어있습니다.');
            }
            return response.data;
        });
    }
    // ELW 현재가 시세 조회
    async getELWData(symbol) {
        console.log(`ELW 현재가 조회 중... (${symbol})`);
        return this.retryWithToken(async (token) => {
            const response = await axios.get('https://openapi.koreainvestment.com:9443/uapi/domestic-elw/v1/quotations/inquire-price', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                    appkey: this.config.appKey,
                    appsecret: this.config.appSecret,
                    tr_id: 'FHKEW15020000',
                    custtype: 'P'
                },
                params: {
                    FID_COND_MRKT_DIV_CODE: 'W',
                    FID_INPUT_ISCD: symbol
                }
            });
            if (!response.data) {
                throw new Error(`ELW 현재가 조회 응답이 비어있습니다. (${symbol})`);
            }
            return response.data;
        });
    }
}
export default KISService;
