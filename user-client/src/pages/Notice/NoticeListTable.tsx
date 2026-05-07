import React from 'react';
import { useNavigate } from 'react-router-dom';

// 스타일 시트 임포트 (프로젝트 구조에 맞게 경로 조정 필요)
import "../../styles/form.scss";

interface NoticeListTableProps {
    handleDetailNoticeVisible: (id?: number) => void;
    tableList: NoticesItem[];
}

// 카테고리 매핑 정보
const categoryMap: Record<string, string> = {
    NORMAL: "일반",
    SYSTEM: "시스템",
    UPDATE: "업데이트",
    EVENT: "이벤트",
    POLICY: "정책",
    ETC: "기타",
};

// 카테고리별 색상 매핑 정보
const categoryColorMap: Record<string, { bg: string; text: string }> = {
    NORMAL: { bg: "", text: "#374151" },
    SYSTEM: { bg: "", text: "#1D4ED8" },
    UPDATE: { bg: "", text: "#065F46" },
    EVENT: { bg: "", text: "#991B1B" },
    POLICY: { bg: "", text: "#5B21B6" },
    ETC: { bg: "#F3F4F6", text: "#111827" }, // 배경색 예시 추가
};

const NoticeListTable: React.FC<NoticeListTableProps> = ({ tableList }) => {
    const navigate = useNavigate();

    return (
        <div className="list">
            {tableList && tableList.length > 0 ? (
                tableList.map((item) => {
                    const categoryStyle = categoryColorMap[item.category] || { bg: "", text: "#000" };
                    
                    return (
                        <div className="list__item" key={item.id}>
                            {/* 제목 클릭 시 해당 공지사항 상세 페이지로 이동 */}
                            <div
                                className="list__title"
                                onClick={() => navigate(`/notice/${item.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.title}
                            </div>

                            {/* 카테고리 배지 */}
                            <div 
                                className="list__category"
                                style={{
                                    backgroundColor: categoryStyle.bg,
                                    color: categoryStyle.text
                                }}
                            >
                                {categoryMap[item.category] ?? item.category}
                            </div>

                            {/* 날짜 표시 (예약일 우선, 없으면 생성일) */}
                            <div className="list__date">
                                {item.reservedAt ?? item.createdAt}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>데이터가 없습니다.</p>
            )}
        </div>
    );
};

export default NoticeListTable;