export interface AppConfig {
    /** API 요청을 보낼 기본 URL */
    API_BASE_URL: string;
    /** 애플리케이션 환경 */
    environment: "development" | "production" | "test";
    /** 새로운 기능 활성화 여부 */
    enableFeatureX: boolean;
  }
  
  const config: AppConfig = {
    API_BASE_URL: "https://restart-s4b8.onrender.com",
    environment: "development",
    enableFeatureX: false,
  };
  
  export default config;  