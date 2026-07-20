import React, { useEffect, useRef } from 'react';
import { loadPostcodeScript, type PostcodeData } from 'utils/lib/Postcode';
import '../styles/postcode.scss';

export interface PostcodeModalProps {
  onSelect: (data: PostcodeData) => void;
  onClose: () => void;
}

export const PostcodeModal: React.FC<PostcodeModalProps> = ({ onSelect, onClose }) => {
  // bind:this={postcodeEl} 역할을 하는 ref 생성
  const postcodeElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const initPostcode = async () => {
      try {
        // 스크립트 로드
        await loadPostcodeScript();

        // 컴포넌트가 마운트 해제되지 않았고 ref DOM 요소가 존재할 때만 실행
        if (isMounted && postcodeElRef.current && window.kakao?.Postcode) {
          const selectPost = new window.kakao.Postcode({
            width: '100%',
            height: '500px',
            oncomplete: (data: PostcodeData) => {
              onSelect(data);
            },
            onclose: () => {
              onClose();
            },
          });

          // DOM 요소에 우편번호 팝업 임베드
          selectPost.embed(postcodeElRef.current);
        }
      } catch (error) {
        console.error('카카오 우편번호 스크립트 로드 실패:', error);
      }
    };

    initPostcode();

    // cleanup 함수
    return () => {
      isMounted = false;
    };
  }, [onSelect, onClose]);

  return (
    <div className="postcode">
      <div className="postcode__cover">
        <div className="postcode__contents">
          <button type="button" className="postcode__close" onClick={onClose}>
            <i className="fa-solid fa-x"></i>
          </button>

          {/* 스벨트의 bind:this={postcodeEl} 대용 */}
          <div className="postcode-body" ref={postcodeElRef} />
        </div>
      </div>
    </div>
  );
};

export default PostcodeModal;