import { useState } from 'react';

export type Comment = {
  id: number;
  content: string;
  writer: string;
  created_at: string;
  replies: Comment[];
};

export type Post = {
  id: number;
  title: string;
  content: string;
  writer: string;
  created_at: string;
  views: number;
  likes: number;
  comments: Comment[];
};

// 리액트에서 사용할 수 있는 커스텀 훅입니다.
export function useCommunityStore() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: '상담하기에 대하여 말씀드립니다',
      content: '<p>상담 내용입니다</p>',
      writer: '운영자',
      created_at: '2025-01-01',
      views: 12,
      likes: 3,
      comments: []
    }
  ]);

  const addPost = (post: Omit<Post, 'id' | 'views' | 'likes' | 'comments'>) => {
    setPosts(prevPosts => [
      {
        ...post,
        id: Date.now(),
        views: 0,
        likes: 0,
        comments: []
      },
      ...prevPosts
    ]);
  };

  const updatePost = (id: number, data: Partial<Post>) => {
    setPosts(prevPosts =>
      prevPosts.map(p => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const deletePost = (id: number) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== id));
  };

  const addComment = (postId: number, comment: Comment) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId
          ? { ...p, comments: [...p.comments, comment] }
          : p
      )
    );
  };

  return {
    posts, // 스벨트의 $communityStore 역할
    addPost,
    updatePost,
    deletePost,
    addComment
  };
}