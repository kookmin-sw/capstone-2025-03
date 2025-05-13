import { useCallback } from 'react';
import { UserModel } from '@/src/models/UserModel';
import { useUser } from '@/src/contexts/UserContext';

export function useUserInputHandlers() {
    const { setUser } = useUser();

    const handleBirthChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            let formattedValue = '';

            if (value.length <= 4) {
                formattedValue = value;
            } else if (value.length <= 6) {
                formattedValue = `${value.slice(0, 4)}-${value.slice(4, 6)}`;
            } else {
                formattedValue = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
            }

            setUser((prevUser) => new UserModel({ ...prevUser, birthDate: formattedValue }));
        },
        [setUser],
    );

    const handlePhoneNumberChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, onStepChange?: (step: number) => void) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, '');
            let formattedValue = '';

            if (rawValue.length < 4) {
                formattedValue = rawValue;
            } else if (rawValue.length < 8) {
                formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
            } else if (rawValue.length < 11) {
                formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7)}`;
            } else {
                formattedValue = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`;
            }

            setUser((prevUser) => new UserModel({ ...prevUser, phoneNumber: formattedValue }));

            if (formattedValue.length === 13 && onStepChange) {
                onStepChange(3); // 다음 단계로 넘기기
            }
        },
        [setUser],
    );

    const formatPhoneNumber = (value: string): string => {
        const raw = value.replace(/[^0-9]/g, '').slice(0, 11); // 최대 11자리 숫자만 허용
        let result = '';

        if (raw.length < 4) {
            result = raw;
        } else if (raw.length < 8) {
            result = `${raw.slice(0, 3)}-${raw.slice(3)}`;
        } else {
            result = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
        }

        return result;
    };

    return { handleBirthChange, handlePhoneNumberChange, formatPhoneNumber };
}
