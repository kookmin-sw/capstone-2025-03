import styles from './NameAndBirthDayInput.module.css';
import InputField from './components/InputField';
import LoadingSection from '@/src/components/layout/LoadingSection';
import RegisterCompleteSection from '../address-input/components/RegisterCompleteSection';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserModel } from '@/src/models/UserModel';
import { useUser } from '@/src/contexts/UserContext';
import { useKakaoLogin } from '@/src/hooks/useKakaoLogin';
import { useUserInputHandlers } from '@/src/hooks/useInputFormat';

export default function NameAndBirthDayInput() {
    const navigate = useNavigate();

    const { user, setUser } = useUser();
    const { isLoading, isComplete } = useKakaoLogin(() => navigate('/'));

    const { handleBirthChange, handlePhoneNumberChange } = useUserInputHandlers();

    const [step, setStep] = useState<number>(1); // 단계: ( 1: 이름 입력, 2: 번호 입력 )
    const [visibleHeight, setVisibleHeight] = useState<number>(window.innerHeight);

    // 버튼 비활성화 조건
    const whenNameisNull = !user?.name;

    // 단계별 텍스트
    const stepText = {
        1: '이름을 입력해주세요',
        2: '휴대폰 번호를 입력해주세요',
        3: '생년월일을 입력해주세요',
    }[step];

    // 액세스 토큰으로 사용자 정보 가져옴
    useEffect(() => {
        // 세션스토리지에 이름 저장
        if (user?.name) {
            sessionStorage.setItem('name', user.name);
        }

        const handleResize = () => {
            if (window.visualViewport) {
                setVisibleHeight(window.visualViewport.height);
            }
        };
        window.visualViewport?.addEventListener('resize', handleResize);
        return () => {
            window.visualViewport?.addEventListener('resize', handleResize);
        };
    }, [user?.name]);

    return isLoading ? (
        isComplete ? (
            <RegisterCompleteSection text={user?.name || 'unknown'} />
        ) : (
            <LoadingSection text="잠시만 기다려주세요" />
        )
    ) : (
        <div className={styles.page}>
            {/* 문구 */}
            <p className={styles.heading}>{stepText}</p>

            {/* 입력 필드 */}
            <div className={styles.inputWrapper}>
                {step === 3 && (
                    <InputField
                        label="생년월일"
                        placeholder="YYYY-MM-DD"
                        value={user?.birthDate || ''}
                        onChange={handleBirthChange}
                        maxLength={10}
                    />
                )}
                {(step === 2 || step === 3) && (
                    <InputField
                        label="휴대폰 번호"
                        placeholder="휴대폰 번호"
                        value={user?.phoneNumber || ''}
                        onChange={(e) => handlePhoneNumberChange(e, setStep)}
                        maxLength={13}
                    />
                )}
                <InputField
                    label="이름"
                    placeholder="이름"
                    value={user?.name || ''}
                    onChange={(e) =>
                        setUser((prevUser) => new UserModel({ ...prevUser, name: e.target.value }))
                    }
                />
            </div>

            <div className={styles.grow} />

            {step === 1 || (step !== 2 && user?.birthDate && user.birthDate.length >= 10) ? (
                <button
                    className={styles.button}
                    disabled={whenNameisNull}
                    style={{ top: `calc(${visibleHeight}px - 6rem - 2rem)` }}
                    onClick={() => {
                        if (step === 1) {
                            setStep(2);
                        } else if (step === 3) {
                            // handleRegister();
                            navigate('/address-input');
                        }
                    }}
                >
                    {step === 1 ? '다음' : '확인'}
                </button>
            ) : null}
        </div>
    );
}
