import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './pages/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Notice from './pages/Notice/Notice';
import Faq from './pages/Faq/Faq';
import Message from './pages/Message/Message';
import MessageList from './pages/MessageList/MessageList';
import MessageSent from './pages/MessageSent/MessageSent';
import MessageDetail from './pages/MessageDetail/MessageDetail';
import Setting from './pages/Setting/Setting';
import Community from './pages/Community/Community';
import Terms from './pages/Terms/Terms';
import DetailNoticePage from './pages/DetailNotice/DetailNoticePage';
import DetailCommunity from './pages/Community/import/DetailCommunity';
import WritelCommunityPage from './pages/Community/import/WritelCommunityPage';
import { SettingType } from './types/enum/ethEnum';
import { useParams } from 'react-router-dom';

const NoticeWrapper = () => { const { id } = useParams(); return <DetailNoticePage id={id!} />; };
const CommunityWrapper = () => { const { id } = useParams(); return <DetailCommunity id={id!} />; };
const MessageSentWrapper = ({ type }: { type?: number }) => { const { id } = useParams(); return <MessageSent type={type} id={Number(id)} />; };

export const getRouter = (isLoggedIn: boolean) => createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: isLoggedIn 
      ? [
          // 로그인한 유저만 접근 가능한 경로
          { path: "", element: <Dashboard /> },
          { path: "notice", element: <Notice /> },
          { path: "notice/:id", element: <NoticeWrapper /> },
          { path: "faq", element: <Faq /> },
          { path: "message", element: <Message /> },
          { path: "message/partner", element: <MessageList /> },
          { path: "message/admin", element: <MessageList type={1} /> },
          { path: "message/partner/detail/:id", element: <MessageSentWrapper /> },
          { path: "message/admin/detail/:id", element: <MessageSentWrapper type={1} /> },
          { path: "message/partner/detail", element: <MessageDetail /> },
          { path: "setting", element: <Setting type={SettingType.SETTING} /> },
          { path: "setting/password", element: <Setting type={SettingType.PASSWORD} />} ,
          { path: "setting/profile", element: <Setting type={SettingType.PROFILE} /> },
          { path: "setting/partner/profile", element: <Setting type={SettingType.DETECTIVE_PROFILE} /> },
          { path: "community", element: <Community /> },
          { path: "community/:id", element: <CommunityWrapper /> },
          { path: "community/write", element: <WritelCommunityPage /> },
          { path: "terms", element: <Terms /> },
          { path: "*", element: <Navigate to="/" replace /> }
        ]
      : [
          // 비로그인 유저 경로
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
          { path: "*", element: <Navigate to="/login" replace /> }
        ]
  }
]);