import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import type { UserItem } from '../../types/user.type';
import type { RoomItem } from '../../types/chat.type';
import type { BanWords } from '../../types/system.type';
import { ApiPath } from '../../types/enum/apiEnum';
import { SignupType } from '../../types/enum/userEnum';
import { getAccessToken, got, maskBadWords } from '../../utils/helper';
import { useUserStore } from '../../stores/userStore';
import { useRequestsStore } from '../../stores/requests.store';
import './MessageList.scss';
import '../../styles/form.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

interface MessageListProps {
  type?: number; // 0: 일반 1: 관리자/고객센터
}

export default function MessageList({ type = 0 }: MessageListProps) {
  const navigate = useNavigate();

  // Zustand 전역 상태 연동 (Svelte의 store.subscribe 완벽 대체)
  const userInfo = useUserStore((state) => state.userInfo) as UserItem | null;
  const banWord = useRequestsStore((state) => state.banWords) as unknown as BanWords[];

  // 로컬 상태 관리
  const [userMessages, setUserMessages] = useState<RoomItem[]>([]);

  // 1. 방 목록 조회 API 호출
  useEffect(() => {
    const handlerGetRoomList = async () => {
      try {
        const response = await got(
          ApiPath.CHAT_LIST,
          'POST',
          {},
          await getAccessToken(ApiPath.CHAT_LIST)
        );
        if (response.status === 1) {
          console.log('ss', response.data.items);
          setUserMessages(response.data.items || []);
        }
      } catch (error) {
        console.error('채팅 목록을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    handlerGetRoomList();
  }, []);

  // 2. 상세 페이지 이동 핸들러
  const moveToDetail = (id: number) => {
    if (type === 0) {
      navigate(`/message/partner/detail/${id}`);
    } else {
      navigate(`/message/admin/detail/${id}`);
    }
  };

  // 파트너 여부 안전 판별
  const targetKey = 'USER' as keyof typeof SignupType;
  const isUser = userInfo && (String(userInfo.type) === 'USER' || userInfo.type === SignupType[targetKey]);

  return (
    <section className="content">
      <h2 className="title">
        {type === 0 ? (
          isUser ? (
            <>미정</>
          ) : (
            <>상담목록 (유저)</>
          )
        ) : (
          <>상담목록 (관리자)</>
        )}
      </h2>
      <p className="text-center">
        언제든 편하게 메시지를 남겨 주세요.
      </p>

      <div className="list">
        <ul className="community">
          {type === 0 && (
            isUser ? (
              /* ==================== 1. 파트너 로그인 상태 화면 ==================== */
              userMessages.length > 0 ? (
                userMessages.map((item) => (
                  <li className="community__list" key={item.id}>
                    <button
                      type="button"
                      className="community__item"
                      onClick={() => moveToDetail(item.id)}
                    >
                      <div className="thumbnail">
                        <img
                          src={item.profileImage || '/assets/images/icon/logo-icon.svg'}
                          alt={item.name}
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = '/assets/images/icon/logo-icon.svg';
                          }}
                        />
                      </div>
                      <div className="community__txt">
                        <div className="community__txt__top">
                          <h4>
                            {item.name}
                          </h4>
                          <span>{item.lastMessageAt}</span>
                        </div>
                        <div className="community__txt__bottom">
                          <div className="community__txt__bottom__list">

                          </div>
                          <span className="community__txt__bottom__message partner">
                            {maskBadWords(item.lastMessage ?? '', banWord || [])}
                          </span>
                          {(item.unreadCount ?? 0) > 0 ? (
                            <p className="community__txt__bottom__list__p">
                              <span className="unread">{item.unreadCount}</span>
                            </p>
                          ) : (
                            <>읽음</>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="no-data">
                  <h3>메세지가 없습니다.</h3>
                  
                  <button
                    className="no-data__button"
                    type="button"
                    onClick={() => navigate('/request')}
                  >
                    <i className="fa-solid fa-file-pen" /> 메세지 보내기
                  </button>
                </li>
              )
            ) : (
              /* ==================== 2. (일반 유저) 로그인 상태 화면 ==================== */
              userMessages.length > 0 ? (
                userMessages.map((item) => (
                  <li className="community__list" key={item.id}>
                    <button
                      type="button"
                      className="community__item"
                      onClick={() => moveToDetail(Number(item.roomId))}
                    >
                      <div className="thumbnail">
                        {item.gender === 'MALE' ? (
                          <img src="/assets/images/category/male.png" alt="남성" />
                        ) : (
                          <img src="/assets/images/category/female.png" alt="여성" />
                        )}
                      </div>
                      <div className="community__txt">
                        <div className="community__txt__top">
                          <h4>{item.name}</h4>
                          <span>{item.lastMessageAt}</span>
                        </div>
                        <div className="community__txt__bottom">
                          <p className="community__txt__bottom__message">
                            {maskBadWords(item.lastMessage ?? '', banWord || [])}
                          </p>
                          {(item.unreadCount ?? 0) > 0 ? (
                            <p className="community__txt__bottom__list__p">
                              <span className="unread">{item.unreadCount}</span>
                            </p>
                          ) : (
                            <>읽음</>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="no-data">
                  <h3>메세지가 없습니다.</h3>
                </li>
              )
            )
          )}
        </ul>
      </div>
    </section>
  );
}