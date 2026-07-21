interface KakaoWindow {
    Postcode: new (options: {
        oncomplete?: (data: PostcodeData) => void;
    }) => {
        open(): void;
    };
}

declare global {
    interface Window {
        kakao?: KakaoWindow;
    }
}

let loading: Promise<void> | null = null;

export const loadPostcodeScript = (): Promise<void> => {
    if (typeof window === 'undefined') return Promise.resolve(); // SSR guard
    if (window.kakao?.Postcode) return Promise.resolve();

    if (!loading) {
        loading = new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Daum postcode script load failed'));
            document.head.appendChild(script);
        });
    }
    return loading;
} 


export type PostcodeData = {
    zonecode: string;
    address: string;        // 기본 주소(선택 값 반영된 주소)
    roadAddress: string;    // 도로명
    jibunAddress: string;   // 지번
    userSelectedType: 'R' | 'J';
    bname: string;
    buildingName: string;
    apartment: 'Y' | 'N';
    autoRoadAddress?: string;
    autoJibunAddress?: string;
};