import { useUser } from '@/src/contexts/UserContext';
import styles from './Profile.module.css';
import Footer from '@/src/components/layout/MenuFooter';
import Hello from '@/src/assets/images/profile/hello.png';
import Address from '@/src/assets/images/profile/address.png';
import House from '@/src/assets/images/profile/house.png';
import Phone from '@/src/assets/images/profile/phone.png';

export default function Profile() {
    const currentMenuIndex = 4;
    const { user } = useUser();

    return <div className={styles.page}>
        <div className={styles.section}>
            <div className={styles.profileContainer}>
                <img className={styles.profileImage} src={user?.profileImage ?? ''}></img>
                <p className={styles.title}>
                    내 정보
                </p>
                <div className={styles.itemBox}>
                    <div className={styles.iconBox}>
                        <img className={styles.icon} src={Hello}></img>
                    </div>
                    <p className={styles.text}>
                        {user?.name}
                    </p>
                </div>
                <div className={styles.itemBox}>
                    <div className={styles.iconBox}>
                        <img className={styles.icon} src={Address}></img>
                    </div>
                    <p className={styles.text}>
                        {user?.kakaoEmail}
                    </p>
                </div>
                <div className={styles.itemBox}>
                    <div className={styles.iconBox}>
                        <img className={styles.icon} src={Phone}></img>
                    </div>
                    <p className={styles.text}>
                        {user?.phoneNumber}
                    </p>
                </div>
                <div className={styles.itemBox}>
                    <div className={styles.iconBox}>
                        <img className={styles.icon} src={House}></img>
                    </div>
                    <p className={styles.text}>
                        {user?.fullAddress} {user?.addressDetail}
                    </p>
                </div>
            </div>
        </div>
        <Footer currentMenuIndex={currentMenuIndex} />
    </div>
}