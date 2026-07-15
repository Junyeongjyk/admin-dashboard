import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { NoticesItem } from "../../types/notices.type";
import { ApiPath } from "../../types/enum/apiEnum";
import { getAccessToken, got } from "../../utils/helper";
import "./DetailNoticePage.scss";

interface DetailNoticePageProps {
  id?: string; // 라우터에서 직접 Props로 넘겨줄 경우를 대비
}

export default function DetailNoticePage({ id: propId }: DetailNoticePageProps) {
  // react-router-dom의 useParams에서 id를 가져오고, 없으면 props의 id를 사용합니다.
  const { id: paramId } = useParams<{ id: string }>();
  const id = propId || paramId;

  const [targetItem, setTargetItem] = useState<NoticesItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 공지사항 상세 데이터 호출 함수
  const handleGetNotice = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const url = `${ApiPath.NOTICES_DETAIL}${id}`;
      const token = await getAccessToken(url);
      
      const response = await got(url, "GET", {}, token);
      
      if (response.status === 1) {
        setTargetItem(response.data);
      }
    } catch (error) {
      console.error("공지사항을 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Svelte의 onMount 대용: id가 바뀔 때마다 데이터 다시 로드
  useEffect(() => {
    handleGetNotice();
  }, [id]);

  if (isLoading) {
    return <div className="content">로딩 중...</div>;
  }

  return (
    <div className="content">
      <h2>공지사항</h2>
      
      {targetItem && (
        <>
          <div className="title">
            <h3>{targetItem.title}</h3>
            <p>
              {targetItem.reservedAt ?? targetItem.createdAt}
            </p>
          </div>

          {/* Svelte의 {@html targetItem.content} 역할을 수행
            XSS 공격 방지를 위해 API 데이터를 렌더링할 때 dangerouslySetInnerHTML을 사용합니다.
          */}
          <div 
            className="content__container"
            dangerouslySetInnerHTML={{ __html: targetItem.content }} 
          />
        </>
      )}
    </div>
  );
}