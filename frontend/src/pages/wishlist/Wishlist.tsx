import styles from './Wishlist.module.css';
import Footer from '../../components/layout/MenuFooter';
import ArrowFront from '../../assets/images/page/wishlist/arrow_front.png';
import FavoriteFill from '../../assets/images/page/wishlist/favorite_fill.png';
import FavoriteNotFill from '../../assets/images/page/wishlist/favorite_not_fill.png';
import { usePackagesByUser } from '@/src/hooks/usePackageByUser';
import { useUser } from '@/src/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
    const navigate = useNavigate();
    const currentMenuIndex = 2;
    const { user } = useUser();
    const userId = user?.userId;

    const { data: customPackages = [], isLoading, isError } = usePackagesByUser(userId || undefined);

    const handleCreatePackage = () => {
    };

    const handleDeletePackage = (packageId: number) => {
        console.log('패키지 제거');
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

                {isLoading ? (
                    <p>불러오는 중...</p>
                ) : isError ? (
                    <p>에러가 발생했습니다</p>
                ) : customPackages.length === 0 ? (
                    <p>찜한 패키지가 없습니다.</p>
                ) : (
                    <div className={styles.wishlistGridView}>
                        {customPackages.map((customPackage) => (
                            <div key={customPackage.id} className={styles.card}>
                                <div className={styles.content} style={{ backgroundImage: `url(${customPackage.thumbnail})` }}>
                                    <button className={styles.likeButton} onClick={() => handleDeletePackage(customPackage.id!)}>
                                        <img src={FavoriteFill} alt="좋아요 아이콘"/>
                                    </button>
                                </div>
                                <p className={styles.cardTitle}>{customPackage.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer currentMenuIndex={currentMenuIndex} />
        </div>
    );
}