import React, { useEffect, useRef, useState } from 'react';
import './Dashboard.scss';

// 예시용 내부 스크롤 컴포넌트 (다른 컴포넌트를 넣으실 때 이 로직을 참고하세요)
const ScrollableContent = ({ title }) => {
    const handleWheel = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        const isAtTop = scrollTop <= 0;

        // 아래로 내리는데 바닥이 아니거나, 위로 올리는데 천장이 아니면 
        // 부모의 Fullpage 스크롤로 이벤트가 퍼지는 것을 막습니다.
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

const Dashboard = ({ userInfo, signupType }) => {
    const containerRef = useRef(null);
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // 섹션 데이터 구성 (실제 컴포넌트로 교체하세요)
    const sections = [
        { id: 'main-slider', content: <div className="placeholder">Main Slider</div> },
        { id: 'community', content: <ScrollableContent title="커뮤니티 베스트" /> },
        { id: 'why-choose', content: <div className="placeholder">Why Choose Us</div> },
    ];

    const scrollTo = (index) => {
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
        }, 700); // 애니메이션 지속 시간과 맞춤
    };

    const onWheel = (e) => {
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

        // passive: false 옵션을 위해 직접 이벤트 리스너 등록
        container.addEventListener('wheel', onWheel, { passive: false });
        
        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, [current, isAnimating]);

    return (
        <div className="dashboard-container" ref={containerRef}>
            {sections.map((section, i) => (
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