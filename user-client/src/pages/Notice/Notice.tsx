import React, { useState, useEffect } from 'react';
import Modal from "utils/Modal";
import DetailNotice from "./Modal/DetailNotice";
import NoticeListTable from "./NoticeListTable";
import { getAccessToken, got } from "src/utils/helper";
import { ApiPath } from "src/types/enum/apiEnum";
import type { NoticesItem } from "src/types/notices.type";
import "./Notice.scss";

const NoticePage: React.FC = () => {
    //상태(State) 정의
    const [tableList, setTableList] = useState<NoticesItem[]>([]);
    const [detailNoticeVisible, setDetailNoticeVisible] = useState<boolean>(false);
    const [targetItemId, setTargetItemId] = useState<number | undefined>();

    // useEffect 내부에서 호출할 안전한 초기 로드 함수
    useEffect(() => {
        let isMounted = true; // 언마운트 시 메모리 누수 및 컴포넌트 상태 업데이트 방지

        const initFetch = async () => {
            try {
                const params = {};
                const token = await getAccessToken(ApiPath.NOTICES_LIST);
                const response = await got(ApiPath.NOTICES_LIST, 'POST', params, token);

                if (response.status === 1 && isMounted) {
                    setTableList(response.data.items);
                }
            } catch (error) {
                console.error("Failed to fetch notice list:", error);
            }
        };

        initFetch();

        return () => {
            isMounted = false; // 클린업 함수
        };
    }, []);

    // 상세 모달 토글 핸들러
    const handleDetailNoticeVisible = (targetId?: number) => {
        setTargetItemId(targetId);
        setDetailNoticeVisible((prev) => !prev);
    };

    return (
        <div className="content">
            <h2>공지사항</h2>
            
            {/* 공지사항 목록 테이블 */}
            <NoticeListTable 
                handleDetailNoticeVisible={handleDetailNoticeVisible} 
                tableList={tableList} 
            />

            {/* 상세 모달 */}
            {detailNoticeVisible && (
                <Modal 
                    visible={detailNoticeVisible} 
                    handleVisible={() => handleDetailNoticeVisible()} 
                    title="공지사항"
                >
                    <DetailNotice targetItemId={targetItemId} />
                </Modal>
            )}
        </div>
    );
};

export default NoticePage;