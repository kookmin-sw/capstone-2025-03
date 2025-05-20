// 로그인 여부 체크

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useRequireLogin(redirectPath = '/main') {
    const navigate = useNavigate();
    const isLogin = localStorage.getItem('user');

    useEffect(() => {
        if (!isLogin) {
            navigate(redirectPath);
        }
    }, [isLogin, navigate, redirectPath]);
}
