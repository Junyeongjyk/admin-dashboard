import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, got } from "utils/helpers";
import LayoutContainer from "pages/Layout/LayoutContainer";
import BoardSearchForm from "utils/BoardSearchForm";
import CommunityList from "./CommunityList";

// Types & Enums
import { SearchType } from "src/types/enum/communityEnum";
import { ApiPath } from "src/types/enum/apiEnum";
import { BannerPosition } from "src/types/enum/ethEnum";
import type { UserItem } from "src/types/user.type";
import type { CommunityItem } from "src/types/community.type";
import type { BannerItem } from "src/types/system.type";

// Store (Zustand나 Redux 등을 사용 중이라 가정하거나, 기존 store에서 값을 가져옴)
import { useUserStore } from "src/stores/userStore"; 

import "./Community.scss";

const Community: React.FC = () => {
    const navigate = useNavigate();
    
    // States
    const [banners, setBanners] = useState<BannerItem[]>([]);
    const [keyword, setKeyword] = useState<string>("");
    const [filter, setFilter] = useState<string>(SearchType.TITLE);
    const [tableList, setTableList] = useState<CommunityItem[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    
    // User Info (Svelte의 subscribe 대신 React-friendly한 store 사용 권장)
    const userInfo = useUserStore((state) => state.userInfo); 
    const limit = 20;

    // API 호출 함수
    const handleGetList = async () => {
        const params = {
            category: userInfo?.type,
            q: keyword,
            filter: filter
        };

        try {
            const token = await getAccessToken(ApiPath.COMMUNITY_POST_LIST);
            const response = await got(ApiPath.COMMUNITY_POST_LIST, 'POST', params, token);
            
            if (response.status === 1) {
                setBanners(response.data.banners || []);
                
                // 데이터 정렬 및 저장
                const sortedItems = (response.data.items as CommunityItem[]).sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                
                setTableList(sortedItems);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("Failed to fetch community list:", error);
        }
    };

    // 브라우저 리사이즈 체크
    const checkMobile = () => {
        setIsMobile(window.innerWidth <= 800);
    };

    // Lifecycle: onMount & onDestroy (useEffect)
    useEffect(() => {
        checkMobile();
        handleGetList();
        
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, [userInfo?.type]); // 유저 타입 변경 시 다시 로드하거나 필요 시 의존성 조정

    return (
        <LayoutContainer type={2}>
            <div className="content max-width">
                <div className="content__end">
                    <BoardSearchForm 
                        keyword={keyword} 
                        setKeyword={setKeyword} 
                        filter={filter} 
                        setFilter={setFilter} 
                        handleGetList={handleGetList} 
                    />
                </div>
                
                <div className="width">
                    <h3>전체글</h3>
                    <button 
                        type="button" 
                        className="write"
                        onClick={() => navigate(`/community/write`)}
                    >
                        <i className="fa-solid fa-plus"></i>
                        글쓰기
                    </button>
                </div>

                <CommunityList 
                    tableList={tableList} 
                    limit={limit} 
                    currentPage={currentPage} 
                />
            </div>

            <div className="content__right">
                <div className="banner__group">
                    {banners && banners.length > 0 && banners.map((banner, index) => (
                        <aside 
                            key={index} 
                            className={`banner ${banner.position === BannerPosition.UP ? 'first' : 'second'}`}
                        >
                            <div className="banner__box">
                                <span className="banner__tag">EVENT</span>
                                <div className="banner__title">
                                    {banner.title}
                                </div>
                                <div 
                                    className="banner__desc"
                                    dangerouslySetInnerHTML={{ __html: banner.content }}
                                />
                                {banner.buttonTitle && (
                                    <button 
                                        type="button"
                                        className="banner__btn"
                                        onClick={() => {
                                            if (banner.link) window.open(banner.link, "_blank");
                                        }}
                                    >
                                        {banner.buttonTitle}
                                    </button>
                                )}
                            </div>
                        </aside>
                    ))}
                </div>
            </div>
        </LayoutContainer>
    );
};

export default Community;