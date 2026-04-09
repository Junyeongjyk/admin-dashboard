import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SignupType } from "src/types/enum/userEnum";
import type { UserItem } from "src/types/user.type";
import { userStore } from "src/stores/userStore";
import Header from "components/header/header";
import LoadingBar from "./LoadingBar";
import Mobile from "components/MobileButton/Mobile";
import MainPage from "../MainPage/MainPage";
import Footer from "src/components/Footer/footer";
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
    // 상태 관리
    const [userInfo, setUserInfo] = useState<UserItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(0);
    const [isDarkHeader, setIsDarkHeader] = useState(false);
    const [isDarkSection, setIsDarkSection] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [pageCount, setPageCount] = useState(0);

    // DOM 참조
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 유저 정보 구독 (Svelte store 대응)
    useEffect(() => {
        const unsubscribe = userStore.subscribe((value) => setUserInfo(value));
        return () => unsubscribe();
    }, []);

    const isPC = () => window.innerWidth >= 800;

    const getSectionHeight = useCallback(() => {
        const section = containerRef.current?.querySelector(".fullpage") as HTMLElement;
        return section?.offsetHeight || window.innerHeight;
    }, []);

    const scrollTo = useCallback((index: number) => {
        const container = containerRef.current;
        const pages = container?.querySelectorAll(".fullpage");
        if (!container || !pages || !pages[index]) return;

        setIsAnimating(true);
        setCurrent(index);

        const target = index * getSectionHeight();
        const start = container.scrollTop;
        const duration = 700;
        let startTime: number;

        const animate = (time: number) => {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);

            // easeInOut Quintic (Svelte의 수식 유지)
            const ease = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            container.scrollTop = start + (target - start) * ease;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
            }
        };

        requestAnimationFrame(animate);
        setIsDarkHeader(index !== 1);
    }, [getSectionHeight]);

    const handleContainerScroll = useCallback(() => {
        if (scrollTimer.current) clearTimeout(scrollTimer.current);

        scrollTimer.current = setTimeout(() => {
            const container = containerRef.current;
            if (!container) return;

            let section = 0;
            if (isPC()) {
                section = Math.round(container.scrollTop / getSectionHeight());
            } else {
                section = Math.floor(window.scrollY / window.innerHeight);
            }

            setIsDarkHeader(section !== 1);
            setIsDarkSection(section !== 1);
        }, 0);
    }, [getSectionHeight]);

    const onWheel = useCallback((e: WheelEvent) => {
        if (!isPC() || isAnimating) return;
        
        e.preventDefault();
        const pages = containerRef.current?.querySelectorAll(".fullpage");
        if (!pages) return;

        if (e.deltaY > 0 && current < pages.length - 1) {
            scrollTo(current + 1);
        } else if (e.deltaY < 0 && current > 0) {
            scrollTo(current - 1);
        }
    }, [current, isAnimating, scrollTo]);

    // 이벤트 리스너 등록
    useEffect(() => {
        if (mainType !== "main") return;

        const container = containerRef.current;
        if (!container) return;

        // 초기 페이지 개수 계산
        setPageCount(container.querySelectorAll(".fullpage").length);
        handleContainerScroll();

        if (isPC()) {
            container.addEventListener("wheel", onWheel, { passive: false });
            container.addEventListener("scroll", handleContainerScroll);
        } else {
            window.addEventListener("scroll", handleContainerScroll);
        }

        return () => {
            if (isPC()) {
                container.removeEventListener("wheel", onWheel);
                container.removeEventListener("scroll", handleContainerScroll);
            } else {
                window.removeEventListener("scroll", handleContainerScroll);
            }
        };
    }, [mainType, onWheel, handleContainerScroll]);

    // 메인 레이아웃 렌더링
    if (mainType === "main") {
        return (
            <div 
                ref={containerRef}
                className={`container fullpage-container ${userInfo?.type === SignupType.DETECTIVE ? 'detective' : ''}`}
            >
                {type === 0 && <Header isDark={isDarkHeader} fixedType="fixed" mainType={mainType} />}
                {type === 2 && <Header type={2} isDark={isDarkHeader} fixedType="fixed" mainType={mainType} />}
                
                <MainPage />
                <LoadingBar isLoading={isLoading} />
                {children}

                {isPC() && pageCount > 1 && (
                    <div className={`page-dots ${isDarkSection ? 'dark' : 'light'}`}>
                        {Array.from({ length: pageCount }).map((_, i) => (
                            <span 
                                key={i}
                                className={i === current ? 'active' : ''} 
                                onClick={() => scrollTo(i)} 
                            />
                        ))}
                    </div>
                )}
                
                <Footer userInfo={userInfo} mainType={mainType} />
                <Mobile />
                {userInfo && <ChatWidget />}
            </div>
        );
    }

    // 일반 레이아웃 렌더링
    return (
        <div 
            ref={containerRef}
            className={`container ${userInfo?.type === SignupType.DETECTIVE ? 'detective' : ''}`}
        >
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