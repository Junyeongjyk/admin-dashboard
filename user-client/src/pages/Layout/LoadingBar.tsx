import React from 'react';
import './LoadingBar.css'; // 아래 CSS 내용을 이 파일에 넣으세요.

interface LoadingBarProps {
  isLoading: boolean;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ isLoading }) => {
  // Svelte의 {#if isLoading}과 동일한 역할
  if (!isLoading) return null;

  return (
    <div className="loading-bar">
      <div className="bar"></div>
    </div>
  );
};

export default LoadingBar;