import React, { useEffect, useRef, useState } from 'react';
import './Dashboard.scss';

// 1. ScrollableContent 컴포넌트 Props 타입 정의
interface ScrollableContentProps {
    title: string;
}

const ScrollableContent: React.FC<ScrollableContentProps> = ({ title }) => {
    // e는 React의 Wheel 이벤트 타입 지정
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        const isAtTop = scrollTop <= 0;

        if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
            e.stopPropagation();
        }
    };

    return (
        <div className="scroll-box" onWheel={handleWheel}>
            <h3>{title} (내부 스크롤 가능)</h3>
            {Array.from({ length: 20 }).map((_, i) => (
                <p key={i}>내부 콘텐츠 라인 {i + 1}</p>
            ))}
        </div>
    );
};

// 2. Dashboard 컴포넌트 Props 타입 정의
interface DashboardProps {
    userInfo?: string;  
    signupType?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userInfo, signupType }) => {
    // 3. HTMLDivElement 타입을 지정하여 'never' 에러 해결
    const containerRef = useRef<HTMLDivElement>(null);
    const [current, setCurrent] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    // 사용하지 않는 변수 경고(ESLint) 방지를 위해 콘솔에 남기거나 주석 처리
    // 실제 사용하신다면 이 코드는 지우셔도 됩니다.
    useEffect(() => {
        if (userInfo || signupType) {
            console.log('User info or signup type loaded');
        }
    }, [userInfo, signupType]);

    const sections = [
        { id: 'main-slider', content: <div className="placeholder">Main Slider</div> },
        { id: 'community', content: <ScrollableContent title="커뮤니티 베스트" /> },
        { id: 'why-choose', content: <div className="placeholder">Why Choose Us</div> },
    ];

    // index 매개변수에 number 타입 지정
    const scrollTo = (index: number) => {
        if (!containerRef.current || isAnimating) return;

        setIsAnimating(true);
        setCurrent(index);

        const target = index * window.innerHeight;
        
        containerRef.current.scrollTo({
            top: target,
            behavior: 'smooth'
        });

        setTimeout(() => {
            setIsAnimating(false);
        }, 700);
    };

    // 네이티브 wheel 이벤트 타입 지정
    const onWheel = (e: WheelEvent) => {
        if (window.innerWidth < 800 || isAnimating) return;

        // 브라우저 전체 스크롤 방지
        e.preventDefault();

        if (e.deltaY > 0 && current < sections.length - 1) {
            scrollTo(current + 1);
        } else if (e.deltaY < 0 && current > 0) {
            scrollTo(current - 1);
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', onWheel, { passive: false });
        
        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, [current, isAnimating]);

    return (
        <div className="dashboard-container" ref={containerRef}>
            {/* map의 첫 번째 인자가 사용되지 않을 때는 _나 _section 등으로 표현하여 ESLint 우회 */}
            {sections.map((section) => (
                <section key={section.id} className="fullpage-section">
                    <div className="section-content">
                        {section.content}
                    </div>
                </section>
            ))}

            {/* 페이지 네비게이션 도트 */}
            <div className="page-dots">
                {sections.map((_, i) => (
                    <span 
                        key={i} 
                        className={i === current ? 'active' : ''} 
                        onClick={() => scrollTo(i)} 
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;