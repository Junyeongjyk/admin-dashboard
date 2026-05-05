import React from 'react';

interface PaginationProps {
  fullPage: number;
  currentPage: number;
  handleGetList: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  fullPage, 
  currentPage, 
  handleGetList 
}) => {
  // 클릭 핸들러: a 태그의 기본 동작(# 이동)을 막고 함수 호출
  const handleClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    handleGetList(page);
  };

  if (!fullPage) return null;

  return (
    <div className="pagenation">
      <ul>
        {/* 처음으로 가기 */}
        <li className="shift first">
          <a 
            href="#" 
            className={currentPage > 1 ? "active" : ""} 
            onClick={(e) => currentPage > 1 ? handleClick(e, 1) : e.preventDefault()}
          >
            <i className="fa-solid fa-angles-left"></i>
          </a>
        </li>

        {/* 이전 페이지 */}
        <li className="shift">
          <a 
            href="#" 
            className={currentPage > 1 ? "active" : ""} 
            onClick={(e) => currentPage > 1 ? handleClick(e, currentPage - 1) : e.preventDefault()}
          >
            <i className="fa-solid fa-angle-left"></i>
          </a>
        </li>

        {/* 앞쪽 줄임표 (...) */}
        {fullPage > 4 && currentPage >= 3 && (
          <li className="shift">
            <a href="#"><i className="fa-solid fa-ellipsis"></i></a>
          </li>
        )}

        {/* 페이지 번호 로직 */}
        {fullPage < 5 ? (
          // 페이지가 5개 미만일 때 전체 출력
          Array.from({ length: fullPage }).map((_, i) => (
            <li key={i} className={`page ${currentPage === i + 1 ? "active" : ""}`}>
              <a 
                href="#" 
                onClick={(e) => currentPage === i + 1 ? e.preventDefault() : handleClick(e, i + 1)}
              >
                {i + 1}
              </a>
            </li>
          ))
        ) : (
          // 페이지가 5개 이상일 때 분기 처리
          <>
            {currentPage <= 2 ? (
              // 초기 페이지 근처 (1, 2, 3, 4)
              [1, 2, 3, 4].map(num => (
                <li key={num} className={`page ${currentPage === num ? "active" : ""}`}>
                  <a href="#" onClick={(e) => handleClick(e, num)}>{num}</a>
                </li>
              ))
            ) : currentPage >= fullPage - 1 ? (
              // 끝 페이지 근처
              [fullPage - 3, fullPage - 2, fullPage - 1, fullPage].map(num => (
                <li key={num} className={`page ${currentPage === num ? "active" : ""}`}>
                  <a href="#" onClick={(e) => handleClick(e, num)}>{num}</a>
                </li>
              ))
            ) : (
              // 중간 페이지 (이전, 현재, 다음)
              [currentPage - 1, currentPage, currentPage + 1].map(num => (
                <li key={num} className={`page ${currentPage === num ? "active" : ""}`}>
                  <a href="#" onClick={(e) => handleClick(e, num)}>{num}</a>
                </li>
              ))
            )}
          </>
        )}

        {/* 뒤쪽 줄임표 (...) */}
        {fullPage >= 5 && currentPage <= fullPage - 2 && (
          <li className="shift">
            <a href="#"><i className="fa-solid fa-ellipsis"></i></a>
          </li>
        )}

        {/* 다음 페이지 */}
        <li className="shift">
          <a 
            href="#" 
            className={currentPage < fullPage ? "active" : ""} 
            onClick={(e) => currentPage < fullPage ? handleClick(e, currentPage + 1) : e.preventDefault()}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </a>
        </li>

        {/* 마지막으로 가기 */}
        <li className="shift last">
          <a 
            href="#" 
            className={currentPage < fullPage ? "active" : ""} 
            onClick={(e) => currentPage < fullPage ? handleClick(e, fullPage) : e.preventDefault()}
          >
            <i className="fa-solid fa-angles-right"></i>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;