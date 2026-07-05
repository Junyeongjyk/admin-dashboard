import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CommunityItem } from "src/types/community.type";
import { CommunityCategoryLabel, CommunityPostType } from "src/types/enum/communityEnum";
import { ApiPath } from "src/types/enum/apiEnum";
import "./Community.scss"; // SCSS 임포트

interface CommunityProps {
    tableList: CommunityItem[];
    initialPage?: number; // Svelte의 currentPage에 대응 (기본값 1)
    limit: number;
}

const categoryImageMap: Record<CommunityPostType, number> = {
    [CommunityPostType.GENERAL]: 1,
    [CommunityPostType.QUESTION]: 2,
    [CommunityPostType.SHARE]: 3,
    [CommunityPostType.REVIEW]: 4,
    [CommunityPostType.OPINION]: 5,
    [CommunityPostType.REQUEST]: 6,
    [CommunityPostType.REPORT]: 7,
};

export const Community: React.FC<CommunityProps> = ({ 
    tableList = [], 
    initialPage = 1, 
    limit 
}) => {
    const navigate = useNavigate();
    
    // 상태 관리 (Svelte의 let 변수 및 반응성 대체)
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [errorMap, setErrorMap] = useState<Record<number, boolean>>({});

    // Svelte의 $: 반응성 변수들을 일반 변수로 계산 (렌더링 시마다 자동 계산)
    const visibleCount = currentPage * limit;
    const visibleList = tableList.slice(0, visibleCount);

    const loadMore = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const getCategoryLabel = (category: string) => {
        return CommunityCategoryLabel[category as CommunityPostType] ?? category;
    };

    const getDefaultImage = (category: string) => {
        const key = category as CommunityPostType;
        const index = categoryImageMap[key] ?? 1;
        return `/assets/images/category/community${index}.png`;
    };

    const handleImageError = (id: number) => {
        setErrorMap((prev) => ({ ...prev, [id]: true }));
    };

    return (
        <>
            <ul className="community">
                {visibleList.length > 0 &&
                    visibleList.map((item) => (
                        <li key={item.id} className="community__list">
                            <button
                                type="button"
                                className="community__item"
                                onClick={() => navigate(`/community/${item.id}`)}
                            >
                                <div className="thumbnail">
                                    {errorMap[item.id] ? (
                                        <img src={getDefaultImage(item.category)} alt="default" />
                                    ) : (
                                        <img
                                            src={`${process.env.REACT_APP_URL || ''}${ApiPath.COMMUNITY_IMAGE}/${item.id}`}
                                            alt="thumbnail"
                                            onError={() => handleImageError(item.id)}
                                        />
                                    )}
                                </div>
                                <div className="community__txt">
                                    <p className="community__title">{item.title}</p>
                                    <p className="community__title">
                                        <span className="category">
                                            {getCategoryLabel(item.category)}
                                        </span>
                                    </p>

                                    <p className="community__date">
                                        {item.createdAt ? item.createdAt.split(" ")[0] : ""}
                                    </p>
                                    <div className="community__footer">
                                        <p>
                                            <i className="fa-solid fa-message"></i>
                                            {item.commentCount ?? "0"}
                                        </p>
                                        <p>
                                            <i className="fa-solid fa-eye"></i>
                                            {item.viewCount}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))}
            </ul>

            {/* 더보기 버튼 */}
            {tableList.length > visibleCount && (
                <div className="load-more">
                    <button type="button" onClick={loadMore}>
                        더보기
                    </button>
                </div>
            )}

            {/* 게시글 없음 메시지 */}
            {(!tableList || tableList.length === 0) && (
                <p className="no-community text-center">게시글이 없습니다.</p>
            )}
        </>
    );
};

export default Community;