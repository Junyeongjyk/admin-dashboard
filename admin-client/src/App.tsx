import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 컴포넌트 & 페이지 임포트
import Layout from './pages/Layout/Layout';
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

// 유틸 & 스토어 (Zustand나 Context 사용 가정)
import { getCookie } from "./utils/helpers";
import { useAdminStore } from "./stores/adminStore"; 
import { useRequestStore } from "./stores/requests.store";

import "./App.scss";
import "./styles/popup.scss";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setAdminInfo } = useAdminStore();
  const { setCategoryList, setLocationList } = useRequestStore();

  // 초기화 로직 (onMount 대응)
  useEffect(() => {
    const adminInfo = getCookie("adminInfo");
    if (adminInfo) {
      const userInfo = JSON.parse(adminInfo);
      setAdminInfo(userInfo);
      setIsLoggedIn(true);
    }

    // 카테고리, 지역 데이터 로드 및 소켓 연결 로직 호출...
    const init = async () => {
       // getCategory(), getLocation(), socketConnect() 등 호출
    };
    init();

    // 언마운트 시 소켓 해제 (onDestroy 대응)
    return () => {
      // socketDisconnect()
    };
  }, []);

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          /* 로그인 안됐을 때: 모든 경로를 로그인으로 */
          <Route path="*" element={<Login />} />
        ) : (
          /* 로그인 됐을 때: 레이아웃 내부에서 라우팅 */
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/client/management" element={<UserManagement />} />
 
            {/* 정의되지 않은 경로는 대시보드로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
};

export default App;