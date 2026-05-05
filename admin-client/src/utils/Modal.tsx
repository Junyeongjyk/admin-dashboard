import React, { useState, useEffect, useCallback } from 'react';

interface ModalProps {
  title: string;
  visible: boolean;
  handleVisible: () => void;
  type?: "plus" | string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ 
  title, 
  visible, 
  handleVisible, 
  type = "plus", 
  children 
}) => {
  const [animation, setAnimation] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [blockModal, setBlockModal] = useState<boolean>(false);

  // 모달 열기 로직
  const handleIntro = useCallback(() => {
    setAnimation(true);
    setShowModal(true);
    setBlockModal(false);
  }, []);

  // 모달 닫기 로직 (외부 호출용 및 내부 닫기 버튼용)
  const handleOutro = useCallback(() => {
    if (showModal && !blockModal) {
      setBlockModal(true);
      setAnimation(false);
      
      // 애니메이션 시간(300ms) 대기 후 언마운트
      setTimeout(() => {
        setShowModal(false);
        handleVisible(); // 부모 상태 동기화
      }, 300);
    }
  }, [showModal, blockModal, handleVisible]);

  // 부모의 visible 값이 변할 때의 효과 (Svelte의 $: 역할)
  useEffect(() => {
    if (visible) {
      handleIntro();
    } else {
      // 외부에서 visible을 false로 바꿨을 때 애니메이션 처리
      if (showModal) {
        setAnimation(false);
        setTimeout(() => setShowModal(false), 300);
      }
    }
  }, [visible, handleIntro, showModal]);

  // 모달이 완전히 닫히지 않았을 때만 렌더링
  if (!showModal) return null;

  return (
    <div className="modal">
      {/* 배경 커버 */}
      <div
        className={`modal__cover ${!animation ? "inactive" : ""}`}
        onClick={handleOutro}
        onKeyDown={(e) => e.key === 'Enter' && handleOutro()}
        role="button"
        tabIndex={0}
      ></div>

      {/* 모달 컨텐츠 */}
      <div
        className={`modal__contents 
          ${!animation ? "inactive" : ""} 
          ${type === "plus" ? "plus" : ""}
        `}
      >
        <div className="modal__contents__header">
          <div className="modal__contents__header__title">{title}</div>
          <i
            className="fa-solid fa-xmark modal__contents__header__close"
            onClick={handleOutro}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOutro()}
          ></i>
        </div>
        <div className="modal__contents__content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;