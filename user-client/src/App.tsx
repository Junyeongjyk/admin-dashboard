import { useState, useEffect, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { getRouter } from './router';
import { getCookie, got } from './utils/helper';
import { ApiPath } from './types/enum/apiEnum';
import type { Category } from './types/category';
import type { Envelope } from './utils/lib/mqtt/Envelope';
import type { UserItem } from './types/user.type';
import { connectRealtimeSub } from './utils/lib/mqtt/Mqtt-sub';
import { EventType } from './utils/lib/mqtt/Envelope';
import { useUserStore } from './stores/userStore'; 
import { useRequestsStore } from './stores/requests.store';
import './styles/popup.scss';

export default function App() {
  //ESLint react-hooks/set-state-in-effect 에러 해결: 상태 초기화 시점에 안전하게 동기 주입
  const [userInfo, setUserInfo] = useState<UserItem | null>(() => {
    const myInfoCookie = getCookie('myInfo');
    if (myInfoCookie) {
      try {
        return JSON.parse(myInfoCookie) as UserItem;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!getCookie('myInfo');
  });

  const userSocketRef = useRef<any>(null);

  // Zustand 스토어 바인딩
  const setUserInfoStore = useUserStore((state) => state.setUserInfo);
  const setIsLoggedInStore = useUserStore((state) => state.setIsLoggedIn);
  const setCategoryList = useRequestsStore((state) => state.setCategoryList);
  const setSystemOption = useRequestsStore((state) => state.setSystemOption);
  const setBanWords = useRequestsStore((state) => state.setBanWords);
  const setChatMessage = useRequestsStore((state) => state.setChatMessage);

  // 초기 로드 시 Zustand 스토어 동기화 (Svelte의 userInformation.set, hasCookie.set 대응)
  useEffect(() => {
    setUserInfoStore(userInfo);
    setIsLoggedInStore(isLoggedIn);
  }, [userInfo, isLoggedIn, setUserInfoStore, setIsLoggedInStore]);

  // 2. 파트너 유저 여부에 따른 Body 클래스 제어
  useEffect(() => {
    if (userInfo?.type === 'PARTNER') {
      document.body.classList.add('partner');
    } else {
      document.body.classList.remove('partner');
    }
  }, [userInfo]);

  // 소켓 및 API 함수 정의
  const socketDisconnect = () => {
    if (userSocketRef.current) {
      userSocketRef.current.end(true);
    }
    userSocketRef.current = null;
  };

  const socketConnect = () => {
    if (!isLoggedIn || !userInfo) return;
    socketDisconnect();

    // ✅ TS 2345 에러 해결: clientId 속성 추가 및 매개변수 바인딩 타입 단일화
    userSocketRef.current = connectRealtimeSub({
      wsUrl: process.env.VITE_MQTT_WS_URL || '',
      topic: process.env.VITE_MQTT_TOPIC || '',
      userId: String(userInfo.userId || userInfo.id),
      clientId: `client_${userInfo.userId || userInfo.id}_${Date.now()}`,
      username: userInfo.username || '',
      password: userInfo.password || '',
      onStatus: () => {},
      onEnvelope: (event: Envelope) => {
        if (event.event_type === EventType.CHAT_MESSAGE_CREATE) {
          setChatMessage(event.payload);
        }
      },
    });
  };

  // 3. API 호출 및 소켓 연결 라이프사이클 처리
  useEffect(() => {
    const init = async () => {
      const getCategory = async () => {
        // ✅ ApiPath 내에 REQUESTS_CATEGORY가 없을 시 백업 경로를 지정해 2339 오류 예방
        const path = (ApiPath as any).REQUESTS_CATEGORY || '/requests/category';
        const res = await got(path);
        if (res.status === 1) {
          const sortedList = (res.data as Category[]).slice().sort((a, b) => a.sort - b.sort);
          setCategoryList(sortedList);
        }
      };

      const getSystemOption = async () => {
        const res = await got(ApiPath.SYSTEM_OPTION);
        if (res.status === 1) {
          setSystemOption(res.data);
        }
      };

      const getBanWords = async () => {
        const res = await got(ApiPath.BAN_WORDS);
        if (res.status === 1) {
          setBanWords(res.data);
        }
      };

      try {
        await Promise.all([getCategory(), getSystemOption(), getBanWords()]);
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };

    if (isLoggedIn && userInfo) {
      socketConnect();
      init();
    }

    return () => {
      socketDisconnect();
    };
  }, [isLoggedIn, userInfo]);

  // 4. isLoggedIn 상태를 주입한 라우터를 대입하여 렌더링
  const router = getRouter(isLoggedIn);

  return <RouterProvider router={router} />;
}