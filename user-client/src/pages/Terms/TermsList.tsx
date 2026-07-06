import React, { useState } from "react";
// import { useUserStore } from "src/stores/userStore"; // 실제 전역 스토어가 있다면 주석 해제 후 userInfo를 가져오세요!
import type { UserItem } from "src/types/user.type";

interface FaqListProps {
    // 만약 부모 컴포넌트나 전역에서 userInfo를 넘겨받는다면 다음과 같이 정의합니다.
    userInfo?: UserItem | null; 
}

export const FaqList: React.FC<FaqListProps> = ({ userInfo }) => {
    // useEffect 내부에서 setState를 하지 않고, 초기값 설정 시점에 최초 1회 URL 파라미터를 읽습니다.
    const [openFaqId, setOpenFaqId] = useState<number | null>(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const openId = params.get("open");
            return openId ? Number(openId) : null;
        }
        return null;
    });

    // 아코디언 토글 핸들러
    const handleDetailFaqVisible = (id: number) => {
        setOpenFaqId((prevId) => (prevId === id ? null : id));
    };

    if (!userInfo) return null;

    return (
        <div className="list faq">
            <button
                type="button"
                className={`list__item ${openFaqId === 1 ? "is-active" : ""}`}
                onClick={() => handleDetailFaqVisible(1)}
            >
                <div className="title">
                    <div className="list__title">이용약관</div>
                    <span>
                        {openFaqId === 1 ? (
                            <i className="fa-solid fa-chevron-up"></i>
                        ) : (
                            <i className="fa-solid fa-chevron-down"></i>
                        )}
                    </span>
                </div>
            </button>

            {openFaqId === 1 && (
                <div className="list__detail">
                    <p>이용약관 상세 내용이 표시되는 곳입니다.</p>
                </div>
            )}
        </div>
    );
};

export default FaqList;