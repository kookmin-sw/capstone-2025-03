import { useUser } from '@/src/contexts/UserContext';
import styles from './Profile.module.css';
import Footer from '@/src/components/layout/MenuFooter';
import Hello from '@/src/assets/images/profile/hello.png';
import Address from '@/src/assets/images/profile/address.png';
import House from '@/src/assets/images/profile/house.png';
import Phone from '@/src/assets/images/profile/phone.png';
import Setting from '@/src/assets/images/profile/gear.png';
import { useState, useEffect } from 'react';
import { useUserInputHandlers } from '@/src/hooks/useInputFormat';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserModel } from '@/src/models/UserModel';

export default function Profile() {
    const currentMenuIndex = 4;
    const { user, updateUser, setUser, isEditing, setIsEditing } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const [editedName, setEditedName] = useState<string>(user?.name ?? '');
    const [editedEmail, setEditedEmail] = useState<string>(user?.kakaoEmail ?? '');
    const [editedPhone, setEditedPhone] = useState<string>(user?.phoneNumber ?? '');
    const [editedAddress, setEditedAddress] = useState<string>(
        `${user?.fullAddress ?? ''} ${user?.addressDetail ?? ''}`,
    );

    const { formatPhoneNumber } = useUserInputHandlers();

    const handleToggleEdit = () => {
        setIsEditing((prev) => !prev);
    };

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setEditedPhone(formatted);
    };

    useEffect(() => {
        const returnedAddress = location.state?.address;
        if (returnedAddress) {
            setEditedAddress(returnedAddress);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state?.address]);

    const updateUserInfo = () => {
        if (!user) return;

        const updatedUser = new UserModel({
            ...user,
            name: editedName,
            phoneNumber: editedPhone.replace(/-/g, ''),
            kakaoEmail: editedEmail,
            fullAddress: editedAddress,
        });
        setUser(updatedUser);
        if (user?.userId !== null) {
            updateUser(user!.userId, updatedUser.toJsonWhenRequestPut());
        }
        setIsEditing((prev) => !prev);
    };

    // 주소 검색창 이동할 때 임시저장
    const saveUserInfo = (): UserModel => {
        return new UserModel({
            ...user,
            name: editedName,
            phoneNumber: editedPhone,
            kakaoEmail: editedEmail,
            fullAddress: editedAddress,
        });
    };

    // 온보딩 초기화
    const handleResetTooltips = () => {
        const keysToRemove = [
            'home_tooltip_shown',
            'landingpage_tooltip_shown',
            'packageDetail_addCategory_tooltip_shown',
            'packageDetail_addProduct_tooltip_shown',
            'packageDetail_tooltip_shown',
            'seller_page_add_product_tooltip_shown',
        ];

        keysToRemove.forEach((key) => {
            localStorage.removeItem(key);
        });

        alert("초기화 완료! 툴팁이 다시 보여요")
    };

    return (
        <div className={styles.page}>
            <div className={styles.section}>
                <div className={styles.profileContainer}>
                    <div className={styles.onBoardingReset}>
                        <button onClick={handleResetTooltips} className={styles.onBoardingButton}>
                            온보딩 다시보기
                        </button>
                    </div>
                    <img className={styles.profileImage} src={user?.profileImage ?? ''}></img>
                    <div className={styles.InfoAndSettingContainer}>
                        <p className={styles.title}>내 정보</p>
                        {!isEditing ? (
                            <img
                                src={Setting}
                                onClick={handleToggleEdit}
                                style={{ height: '3rem', marginTop: '3rem', cursor: 'pointer' }}
                            />
                        ) : (
                            <button onClick={updateUserInfo} className={styles.saveButton}>
                                저장
                            </button>
                        )}
                    </div>
                    <div className={styles.itemBox}>
                        <div className={styles.iconBox}>
                            <img className={styles.icon} src={Hello}></img>
                        </div>
                        {isEditing ? (
                            <input
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className={styles.editingStyle}
                            />
                        ) : (
                            <p className={styles.text}>{editedName}</p>
                        )}
                    </div>
                    <div className={styles.itemBox}>
                        <div className={styles.iconBox}>
                            <img className={styles.icon} src={Address}></img>
                        </div>
                        {isEditing ? (
                            <input
                                value={editedEmail}
                                onChange={(e) => setEditedEmail(e.target.value)}
                                className={styles.editingStyle}
                            />
                        ) : (
                            <p className={styles.text}>{user?.kakaoEmail}</p>
                        )}
                    </div>
                    <div className={styles.itemBox}>
                        <div className={styles.iconBox}>
                            <img className={styles.icon} src={Phone}></img>
                        </div>
                        {isEditing ? (
                            <input
                                value={formatPhoneNumber(editedPhone)}
                                onChange={handlePhoneInput}
                                className={styles.editingStyle}
                            />
                        ) : (
                            <p className={styles.text}>
                                {formatPhoneNumber(user?.phoneNumber ?? '')}
                            </p>
                        )}
                    </div>
                    <div className={styles.itemBox}>
                        <div className={styles.iconBox}>
                            <img className={styles.icon} src={House}></img>
                        </div>
                        {isEditing ? (
                            <input
                                value={editedAddress}
                                onClick={() => {
                                    setUser(saveUserInfo());
                                    navigate('/address-search', {
                                        state: { source: 'profile' },
                                    });
                                }}
                                className={styles.editingStyle}
                                readOnly
                            />
                        ) : (
                            <p className={styles.text}>
                                {user?.fullAddress} {user?.addressDetail}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <Footer currentMenuIndex={currentMenuIndex} />
        </div>
    );
}
