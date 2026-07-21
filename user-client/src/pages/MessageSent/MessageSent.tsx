import React, { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, KeyboardEvent, DragEvent } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import type { MessageItem } from '../../types/chat.type';
import type { UserItem } from '../../types/user.type';
import type { BanWords } from '../../types/system.type';
import { ApiPath } from '../../types/enum/apiEnum';
import { SignupType } from '../../types/enum/userEnum';
import { getAccessToken, got, maskBadWords } from '../../utils/helper';
import { useUserStore } from '../../stores/userStore';
import { useRequestsStore } from '../../stores/requests.store';
import './MessageSent.scss';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

interface MessageSentProps {
  id?: number | null;
  type?: number; // 0: 일반 1: 관리자/고객센터
}

export default function MessageSent({ id: propId, type = 0 }: MessageSentProps) {
  // 라우터 파라미터가 있을 경우를 고려하여 id 바인딩
  const { id: paramId } = useParams<{ id: string }>();
  const activeId = propId !== undefined ? propId : (paramId ? Number(paramId) : null);

  // Zustand 전역 상태 및 액션 바인딩
  const userInfo = useUserStore((state) => state.userInfo) as UserItem;
  const chatMessage = useRequestsStore((state) => state.chatMessage);
  const banWord = useRequestsStore((state) => state.banWords) as unknown as BanWords[];

  // 컴포넌트 로컬 상태 정의
  const [roomId, setRoomId] = useState<number | null | undefined>(null);
  const [chatName, setChatName] = useState<string>('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // DOM Refs 정의
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatFileRef = useRef<File | null>(null);

  // 날짜/시간 포맷 함수들
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY년 MM월 DD일 ddd');
  };

  const formatTime = (dateString: string) => {
    return dayjs(dateString).format('A hh:mm:ss');
  };

  // 스크롤을 항상 하단으로 내리는 함수
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    });
  };

  // 입력창 자동 리사이징
  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // 7. 데이터 전송 (메시지 보내기)
  const sendMessage = async (overrideFile?: File | null) => {
    const fileToSend = overrideFile !== undefined ? overrideFile : chatFileRef.current;
    if (!newMessage.trim() && !fileToSend) return;

    const params: Record<string, unknown> = {
      roomId: roomId,
      content: newMessage,
      type: type,
      chatFile: fileToSend,
    };

    if (!roomId && type === 0) {
      params['fromId'] = activeId;
    }

    try {
      const response = await got(
        ApiPath.CHAT_MESSAGE_SEND,
        'POST',
        params,
        await getAccessToken(ApiPath.CHAT_MESSAGE_SEND),
        true
      );

      if (response.status === 1) {
        setRoomId(response.data.roomId);
        setMessages((prev) => [
          ...prev,
          {
            id: Number(response.data.id),
            senderId: Number(response.data.senderId),
            content: response.data.content as string,
            createdAt: response.data.createdAt as string,
            originalName: response.data.originalName as string,
            mimeType: response.data.mimeType as string,
            size: response.data.size as number,
            // MessageItem의 boolean 타입 명세에 맞추기 위해 !! 사용
            chatContentType: !!response.data.chatContentType,
          },
        ]);
        setNewMessage('');
        chatFileRef.current = null;
        
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        scrollToBottom();
      }
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
    }
  };

  // 9. 라이프사이클 마운트 및 API 로드
  useEffect(() => {
    const handleGetMessage = async () => {
      if (!userInfo) return;
      try {
        const params = { chatRoomId: activeId };
        const response = await got(
          ApiPath.CHAT_MESSAGE_LIST,
          'POST',
          params,
          await getAccessToken(ApiPath.CHAT_MESSAGE_LIST)
        );

        if (response.status === 1) {
          let name = '';
          if (type === 1) {
            name = '고객센터';
          } else {
            // any 없이 SignupType 구조 안전하게 우회 비교
            const targetKey = 'CLIENT' as keyof typeof SignupType;
            const isClient = String(userInfo.type) === 'CLIENT' || userInfo.type === SignupType[targetKey];
            name = isClient ? '파트너' : '유저 ';
            name += ` ${response.data.name}`;
          }
          setChatName(name);
          setMessages(response.data.items);
          setRoomId(response.data.roomId);
          scrollToBottom();
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleGetAdminMessage = async () => {
      try {
        const response = await got(
          ApiPath.CHAT_ADMIN_MESSAGE_LIST,
          'POST',
          {},
          await getAccessToken(ApiPath.CHAT_ADMIN_MESSAGE_LIST)
        );
        if (response.status === 1) {
          setChatName('고객센터');
          setMessages(response.data.items);
          setRoomId(response.data.roomId);
          scrollToBottom();
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (type === 0) {
      handleGetMessage();
    } else {
      handleGetAdminMessage();
    }
  }, [activeId, type, userInfo]);

  // 실시간 MQTT 채팅 알람 구독 동기화
  useEffect(() => {
    if (chatMessage && chatMessage.roomId === roomId) {
      const receiveMessage = async () => {
        setMessages((prev) => [
          ...prev,
          {
            id: Number(chatMessage.id),
            senderId: Number(chatMessage.senderId),
            content: chatMessage.content as string,
            createdAt: chatMessage.createdAt as string,
            originalName: chatMessage.originalName as string,
            mimeType: chatMessage.mimeType as string,
            size: chatMessage.size as number,
            // MessageItem의 boolean 타입 명세에 맞추기 위해 !! 사용
            chatContentType: !!chatMessage.chatContentType,
          },
        ]);

        try {
          await got(
            ApiPath.CHAT_MESSAGE_READ,
            'POST',
            { messageId: Number(chatMessage.id) },
            await getAccessToken(ApiPath.CHAT_MESSAGE_READ)
          );
        } catch (error) {
          console.error('메시지 읽음 처리 오류:', error);
        }
        scrollToBottom();
      };

      receiveMessage();
    }
  }, [chatMessage, roomId]);

  // 키보드 & 이벤트 핸들러
  const handleKeydown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      chatFileRef.current = e.target.files[0];
      sendMessage(e.target.files[0]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      chatFileRef.current = e.dataTransfer.files[0];
      sendMessage(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  // 공통 대화 렌더러
  const renderChatBox = () => (
    <div
      className={`chat-box ${isDragging ? 'dragging' : ''}`}
      ref={chatBoxRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {messages.map((msg, index) => {
        const showDateDivider =
          index === 0 ||
          formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt);

        return (
          <React.Fragment key={msg.id}>
            {showDateDivider && (
              <div className="date-divider">{formatDate(msg.createdAt)}</div>
            )}

            <div className={`chat-message ${Number(msg.senderId) === userInfo?.id ? 'me' : 'other'}`}>
              <div className="message-wrapper">
                <div className="bubble">
                  {msg.chatContentType ? (
                    <div className="file">
                      {msg.mimeType?.startsWith('image/') ? (
                        <img
                          src={`${process.env.URL || ''}${ApiPath.CHAT_IMAGE_VIEW}/${msg.id}`}
                          alt={msg.originalName}
                        />
                      ) : (
                        <>
                          <i className="fa-solid fa-paperclip" />
                          <a
                            href={`${process.env.URL || ''}${ApiPath.CHAT_DOWNLOAD}/${msg.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {msg.originalName}
                          </a>
                        </>
                      )}
                    </div>
                  ) : (
                    maskBadWords(msg.content, banWord || [])
                  )}
                </div>
                <span className="time">{formatTime(msg.createdAt)}</span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderInputArea = () => (
    <div className="chat-input">
      <label className="file-btn">
        <i className="fa-solid fa-plus" />
        <input type="file" hidden onChange={handleProfileChange} />
      </label>
      <textarea
        ref={textareaRef}
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onInput={autoResize}
        onKeyDown={handleKeydown}
        placeholder="메시지를 입력하세요"
        rows={1}
      />
      <button onClick={() => sendMessage(null)}>
        <i className="fa-solid fa-paper-plane" />
      </button>
    </div>
  );

  return (
    <div className={`chat-container ${type === 1 ? 'widget' : ''}`}>
      <div className="chat-header">
        <h2>{chatName}</h2>
      </div>
      {renderChatBox()}
      {renderInputArea()}
    </div>
  );
}