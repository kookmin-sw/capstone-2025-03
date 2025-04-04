import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { UserModel } from '../models/UserModel';
import { getKakaoAccessToken, getKakaoUserInfo } from '../services/userService';

interface useKakaoLoginResult {
    isLoading: boolean;
    isComplete: boolean;
    code: string | null;
}

/**
 * @param onComplete 로그인 완료 후 실행할 콜백
 * @returns 로딩 여부, code 값
 */

export function useKakaoLogin(onComplete: () => void): useKakaoLoginResult {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    const { setUser, loginUser } = useUser();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isComplete, setIsComplete] = useState<boolean>(false);

    useEffect(() => {
        if (!code) return;

        let isMounted = true;

        const tryLogin = async (kakaoId: number) => {
            try {
                const responseData = await loginUser(kakaoId);
                if (responseData) {
                    setIsComplete(true);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.log('회원가입 안 되어 있음', error);
                setIsLoading(false);
            }
        };

        const runLoginFlow = async () => {
            try {
                const accessToken = await getKakaoAccessToken(code);
                const response = await getKakaoUserInfo(accessToken);

                await tryLogin(response.kakaoId);

                if (isMounted) {
                    setUser(
                        new UserModel({
                            name: response.nickname,
                            kakaoId: response.kakaoId,
                            profileImage: response.profileImage,
                            kakaoEmail: response.email,
                            createDate: new Date().toISOString(),
                        }),
                    );
                }
            } catch (error) {
                console.log('카카오 로그인 오류', error);
                setIsLoading(false);
            }
        };

        runLoginFlow();

        return () => {
            isMounted = false;
        };
    }, [code]);

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(() => {
                onComplete();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isComplete]);

    return { isLoading, isComplete, code };
}
