import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Notice from "./pages/Notice/Notice";
import DetailNoticePage from "./pages/DetailNotice/DetailNoticePage";
import Faq from "./pages/Faq/Faq";
import Message from "./pages/Message/Message";
import MessageList from "./pages/MessageList/MessageList";
import MessageSent from "./pages/MessageSent/MessageSent";
import MessageDetail from "./pages/MessageDetail/MessageDetail";
import Setting from "./pages/Setting/Setting";
import Community from "./pages/Community/Community";
import DetailCommunity from "./pages/Community/import/DetailCommunity";
import WritelCommunityPage from "./pages/Community/import/WritelCommunityPage";
import Terms from "./pages/Terms/Terms";
import { SettingType } from "./types/enum/ethEnum";

export const getRouter = (isLoggedIn: boolean) =>
  createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />,
        },
        // 비인증 상태 라우트
        {
          path: "login",
          element: !isLoggedIn ? <Login /> : <Navigate to="/" replace />,
        },
        {
          path: "signup",
          element: !isLoggedIn ? <Signup /> : <Navigate to="/" replace />,
        },
        // 인증 필수 라우트들
        {
          path: "notice",
          element: isLoggedIn ? <Notice /> : <Navigate to="/login" replace />,
        },
        {
          path: "notice/:id",
          element: isLoggedIn ? <DetailNoticePage /> : <Navigate to="/login" replace />,
        },
        {
          path: "faq",
          element: isLoggedIn ? <Faq /> : <Navigate to="/login" replace />,
        },
        {
          path: "message",
          element: isLoggedIn ? <Message /> : <Navigate to="/login" replace />,
        },
        {
          path: "message/partner",
          element: isLoggedIn ? <MessageList /> : <Navigate to="/login" replace />,
        },
        {
          path: "message/admin",
          element: isLoggedIn ? <MessageList type={1} /> : <Navigate to="/login" replace />,
        },
        {
          path: "message/partner/detail/:id",
          element: isLoggedIn ? <MessageSent /> : <Navigate to="/login" replace />,
        },
        {
          path: "message/admin/detail",
          element: isLoggedIn ? <MessageSent type={1} /> : <Navigate to="/login" replace />,
        },
        {
          path: "message/partner/detail",
          element: isLoggedIn ? <MessageDetail /> : <Navigate to="/login" replace />,
        },
        {
          path: "setting",
          element: isLoggedIn ? <Setting type={SettingType.SETTING} /> : <Navigate to="/login" replace />,
        },
        {
          path: "setting/password",
          element: isLoggedIn ? <Setting type={SettingType.PASSWORD} /> : <Navigate to="/login" replace />,
        },
        {
          path: "setting/profile",
          element: isLoggedIn ? <Setting type={SettingType.PROFILE} /> : <Navigate to="/login" replace />,
        },
        {
          path: "setting/partner/profile",
          element: isLoggedIn ? <Setting type={SettingType.DETECTIVE_PROFILE} /> : <Navigate to="/login" replace />,
        },
        {
          path: "community",
          element: isLoggedIn ? <Community /> : <Navigate to="/login" replace />,
        },
        {
          path: "community/:id",
          element: isLoggedIn ? <DetailCommunity /> : <Navigate to="/login" replace />,
        },
        {
          path: "community/write",
          element: isLoggedIn ? <WritelCommunityPage /> : <Navigate to="/login" replace />,
        },
        {
          path: "terms",
          element: isLoggedIn ? <Terms /> : <Navigate to="/login" replace />,
        },
        // 알 수 없는 경로는 모두 루트로 리다이렉션
        {
          path: "*",
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ]);