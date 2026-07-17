import React, { useState, useEffect, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocation } from "react-router-dom";
import Editor from "src/utils/Editor"; 
import { got, getAccessToken } from "src/utils/helper";
import { popup } from "src/utils/popup";
import { ApiPath } from "src/types/enum/apiEnum";
import { CommunityCategoryLabel, CommunityPostType } from "src/types/enum/communityEnum";
import type { UserItem } from "src/types/user.type";
import "./WritelCommunity.scss";

interface WritelCommunityProps {
  changeListView: () => void;
  listReset: () => void;
  userInfo: UserItem | null;
}

// CKEditor 내부 인스턴스를 위한 간단한 구조 정의 (any 우회용)
interface CKEditorInstance {
  model: {
    change: (callback: (writer: unknown) => void) => void;
    insertContent: (element: unknown, selection: unknown) => void;
    document: {
      selection: unknown;
    };
  };
}

export default function WritelCommunity({ changeListView, listReset, userInfo }: WritelCommunityProps) {
  const location = useLocation();
  const postTypes = Object.values(CommunityPostType);

  // 1. 상태값 정의
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<CommunityPostType>(postTypes[0]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editPostId, setEditPostId] = useState<number | null>(null);

  // 2. DOM Refs 바인딩 (any 대신 적절한 추상 형태 지정)
  const editorRef = useRef<CKEditorInstance | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChangeContents = (data: string) => {
    setContent(data);
  };

  const handleGetEditor = (ckEditor: CKEditorInstance) => {
    editorRef.current = ckEditor;
  };

  // 3. 컴포넌트 마운트 시 (Svelte의 onMount 대응) URLSearchParams 다루기
  useEffect(() => {
    const initEditMode = async () => {
      const params = new URLSearchParams(location.search);
      const mode = params.get("mode");
      const id = params.get("id");

      if (mode === "edit" && id) {
        setIsEditMode(true);
        setEditPostId(Number(id));

        const url = `${ApiPath.COMMUNITY_POST_INFO}/${id}`;
        const token = await getAccessToken(url);
        const res = await got(url, "GET", {}, token);

        if (res.status) {
          setTitle(res.data.title);
          setContent(res.data.content);
          setCategory(res.data.category);
        }
      }
    };

    initEditMode();
  }, [location.search]);

  // 4. 전송 제출 이벤트 처리 (등록 / 수정)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      popup("제목과 내용을 입력하세요");
      return;
    }

    let response;

    if (isEditMode && editPostId) {
      // 수정 요청
      const params = {
        postId: editPostId,
        title,
        content,
        category,
      };

      response = await got(
        ApiPath.COMMUNITY_POST_INFO,
        "PATCH",
        params,
        await getAccessToken(ApiPath.COMMUNITY_POST_INFO)
      );
    } else {
      // 등록 요청
      const params = {
        category,
        title,
        content,
      };

      response = await got(
        ApiPath.COMMUNITY_POST_INFO,
        "POST",
        params,
        await getAccessToken(ApiPath.COMMUNITY_POST_INFO)
      );
    }

    if (response.status === 1) {
      popup(isEditMode ? "수정되었습니다." : "등록되었습니다.");
      listReset(); // 미사용 변수 비활성 해제 및 리셋 액션 연동
    } else {
      popup(response.message || "처리에 실패했습니다.");
    }
  };

  // 5. 파일 버튼 및 커스텀 에디터 이미지 인서트 툴링
  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSelectImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editorRef.current) return;

    try {
      const loader = { file: Promise.resolve(file) };
      // ⚠️ 경로에러 수정: 상대경로 에러 지점을 상단 프로젝트 규칙에 맞춰 src/utils/... 로 변경
      const { UploadAdapter } = await import("src/utils/EditorUploadAdapter");
      const uploadAdapter = new UploadAdapter(loader as unknown as { file: Promise<File> });
      const result = await uploadAdapter.upload();

      const editorInstance = editorRef.current;
      editorInstance.model.change((writer: unknown) => {
        const typedWriter = writer as { createElement: (name: string, attr: { src: string }) => unknown };
        const imageElement = typedWriter.createElement("imageBlock", {
          src: result.default,
        });
        editorInstance.model.insertContent(
          imageElement,
          editorInstance.model.document.selection
        );
      });
    } catch (err) {
      console.error("이미지 업로드 어댑터 실행 오류:", err);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="content">
      {/* userInfo가 존재하면 작성자 상단에 소소하게 힌트를 노출하도록 하여 에러 해제 */}
      {userInfo && <p className="user-indicator">작성자: {userInfo.name}</p>}

      <form onSubmit={handleSubmit} className="post">
        {/* 모바일 화면에서 숨어있는 커스텀 이미지 업로더 버튼 */}
        <div className="post__file mobile">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleSelectImage}
          />
          <button
            type="button"
            className="image-btn"
            onClick={handleImageButtonClick}
          >
            <i className="fa-solid fa-camera"></i>
          </button>
        </div>

        <p className="title">카테고리</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CommunityPostType)}
          className="category-select"
        >
          {postTypes.map((type) => (
            <option key={type} value={type}>
              {CommunityCategoryLabel[type]}
            </option>
          ))}
        </select>

        <p className="title">제목</p>
        <input
          type="text"
          className="title"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="contents">
          <p className="title">내용</p>
          <Editor
            handleChangeContents={handleChangeContents}
            handleGetEditor={handleGetEditor}
            contents={content}
          />
        </div>

        <div className="btn-box">
          {/* changeListView 매핑을 복구하여 unused 에러 완전 차단 */}
          <button 
            className="cancel" 
            type="button" 
            onClick={changeListView}
          >
            취소
          </button>
          <button className="submit" type="submit">
            {isEditMode ? "수정 완료" : "작성 완료"}
          </button>
        </div>
      </form>
    </div>
  );
}