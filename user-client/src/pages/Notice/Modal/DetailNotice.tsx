import React, { useState, useEffect } from 'react';
import { ApiPath } from "src/types/enum/apiEnum";
import { NoticesItem } from "src/types/notices.type";
import { getAccessToken, got } from "src/utils/helper";

// SCSS 임포트 (경로 확인 필요)
import "../../../styles/form.scss";

interface DetailNoticeProps {
    targetItemId: number | undefined;
}

const DetailNotice: React.FC<DetailNoticeProps> = ({ targetItemId }) => {
    const [targetItem, setTargetItem] = useState<NoticesItem | null>(null);

    // 공지사항 상세 데이터 가져오기
    const handleGetNotice = async () => {
        if (!targetItemId) return;

        try {
            const apiPath = `${ApiPath.NOTICES_DETAIL}${targetItemId}`;
            const token = await getAccessToken(apiPath);
            const response = await got(apiPath, 'GET', {}, token);

            if (response.status === 1) {
                setTargetItem(response.data);
            }
        } catch (error) {
            console.error("상세 정보를 가져오는 데 실패했습니다:", error);
        }
    };

    // 마운트 시 데이터 로드 (Svelte의 onMount)
    useEffect(() => {
        handleGetNotice();
    }, [targetItemId]); // targetItemId가 변경될 때마다 다시 호출

    if (!targetItem) return null; // 데이터 로딩 중 처리

    return (
        <div className="form-body">
            <div className="form-group">
                <div>
                    <label>작성일</label>
                    <input 
                        type="text" 
                        readOnly 
                        value={targetItem.reservedAt ?? targetItem.createdAt} 
                    />
                </div>
            </div>

            <div className="form-group">
                <div>   
                    <label>제목</label>
                    <input 
                        type="text" 
                        value={targetItem.title} 
                        readOnly 
                    />
                </div>
            </div>

            {/* Svelte의 {@html}은 dangerouslySetInnerHTML로 대체 */}
            <div 
                className="contents-container"
                dangerouslySetInnerHTML={{ __html: targetItem.content }}
            />

            <style jsx>{`
                .contents-container {
                    border: 2px solid var(--border-color);
                    border-radius: 10px;
                    padding: 2.538rem 1rem;
                    min-height: 400px;
                    overflow-y: auto;
                }
            `}</style>
        </div>
    );
};

export default DetailNotice;