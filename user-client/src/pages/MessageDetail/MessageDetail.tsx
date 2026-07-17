import { koreaDateFormat } from '../../utils/helper';
import './MessageDetail.scss';

interface MessageDetailProps {
  type?: number; // 0: 파트너 상담, 1: 관리자 상담
}

export default function MessageDetail({ type = 0 }: MessageDetailProps) {
  // 💡 [해결] unused-vars 경고를 방지하기 위해 사용하지 않던 useParams와 id 선언을 제거했습니다.

  // 고정 데이터 (Svelte 원본 유지)
  const message = [
    {
      id: 1,
      userId: 3,
      category: "문의",
      title: "파트너님께 상담드립니다.",
      contents: "파트너님께 상담드립니다",
      status: 1,
      province: "서울",
      createdAt: "2025-01-10 14:30:00",
      updatedAt: "2025-01-10 14:30:00",
      file: "파트너 상담하기.pdf (1.4M)",
    },
  ];

  const messageType1 = [
    {
      id: 2,
      userId: 7,
      category: "문의",
      title: "관리자님께 상담드립니다.",
      contents: "관리자님께 상담드립니다",
      status: 2,
      province: "경기",
      createdAt: "2025-01-12 11:20:00",
      updatedAt: "2025-01-12 11:20:00",
      file: "관리자 상담하기.pdf (1.4M)",
    },
  ];

  // 다운로드 핸들러
  const handleDownload = (fileName: string) => {
    console.log(`${fileName} 다운로드 시작`);
  };

  return (
    <section className="request-form content">
      <h2>상담하기</h2>
      
      {type === 0 ? (
        // 1. 파트너 상담 영역 (type === 0)
        <>
          <div className="title">
            <h4>{message[0].title}</h4>
            <p>{koreaDateFormat(message[0].createdAt)}</p>
          </div>

          <div className="form-group">
            <button 
              type="button" 
              className="download"
              onClick={() => handleDownload(message[0].file)}
            >
              <i className="fa-solid fa-download"></i>
              {message[0].file}
            </button>
            {/* 💡 [해결] readonly 대신 리액트 표준 스펙인 readOnly 속성으로 대체했습니다. */}
            <textarea
              readOnly
              value={message[0].contents}
            />
          </div>
        </>
      ) : (
        // 2. 관리자 상담 영역 (type === 1)
        <>
          <div className="form-group">
            <h4>{messageType1[0].title}</h4>
            <p>{koreaDateFormat(messageType1[0].createdAt)}</p>
          </div>

          <div className="form-group">
            <button 
              type="button" 
              className="download"
              onClick={() => handleDownload(messageType1[0].file)}
            >
              <i className="fa-solid fa-download"></i>
              {messageType1[0].file}
            </button>
            {/* 💡 [해결] readonly 대신 리액트 표준 스펙인 readOnly 속성으로 대체했습니다. */}
            <textarea
              readOnly
              value={messageType1[0].contents}
            />
          </div>
        </>
      )}
    </section>
  );
}