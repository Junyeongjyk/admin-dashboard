import React, { useState, useEffect, type ReactNode } from 'react';
import './animation.scss';
import './modal.scss';

interface ModalProps {
  title: string;
  visible: boolean;
  handleVisible: () => void;
  type?: string;
  reviewType?: string;
  termsType?: string;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  visible,
  handleVisible,
  type = "plus",
  reviewType = "",
  termsType = "",
  children
}) => {
  const [showModal, setShowModal] = useState(false);
  const [animation, setAnimation] = useState(false);

  // Svelte의 $: visible 로직을 useEffect로 구현
  useEffect(() => {
    if (visible) {
      setShowModal(true);
      setAnimation(true);
    } else {
      // 외부에서 visible을 false로 바꿨을 때의 아웃트로
      setAnimation(false);
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleOutro = () => {
    setAnimation(false);
    setTimeout(() => {
      setShowModal(false);
      handleVisible(); // 부모 상태 업데이트
    }, 300);
  };

  if (!showModal) return null;

  // 타입에 따른 클래스명 설정
  const getModalClass = () => {
    if (reviewType === "review") return "modal review";
    if (termsType === "terms") return "modal terms";
    return "modal";
  };

  return (
    <div className={getModalClass()}>
      {/* 배경 레이어 */}
      <div
        className={`modal__cover ${!animation ? 'inactive' : ''}`}
        onClick={handleOutro}
      />

      {/* 모달 콘텐츠 */}
      <div
        className={`modal__contents ${!animation ? 'inactive' : ''} ${type === 'plus' ? 'plus' : ''}`}
      >
        <div className="modal__contents__header">
          {reviewType === "review" ? (
            title
          ) : (
            <>
              <div className="modal__contents__header__title">{title}</div>
              <i 
                className="fa-solid fa-xmark modal__contents__header__close" 
                onClick={handleOutro} 
              />
            </>
          )}
        </div>
        
        <div className="modal__contents__content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;