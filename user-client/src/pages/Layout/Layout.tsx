import React, { useState, useEffect, useRef } from 'react';
import { SignupType } from "src/types/enum/userEnum";
import type { UserItem } from "src/types/user.type";
import { userStore } from "src/stores/userStore";
import Header from "components/header/header";
import LoadingBar from "./LoadingBar";
import Mobile from "components/MobileButton/Mobile";
import Footer from "src/components/Footer/Footer";
import ChatWidget from "./import/ChatWidget";
import "./Layout.scss";

interface LayoutProps {
    type?: number;
    mainType?: string;
    pageType?: string;
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
    type = 0, 
    mainType = "", 
    pageType = "", 
    children 
}) => {
    const [userInfo, setUserInfo] = useState<UserItem | null>(null);
    const [isLoading] = useState(false); // 로딩 상태 제어 필요 시 활용

    // 유저 정보 구독
    useEffect(() => {
        const unsubscribe = userStore.subscribe((value) => setUserInfo(value));
        return () => unsubscribe();
    }, []);

    // 메인 레이아웃 (대쉬보드 등 풀페이지 컴포넌트가 children으로 들어올 때)
    if (mainType === "main") {
        return (
            <div className={`container fullpage-container ${userInfo?.type === SignupType.PARTNER ? 'partner' : ''}`}>
                {/* 헤더: 스크롤에 따른 다크모드 제어는 이제 Header 내부나 각 페이지에서 prop으로 전달받아야 함 */}
                {type === 0 && <Header fixedType="fixed" mainType={mainType} />}
                {type === 2 && <Header type={2} fixedType="fixed" mainType={mainType} />}
                
                {/* MainPage가 고정으로 들어가는 구조라면 유지, 아니라면 children만 둡니다 */}
                {/* <MainPage /> */}
                
                <LoadingBar isLoading={isLoading} />
                
                {/* 대쉬보드에서 구현한 풀페이지 스크롤 컴포넌트가 이 위치에 렌더링됩니다 */}
                {children}

                <Footer userInfo={userInfo} mainType={mainType} />
                <Mobile />
                {userInfo && <ChatWidget />}
            </div>
        );
    }

    // 일반 레이아웃 (서브 페이지용)
    return (
        <div className={`container ${userInfo?.type === SignupType.PARTNER ? 'partner' : ''}`}>
            {type === 0 && <Header />}
            {type === 2 && <Header type={2} />}
            
            <main className="app-content wrap">
                <LoadingBar isLoading={isLoading} />
                {children}
            </main>

            <Footer userInfo={userInfo} pageType={pageType === "page" ? "page" : undefined} />
            <Mobile />
            {userInfo && <ChatWidget />}
        </div>
    );
};

export default Layout;