import { useState } from 'react';
import type { PartnerItem } from "src/types/partner.type";

export function usePartnerStore() {
  const [partner, setPartner] = useState<PartnerItem | null>(null);

  return {
    partner,    // 현재 상태값
    setPartner, // 상태 변경 함수 (writable의 set/update 역할)
    
    // 필요하다면 초기화 기능 추가
    resetPartner: () => setPartner(null)
  };
}