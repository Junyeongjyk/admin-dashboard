import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { mobileMenus, getMenusByUserType } from "constants/layout";
import { userStore } from "src/stores/userStore"; // Svelte store를 React에서 사용 가능한 형태로 가정
import { SignupType } from "src/types/enum/userEnum";
import { UserItem } from "src/types/user.type";
import "./Mobile.scss";

const Mobile: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [userInfo, setUserInfo] = useState<UserItem | null>(null);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    // 유저 정보 구독 (Store 구독 로직)
    useEffect(() => {
        const unsubscribe = userStore.subscribe((value) => {
            setUserInfo(value);
        });
        return () => unsubscribe();
    }, []);

    // 경로 변경 감지
    useEffect(() => {
        setCurrentPath(location.pathname);
    }, [location]);

    // 유저 타입에 따른 메뉴 필터링 (Svelte의 $: 변수와 동일)
    const menus = useMemo(() => {
        const userType = userInfo ? (userInfo.type as SignupType) : undefined;
        return userType
            ? getMenusByUserType(userType, mobileMenus)
            : mobileMenus;
    }, [userInfo]);

    const handleClick = (e: React.MouseEvent, item: any) => {
        if (item.url === "/") return;

        if (!userInfo) {
            e.preventDefault(); // Link 태그 동작 방지
            navigate("/login");
        }
    };

    return (
        <div className="mobile">
            <ul className="mobile__menu">
                {menus.map((item, index) => (
                    <li key={index} className="header__menu">
                        <Link
                            to={item.url}
                            className={currentPath === item.url ? 'active' : ''}
                            onClick={(e) => handleClick(e, item)}
                        >
                            <i className={item.icon}></i>
                            {item.title}
                            {/* 알림 배지가 필요한 경우 여기에 추가 로직 작성 */}
                            {/* <span className="message-alert">1</span> */}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Mobile;