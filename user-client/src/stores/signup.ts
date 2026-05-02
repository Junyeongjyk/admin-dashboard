import { useState } from 'react';

export function useSignupFlow() {
  const [signupFlow, setSignupFlow] = useState<boolean>(false);

  return {
    signupFlow,      // 현재 값
    setSignupFlow,   // 값 변경 (스벨트의 set 역할)
    toggleSignupFlow: () => setSignupFlow(prev => !prev) // 토글 기능 추가
  };
}