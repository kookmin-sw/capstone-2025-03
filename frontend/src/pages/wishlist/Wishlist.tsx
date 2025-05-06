import styles from './Wishlist.module.css';
import Footer from '../../components/layout/MenuFooter';
import ArrowFront from '../../assets/images/page/wishlist/arrow_front.png';
import FavoriteFill from '../../assets/images/page/wishlist/favorite_fill.png';
import { useCustomPackagesByUser, useCreatePackage, useDeletePackage } from '@/src/hooks/useCustomPackage';
import { useUser } from '@/src/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import PackageModel from '@/src/models/PackageModel';
import { useEffect } from 'react';

export default function Wishlist() {
    // hook
    const navigate = useNavigate();
    const { user } = useUser();
    const { data: customPackages = [], isLoading, isError } = useCustomPackagesByUser(user?.userId!);
    const { mutate: createPackage } = useCreatePackage();
    const { mutate: deletePackage } = useDeletePackage();

    // Variable
    const currentMenuIndex = 2;
    const userId = user?.userId;

    // useEffect
    useEffect(() => {
        console.log(userId);
        console.log(customPackages);
    }, [customPackages]);

    // Function
    const handleCreatePackage = () => {
        if (!userId) return;
        const newPackage = new PackageModel({
            user: userId,
        })
        createPackage(newPackage);

        // navigate
        navigate('/package-detail', { state: { pkg: newPackage } })
    };
    const handleDeletePackage = (id: number) => {
        if (!userId) return;
        deletePackage({ id: id, user: userId });
    }



    return (
        <div className={styles.page}>
            <div className={styles.section}>
                <h1 className={styles.title}>찜 목록</h1>
                <p className={styles.description}>나에게 맞는 패키지를 만들어보세요</p>

                <button className={styles.createPackageBtn} onClick={handleCreatePackage}>
                    <p className={styles.btnText}>새로운 패키지 만들기</p>
                    <div style={{ flexGrow: 1 }}></div>
                    <img src={ArrowFront} alt="패키지 생성 아이콘" className={styles.btnIcon} />
                </button>
                <div className={styles.wishlistGridView}>
                    {isLoading ? (
                        <p className={styles.infoText}>불러오는 중...</p>
                    ) : isError ? (
                        <p className={styles.infoText}>에러가 발생했습니다</p>
                    ) : customPackages.length === 0 ? (
                        <p className={styles.infoText}>찜한 패키지가 없습니다.</p>
                    ) :
                        customPackages.map((customPackage) => (
                            <div key={customPackage.id} className={styles.card}>
                                <div className={styles.content} style={{ backgroundImage: `url(${customPackage.thumbnail})` }}>
                                    <button className={styles.likeButton} onClick={() => handleDeletePackage(customPackage.id!)}>
                                        <img src={FavoriteFill} alt="좋아요 아이콘" />
                                    </button>
                                </div>
                                <p className={styles.cardTitle}>{customPackage.name}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
            <Footer currentMenuIndex={currentMenuIndex} />
        </div>
    );
}