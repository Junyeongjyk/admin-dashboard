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
  const [clientMessages, setClientMessages] = useState<RoomItem[]>([]);

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
          setClientMessages(response.data.items || []);
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
      navigate(`/message/detective/detail/${id}`);
    } else {
      navigate(`/message/admin/detail/${id}`);
    }
  };

  // 3. 탐정(Client) 여부 안전 판별
  const targetKey = 'CLIENT' as keyof typeof SignupType;
  const isClient = userInfo && (String(userInfo.type) === 'CLIENT' || userInfo.type === SignupType[targetKey]);

  return (
    <section className="content">
      <h2 className="title">
        {type === 0 ? (
          isClient ? (
            <>든든한 내편, 전담 탐정이 현장에서 뛰고 있습니다.</>
          ) : (
            <>상담목록 (의뢰인)</>
          )
        ) : (
          <>상담목록 (관리자)</>
        )}
      </h2>
      <p className="text-center">
        진행 상황이 궁금하거나 번뜩이는 추가 단서가 떠올랐다면, 언제든 편하게 메시지를 남겨 주세요.
      </p>

      <div className="list">
        <ul className="community">
          {type === 0 && (
            isClient ? (
              /* ==================== 1. 탐정(Client) 로그인 상태 화면 ==================== */
              clientMessages.length > 0 ? (
                clientMessages.map((item) => (
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
                            {item.name} ({item.careerYears}년)
                          </h4>
                          <span>{item.lastMessageAt}</span>
                        </div>
                        <div className="community__txt__bottom">
                          <div className="community__txt__bottom__list">
                            <span>{item.region}</span>
                            <span>{item.introduction}</span>
                            <span>평균별점 : {item.ratingAvg}</span>
                          </div>
                          <span className="community__txt__bottom__message detective">
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
                  <h3>아직 배정된 전담 탐정이 없습니다.</h3>
                  <p>혼자 안고 있는 고민이 있으신가요?</p>
                  <p>의뢰를 남겨주시면, 고객님의 이야기에 귀 기울이고</p>
                  <p>확실한 해답을 찾아줄 전문 탐정을 곧 바로 연결해 드립니다.</p>
                  <button
                    className="no-data__button"
                    type="button"
                    onClick={() => navigate('/request')}
                  >
                    <i className="fa-solid fa-file-pen" /> 의뢰 남기러 가기
                  </button>
                </li>
              )
            ) : (
              /* ==================== 2. 의뢰인(일반 유저) 로그인 상태 화면 ==================== */
              clientMessages.length > 0 ? (
                clientMessages.map((item) => (
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
                  <h3>의뢰인 상담이 없습니다.</h3>
                </li>
              )
            )
          )}
        </ul>
      </div>
    </section>
  );
}