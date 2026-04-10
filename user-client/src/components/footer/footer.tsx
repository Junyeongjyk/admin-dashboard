// Footer.tsx
import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { menus, getMenusByUserType } from "src/constants/layout";
import { SignupType } from "src/types/enum/userEnum";
import { popup } from "src/utils/popup";
import "./Footer.scss";

interface Props {
  userInfo?: any;
  pageType?: string;
  mainType?: string;
}

export default function Footer({ userInfo, pageType = "", mainType = "" }: Props) {
  const navigate = useNavigate();

  const siteTitle = document.title;

  // ✅ Svelte $: → React useMemo
  const userType = userInfo?.type as SignupType | undefined;

  const Menus = useMemo(() => {
    return userType ? getMenusByUserType(userType, menus) : menus;
  }, [userType]);

  const handleClick = (e: React.MouseEvent, item: any) => {
    if (item.url === "/") return;

    if (!userInfo) {
      e.preventDefault();
      popup("로그인을 해주세요.");
    }
  };

  return (
    <footer
      className={`footer 
        ${pageType === "page" ? "page" : ""} 
        ${mainType === "main" && userInfo?.type === SignupType.PARTNER ? "partner" : ""}
      `}
    >
      <div className="wrap">
        {/* LEFT */}
        <div className="footer__left">
          <div className="footer__ul">
            {Menus.map((item) => (
              <li key={item.url} className="footer__menu">
                <Link
                  to={item.url}
                  onClick={(e) => handleClick(e, item)}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </div>
        </div>

        {/* CENTER */}
        <div className="footer__center">
          <p className="title">주요업무</p>
        </div>

        {/* RIGHT */}
        <div className="footer__right">
          <p className="title">{import.meta.env.VITE_SITENAME}</p>
          <span>대표자(만든이): 김준영</span>
          <span>사업자등록번호: 1234-1234-12</span>
          <span>전화: 010-2898-0860</span>
          <span>이메일: kym0106471@naver.com</span>
          <span>주소: 서울특별시 관악구 쑥고개로 10, 쑥고개빌딩 3층</span>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer__bottom">
        <p>
          <span>2026 {siteTitle}.</span> All rights reserved.
        </p>

        <p className="dark">가사 분쟁 상담 및 자문 서비스</p>

        <p
          className="border-bottom"
          onClick={() => navigate("/terms?open=2")}
          style={{ cursor: "pointer" }}
        >
          개인정보 처리방침
        </p>
      </div>
    </footer>
  );
}