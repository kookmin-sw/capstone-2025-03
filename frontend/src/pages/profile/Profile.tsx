import { useUser } from '@/src/contexts/UserContext';
import styles from './Profile.module.css';
import Footer from '@/src/components/layout/MenuFooter';
import Hello from '@/src/assets/images/profile/hello.png';
import Address from '@/src/assets/images/profile/address.png';
import House from '@/src/assets/images/profile/house.png';
import Phone from '@/src/assets/images/profile/phone.png';
import Setting from '@/src/assets/images/profile/gear.png';
import { useState } from 'react';

export default function Profile() {
    const currentMenuIndex = 4;
    const { user } = useUser();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedName, setEditedName] = useState<string>(user?.name ?? '');
    const [editedEmail, setEditedEmail] = useState<string>(user?.kakaoEmail ?? '');
    const [editedPhone, setEditedPhone] = useState<string>(user?.phoneNumber ?? '');
    const [editedAddress, setEditedAddress] = useState<string>(
        `${user?.fullAddress ?? ''} ${user?.addressDetail ?? ''}`,
    );

    const handleToggleEdit = () => {
        setIsEditing((prev) => !prev);
    };

    return (
        <div className={styles.page}>
            <div className={styles.section}>
                <div className={styles.profileContainer}>
                    <img className={styles.profileImage} src={user?.profileImage ?? ''}></img>
                    <div className={styles.InfoAndSettingContainer}>
                        <p className={styles.title}>내 정보</p>
                        <img
                            src={Setting}
                            onClick={handleToggleEdit}
                            style={{ height: '3rem', marginTop: '3rem', cursor: 'pointer' }}
                        />
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
                                value={editedPhone}
                                onChange={(e) => setEditedPhone(e.target.value)}
                                className={styles.editingStyle}
                            />
                        ) : (
                            <p className={styles.text}>{user?.phoneNumber}</p>
                        )}
                    </div>
                    <div className={styles.itemBox}>
                        <div className={styles.iconBox}>
                            <img className={styles.icon} src={House}></img>
                        </div>
                        {isEditing ? (
                            <input
                                value={editedAddress}
                                onChange={(e) => setEditedAddress(e.target.value)}
                                className={styles.editingStyle}
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
