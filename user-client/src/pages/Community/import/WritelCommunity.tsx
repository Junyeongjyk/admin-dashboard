import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Editor from "src/utils/Editor"; 
import { got, getAccessToken } from "src/utils/helper";
import { popup } from "src/utils/popup";
import { ApiPath } from "src/types/enum/apiEnum";
import { CommunityCategoryLabel, CommunityPostType } from "src/types/enum/communityEnum";
import type { UserItem } from "src/types/user.type"
import "./WritelCommunity.scss";

interface WritelCommunityProps {
  changeListView: () => void;
  listReset: () => void;
  userInfo: UserItem | null;
}

export default function WritelCommunity({ changeListView, listReset, userInfo }: WritelCommunityProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const postTypes = Object.values(CommunityPostType);

  // 1. 상태값 정의
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<CommunityPostType>(postTypes[0]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editPostId, setEditPostId] = useState<number | null>(null);

  // 2. DOM Refs 바인딩
  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChangeContents = (data: string) => {
    setContent(data);
  };

  const handleGetEditor = (ckEditor: any) => {
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
      navigate("/community");
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
      // 빌드 오류 및 런타임 어댑터 누락 방지를 위해 dynamic import 유지
      const { UploadAdapter } = await import("../../utils/EditorUploadAdapter");
      const uploadAdapter = new UploadAdapter(loader as any);
      const result = await uploadAdapter.upload();

      const editorInstance = editorRef.current;
      editorInstance.model.change((writer: any) => {
        const imageElement = writer.createElement("imageBlock", {
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
          {/* ✅ 기존 스벨트 컴포넌트인 Editor를 대체하여 넘길 콜백 구조를 리액트화 */}
          <Editor
            handleChangeContents={handleChangeContents}
            handleGetEditor={handleGetEditor}
            contents={content}
          />
        </div>

        <div className="btn-box">
          <button className="submit" type="submit">
            {isEditMode ? "수정 완료" : "작성 완료"}
          </button>
        </div>
      </form>
    </div>
  );
}