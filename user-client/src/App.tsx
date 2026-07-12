import React, { useState, useEffect, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { getRouter } from './router'; // 만들어둔 라우터 가져오기

// 유틸 및 상태/타입 임포트
import { getCookie, got } from './utils/helpers';
import { ApiPath } from './types/enum/apiEnum';
import { Category } from './types/category';
import { connectRealtimeSub } from './utils/lib/mqtt/Mqtt-sub';
import { EventType, Envelope } from './utils/lib/mqtt/Envelope';
import { userInfomation, hasCookie } from './stores/userStore'; 
import { categoryList, systemOptionStore, banWordsStore, chatMessageStore } from './stores/requests.store';

// SCSS 스타일
import './styles/popup.scss';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const userSocketRef = useRef<any>(null);

  // 1. 초기 쿠키 확인 (로그인 인증)
  useEffect(() => {
    const myInfoCookie = getCookie('myInfo');
    if (myInfoCookie) {
      const parsedInfo = JSON.parse(myInfoCookie);
      setIsLoggedIn(true);
      setUserInfo(parsedInfo);
      userInfomation.set(parsedInfo);
      hasCookie.set(true);
    } else {
      setIsLoggedIn(false);
      hasCookie.set(false);
    }
  }, []);

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
    if (userSocketRef.current) userSocketRef.current.end(true);
    userSocketRef.current = null;
  };

  const socketConnect = () => {
    if (!isLoggedIn || !userInfo) return;
    socketDisconnect();

    userSocketRef.current = connectRealtimeSub({
      wsUrl: process.env.VITE_MQTT_WS_URL!,
      topic: process.env.VITE_MQTT_TOPIC!,
      userId: userInfo.userId!,
      username: userInfo.username!,
      password: userInfo.password!,
      onStatus: () => {},
      onEnvelope: (event: Envelope) => {
        if (event.event_type === EventType.CHAT_MESSAGE_CREATE) {
          chatMessageStore.set(event.payload);
        }
      },
    });
  };

  // 3. API 호출 및 소켓 연결 라이프사이클 처리
  useEffect(() => {
    const init = async () => {
      const getCategory = async () => {
        const res = await got(ApiPath.REQUESTS_CATEGORY);
        if (res.status === 1) categoryList.set(res.data.slice().sort((a: any, b: any) => a.sort - b.sort));
      };
      const getSystemOption = async () => {
        const res = await got(ApiPath.SYSTEM_OPTION);
        if (res.status === 1) systemOptionStore.set(res.data);
      };
      const getBanWords = async () => {
        const res = await got(ApiPath.BAN_WORDS);
        if (res.status === 1) banWordsStore.set(res.data);
      };

      await Promise.all([getCategory(), getSystemOption(), getBanWords()]);
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