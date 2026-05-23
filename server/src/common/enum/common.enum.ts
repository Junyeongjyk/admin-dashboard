
export enum FilePath {
    PROFILE = '/partner/profile/', // 파트너 프로필 이미지 패스
}

export const MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};