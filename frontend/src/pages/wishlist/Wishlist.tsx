import styles from './Wishlist.module.css';
import Footer from '../../components/layout/MenuFooter';
import ArrowFront from '../../assets/images/page/wishlist/arrow_front.png';
import FavoriteFill from '../../assets/images/page/wishlist/favorite_fill.png';
import {
    useCustomPackagesByUser,
    useCreatePackage,
    useDeletePackage,
} from '@/src/hooks/useCustomPackage';
import { useUser } from '@/src/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import PackageModel from '@/src/models/PackageModel';
import PackageThumbnail from '@/src/components/ui/PackageThumbnail';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { editingPackageState } from '@/src/recoil/packageState';
import { useRequireLogin } from '@/src/hooks/useRequireLogin';

export default function Wishlist() {
    // recoil
    const [, setEditingPackage] = useRecoilState(editingPackageState);
    // usestate
    const [isCreating, setIsCreating] = useState<boolean>(false);
    // hook
    const navigate = useNavigate();
    const { user } = useUser();
    const {
        data: customPackages = [],
        isLoading,
        isError,
    } = useCustomPackagesByUser(user?.userId!);
    const { mutateAsync: createPackage } = useCreatePackage();
    const { mutateAsync: deletePackage } = useDeletePackage();

    // Variable
    const currentMenuIndex = 2;
    const userId = user?.userId;

    const loginCheck = useRequireLogin();

    // Function
    const handleCreatePackage = async () => {
        if (isCreating) {
            window.alert('패키지를 생성 중입니다');
        }

        loginCheck();

        setIsCreating(true);
        const newPackage = await createPackage(
            new PackageModel({
                name: `${user!.name}의 새로운 패키지`,
                description: '',
                user: userId,
            }),
        );
        setEditingPackage(newPackage);

        // navigate
        navigate('/package-detail', { state: { pkg: newPackage } });
    };
    const handleDeletePackage = async (id: number) => {
        if (!userId) return;
        await deletePackage({ id: id, user: userId });
    };
    const handleEditPackage = (pkg: PackageModel) => {
        setEditingPackage(pkg);
        navigate('/package-detail', { state: { pkg: pkg } });
    };

    return (
        <div className={styles.page}>
            <div className={styles.section}>
                <h1 className={styles.title}>찜 목록</h1>
                <p className={styles.description}>나에게 맞는 패키지를 만들어보세요</p>

                <button
                    id="new-package"
                    className={styles.createPackageBtn}
                    onClick={handleCreatePackage}
                >
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
                    ) : (
                        customPackages.map((customPackage) => (
                            <div
                                key={customPackage.id}
                                className={styles.card}
                                onClick={() => handleEditPackage(customPackage)}
                            >
                                <PackageThumbnail pkg={customPackage}>
                                    <button
                                        className={styles.likeButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePackage(customPackage.id!);
                                        }}
                                    >
                                        <img src={FavoriteFill} alt="좋아요 아이콘" />
                                    </button>
                                </PackageThumbnail>
                                <p className={styles.cardTitle}>{customPackage.name}</p>
                            </div>
                        ))
                    )}
                </div>
                <div style={{ height: '10rem' }}></div>
            </div>
            <Footer currentMenuIndex={currentMenuIndex} />
        </div>
    );
}
