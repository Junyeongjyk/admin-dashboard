# Admin Dashboard

관리자와 사용자를 분리한 데이터 관리 시스템입니다.  
실제 서비스 환경을 고려하여 Admin / User / API 서버를 분리한 구조로 설계했습니다.

---

## 🔗 프로젝트 개요

- 관리자(Admin)와 사용자(User) 시스템을 분리한 구조
- 각 클라이언트는 독립적인 API 서버와 통신
- JWT 기반 인증 구조 적용
- 대용량 데이터 처리를 고려한 검색 / 필터 / 페이지네이션 구현

---

## 🛠 기술 스택

### Frontend
- React
- TypeScript

### Backend
- NestJS

### Database
- MySQL

---

## 🧩 아키텍처

admin-dashboard는 다음과 같은 구조로 구성되어 있습니다:

- admin-client: 관리자 UI
- admin-server: 관리자 API 서버
- user-client: 사용자 UI
- user-server: 사용자 API 서버

👉 각 클라이언트는 REST API를 통해 서버와 통신합니다.

(여기에 아키텍처 이미지 넣으면 최고)

---

## 🚀 주요 기능

### 관리자(Admin)
- 관리자 로그인 인증
- 사용자 CRUD
- 검색 / 필터 / 페이지네이션

### 사용자(User)
- 사용자 데이터 조회
- (추가 기능 있으면 작성)

---

## 💡 내가 한 역할

- 전체 시스템 구조 설계 (Client / Server 분리)
- REST API 연동 및 데이터 흐름 설계
- 관리자 CRUD 기능 구현
- MySQL DB 테이블 설계
- 검색 / 필터 / 페이지네이션 구현

👉 특히 대용량 데이터 처리를 고려하여  
쿼리 최적화와 API 응답 구조를 설계했습니다.

---

## ⚙️ 실행 방법

```bash
# frontend
npm install
npm run dev

# backend
npm install
npm run start