import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Svelte transition 대용
import { useUserStore } from "src/stores/userStore"; // 앞서 만든 Zustand 스토어
import { useSignupStore } from "src/stores/signupStore"; 
import { menus, getMenusByUserType } from "constants/layout";
import { popup } from "utils/popup";
import { deleteCookie, getAccessToken, getCookie, got } from "src/utils/helpers";
import { ApiPath } from "src/types/enum/apiEnum";
import { SignupType } from "src/types/enum/userEnum";
import { AlamStatus } from "src/types/enum/requestsEnum";
import "./Header.scss";

interface HeaderProps {
    type?: number;
    isDark?: boolean;
    fixedType?: string;
    mainType?: string;
}

const Header: React.FC<HeaderProps> = ({ 
    type = 0, 
    isDark = false, 
    fixedType = "", 
    mainType = "" 
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Zustand 스토어 구독 (Svelte의 $구독 대용)
    const { userInfo, setUserInfo } = useUserStore();
    const isLoggedIn = !!userInfo; 
    const isSignupFlow = useSignupStore((state) => state.isSignupFlow);

    // 상태 관리
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAlarmOpen, setIsAlarmOpen] = useState(false);
    const [alarmItems, setAlarmItems] = useState<any[]>([]);
    const [alamCount, setAlamCount] = useState(0);

    // 메뉴 닫기 함수
    const closeAll = useCallback(() => {
        setIsMenuOpen(false);
        setIsAlarmOpen(false);
    }, []);

    // 외부 클릭 시 닫기 (이벤트 리스너)
    useEffect(() => {
        if (isMenuOpen || isAlarmOpen) {
            window.addEventListener('click', closeAll);
        }
        return () => window.removeEventListener('click', closeAll);
    }, [isMenuOpen, isAlarmOpen, closeAll]);

    // 알림 핸들러 (Interval)
    useEffect(() => {
        if (!isLoggedIn) return;

        const alarmTimer = setInterval(async () => {
            const response = await got(ApiPath.ALARM_SELECT, 'POST');
            if (response.status === 1) {
                const items = response.data.items;
                setAlamCount(items.length);
                setAlarmItems(items);
            }
        }, 1000);

        return () => clearInterval(alarmTimer);
    }, [isLoggedIn]);

    // 로그아웃
    const signout = async () => {
        const deviceId = userInfo?.clientId?.replace(/^CLIENT-\d+-/, "");
        const params = { uuid: '', deviceId };
        const response = await got(ApiPath.LOGOUT, 'POST', params);

        if (response.status === 1) {
            deleteCookie('myInfo');
            setUserInfo(null); // Zustand 상태 초기화
            navigate("/");
            window.location.reload();
        } else {
            popup(response.message);
        }
    };

    // 메뉴 필터링 (Svelte의 reactive $: 대응)
    const headerMenus = useMemo(() => {
        return userInfo?.type 
            ? getMenusByUserType(userInfo.type as SignupType, menus) 
            : menus;
    }, [userInfo]);

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAlarmOpen) {
            setIsAlarmOpen(false);
            setIsMenuOpen(true);
        } else {
            setIsMenuOpen(!isMenuOpen);
        }
    };

    const handleAlarmToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMenuOpen) {
            setIsMenuOpen(false);
            setIsAlarmOpen(true);
        } else {
            setIsAlarmOpen(!isAlarmOpen);
        }
    };

    return (
        <>
            {/* 애니메이션 처리를 위해 AnimatePresence 사용 */}
            <AnimatePresence>
                {(isMenuOpen || isAlarmOpen) && (
                    <motion.div 
                        className="cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {isMenuOpen && (
                            <motion.div 
                                className="mobile-menu visible"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ ease: "circOut", duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="mobile-menu__name">
                                    <p>안녕하세요. <b>{userInfo?.name} {userInfo?.type === 'DETECTIVE' && <i className="fa-solid fa-user-secret"></i>}</b> 님</p>
                                    <button className="logout" onClick={signout}>로그아웃</button>
                                </div>
                                <ul className="mobile-menu__ul">
                                    {headerMenus.map((item: any, idx: number) => (
                                        <li key={idx} className="header__menu">
                                            <Link to={item.url}>
                                                <i className={item.icon}></i> {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        {isAlarmOpen && (
                            <motion.div 
                                className="alarm-menu visible"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ ease: "circOut", duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="alarm-menu__ul">
                                    {alarmItems.length > 0 ? alarmItems.map((item) => (
                                        <li key={item.id} className="header__menu">
                                            <div className="info">
                                                <i className="fa-solid fa-circle-info"></i>
                                            </div>
                                            <button onClick={() => {
                                                got(ApiPath.ALARM_OFF, 'POST', { requestId: item.id });
                                                navigate(`/detail/request/${item.id}`);
                                            }}>확인하기</button>
                                        </li>
                                    )) : (
                                        <li className="header__menu">
                                            <div className="info"><p className="text-center width-100">알림이 없습니다.</p></div>
                                        </li>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <header className={`header 
                ${type === 2 ? 'type' : ''} 
                ${isSignupFlow ? 'signup-flow' : ''}
                ${isDark ? 'dark' : 'light'}
                ${fixedType === "fixed" ? 'fixed' : ''}
                ${mainType !== "main" && (isMenuOpen || isAlarmOpen) ? 'fixed-bg' : ''}
                ${mainType === "main" && (isMenuOpen || isAlarmOpen) ? 'header-main-bg' : ''}
                ${userInfo?.type === 'DETECTIVE' ? 'detective' : ''}
            `}>
                <div className="wrap">
                    {type === 2 && (
                        <div className="back">
                            <button onClick={() => window.history.back()}>
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                        </div>
                    )}
                    <div className="header__logo">
                        <img src="/assets/logo.svg" alt="logo" onClick={() => navigate("/")} />
                    </div>
                    <div className="header__right">
                        <div className="header__sign">
                            {isLoggedIn ? (
                                <div className="header__sign__menu">
                                    <div className="bell" onClick={handleAlarmToggle}>
                                        <i className={isAlarmOpen ? "fa-regular fa-bell" : "fa-solid fa-bell"}></i>
                                        {!isAlarmOpen && alamCount > 0 && <span className="blink">{alamCount}</span>}
                                    </div>
                                    <div className="hamburger" onClick={handleMenuToggle}>
                                        <i className={isMenuOpen ? "fa-solid fa-x" : "fa-solid fa-bars"}></i>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <button className="header__sign__signin" onClick={() => navigate("/login")}>로그인</button>
                                    <button className="header__sign__signup" onClick={() => navigate("/signup")}>가입하기</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;