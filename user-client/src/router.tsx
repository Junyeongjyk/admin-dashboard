import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./pages/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Notice from "./pages/Notice/Notice";
import Faq from "./pages/Faq/Faq";
import Message from "./pages/Message/Message";
import MessageList from "./pages/MessageList/MessageList";
import Setting from "./pages/Setting/Setting";
import Community from "./pages/Community/Community";
import Terms from "./pages/Terms/Terms";

import axios from "axios";

export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // ✅ cookie 대신 localStorage로 간단하게
  useEffect(() => {
    const data = localStorage.getItem("myInfo");
    if (data) {
      setIsLoggedIn(true);
      setUserInfo(JSON.parse(data));
    }
  }, []);

  // ✅ init (Svelte onMount)
  useEffect(() => {
    if (!isLoggedIn) return;

    const init = async () => {
      await Promise.all([
        axios.get("/category"),
        axios.get("/location"),
      ]);
    };

    init();
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Dashboard />} />

              <Route path="/notice" element={<Notice />} />
              <Route path="/notice/:id" element={<div>DetailNotice</div>} />

              <Route path="/faq" element={<Faq />} />

              <Route path="/message" element={<Message />} />
              <Route path="/message/admin" element={<MessageList />} />

              <Route path="/setting" element={<Setting />} />

              <Route path="/community" element={<Community />} />
              <Route path="/terms" element={<Terms />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}

          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}