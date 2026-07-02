import React, { useState, useEffect } from 'react';
import { ApiPath } from "src/types/enum/apiEnum";
import type { NoticesItem } from "src/types/notices.type";
import { getAccessToken, got } from "src/utils/helper";
import "../../../styles/form.scss";

interface DetailNoticeProps {
    targetItemId: number | undefined;
}

const DetailNotice: React.FC<DetailNoticeProps> = ({ targetItemId }) => {
    const [targetItem, setTargetItem] = useState<NoticesItem | null>(null);

    // useEffect 내부에서 독립적으로 실행되도록 변경 (메모리 누수 방지 포함)
    useEffect(() => {
        if (!targetItemId) return;
        
        let isMounted = true;

        const fetchNoticeDetail = async () => {
            try {
                const apiPath = `${ApiPath.NOTICES_DETAIL}${targetItemId}`;
                const token = await getAccessToken(apiPath);
                const response = await got(apiPath, 'GET', {}, token);

                if (response.status === 1 && isMounted) {
                    setTargetItem(response.data);
                }
            } catch (error) {
                console.error("상세 정보를 가져오는 데 실패했습니다:", error);
            }
        };

        fetchNoticeDetail();

        return () => {
            isMounted = false;
        };
    }, [targetItemId]);

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
            {/* 혹시 모를 undefined를 대비해 빈 문자열(|| "") 처리 */}
            <div 
                className="contents-container"
                dangerouslySetInnerHTML={{ __html: targetItem.content || "" }}
            />
        </div>
    );
};

export default DetailNotice;