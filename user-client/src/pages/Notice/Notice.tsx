import React, { useState, useEffect } from 'react';
import Modal from "utils/Modal";
import DetailNotice from "./Modal/DetailNotice";
import NoticeListTable from "./NoticeListTable";
import { getAccessToken, got } from "src/utils/helpers";
import { ApiPath } from "src/types/enum/apiEnum";
import { NoticesItem } from "src/types/notices.type";

// SCSS 모듈 혹은 일반 CSS 임포트
import "./Notice.scss";

const NoticePage: React.FC = () => {
    // 1. 상태(State) 정의
    const [tableList, setTableList] = useState<NoticesItem[]>([]);
    const [detailNoticeVisible, setDetailNoticeVisible] = useState<boolean>(false);
    const [targetItemId, setTargetItemId] = useState<number | undefined>();

    // 2. 공지사항 목록 조회 함수
    const handleGetList = async () => {
        try {
            const params = {};
            const token = await getAccessToken(ApiPath.NOTICES_LIST);
            const response = await got(ApiPath.NOTICES_LIST, 'POST', params, token);

            if (response.status === 1) {
                setTableList(response.data.items);
            }
        } catch (error) {
            console.error("Failed to fetch notice list:", error);
        }
    };

    // 3. 초기 데이터 로드 (Svelte의 init 호출 대체)
    useEffect(() => {
        handleGetList();
    }, []);

    // 4. 상세 모달 토글 핸들러
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