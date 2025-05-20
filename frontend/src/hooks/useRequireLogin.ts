// 로그인 여부 체크

import { useNavigate } from 'react-router-dom';

export function useRequireLogin(redirectPath = '/main') {
    const navigate = useNavigate();

    const checkLoginAndRun = (callback?: () => void) => {
        const isLogin = localStorage.getItem('user');
        if (!isLogin) {
            window.alert("로그인이 필요한 기능입니다")
            navigate(redirectPath);
            return;
        }

        if (callback) {
            callback();
        }
    };

    return checkLoginAndRun;
}