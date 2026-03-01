# 🎭 OPUS
### Opening Perspective, Unveiling Scene

> 작품을 보는 새로운 관점을 열고, 숨겨진 예술의 무대를 드러내다

## 🔗 Live Demo

- 🌍 Service URL: https://opus-ivory.vercel.app/
- 🧪 Test Account
  - ID: test01@test.kr
  - PW: pass01!

---

## 📌 프로젝트 소개

**OPUS**는 전시·공연 정보 탐색부터 후기 작성, 굿즈 구매, 미술품 경매까지 하나의 플랫폼에서 경험할 수 있는 **예술 통합 서비스**입니다.

여러 플랫폼에 분산된 전시 및 공연 정보를 통합하고, 전시·공연의 저변 확대와 대중성 확장을 목표로 기획되었습니다.

---

## 👥 팀원 소개

| 최보윤 | 박상민 | 박유진 | 최현정 |
|:---:|:---:|:---:|:---:|
| On-Stage, 후기 | Unveiling, 메인페이지 | Selections, 챗봇, 알림 | Proposals |
| 마이페이지 (찜, 후기) | 마이페이지 (경매 내역) | 마이페이지 (주문 내역) | 회원관리시스템, 소셜 로그인 |
| 관리자 페이지 (후기 신고, 복구) | 관리자 페이지 (경매) | 관리자 페이지 (상품, 배송 관리) | 마이페이지 (연락처, 비밀번호 변경) |

---

## ⚙️ 기술 스택

<div align="center">

| 분류 | 기술 |
|:---:|:---|
| **🖥 Front-end** | ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) |
| **🛠 Back-end** | ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) ![MyBatis](https://img.shields.io/badge/MyBatis-DC382D?style=for-the-badge&logo=databricks&logoColor=white) ![Oracle](https://img.shields.io/badge/Oracle_DB-F80000?style=for-the-badge&logo=oracle&logoColor=white) ![Tomcat](https://img.shields.io/badge/Apache_Tomcat-F8DC75?style=for-the-badge&logo=apachetomcat&logoColor=black) |
| **🚀 Deployment** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white) |
| **☁️ External API** | ![KOPIS](https://img.shields.io/badge/KOPIS_Open_API-0066CC?style=for-the-badge&logo=data:image/svg+xml;base64,&logoColor=white) ![Toss](https://img.shields.io/badge/Toss_Payments-0064FF?style=for-the-badge&logo=tosspayments&logoColor=white) ![OpenAI](https://img.shields.io/badge/OpenAI_GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white) |

</div>

---

## 🗂️ 주요 기능

### 🎬 On-Stage — 전시·공연 정보
- 외부 API(KOPIS)를 활용한 전시·공연 목록 제공
- 장르, 지역, 상태(진행중/예정/종료) 필터 검색
- AI 기반 맞춤 공연 추천 (ChatGPT API 연동)
- Like / Dislike / Save로 취향 데이터 저장
- 관람 후기 작성, 댓글, 좋아요 기능

### 📋 Proposals — 게시판
- 공지사항(관리자) / 홍보(기업 회원) 게시글
- 썸머노트 에디터 활용, 이미지 첨부 기능
- 말머리(장르/카테고리) 필터 검색

### 🎨 Unveiling — 미술품 경매
- 온라인 경매 (한정 참여) 기능 제공
- 작품명·작가명 검색, 경매 상태 필터(전체/진행중/예정/종료)
- 실시간 현재 호가 표시 및 카운트다운 타이머
- **동시 입찰 정합성 처리** — `FOR UPDATE`를 통한 비관적 락 적용
- 토스 페이먼츠(Toss Payments) 결제 API 연동
- 경매 낙찰 후 관리자 배송 처리

### 🛍️ Selections — 기념품 굿즈
- 공연·전시 관련 굿즈 목록 제공 (기업 회원 등록)
- 장바구니, 옵션 선택, 수량 조절
- 토스 페이먼츠 결제 API 연동
- 배송 조회, 교환/반품 정보 확인

### 👤 마이페이지
- 찜한 작품 리스트
- 작성 후기 관리
- 주문 내역 / 경매 응찰 내역
- 연락처·비밀번호 변경, 회원 탈퇴

### 🔧 관리자 페이지
- 후기 신고 처리 및 복구 관리
- 경매 등록·관리
- 상품(굿즈) 등록·수정·삭제
- 배송 상태 관리

### 🔔 알림 & AI 챗봇
- 주문/배송 상태 실시간 알림
- ChatGPT(GPT-4o-mini) 기반 AI 상담 챗봇 — 전시·공연 추천 및 서비스 안내

---

## 🔐 회원 유형

| 유형 | 권한 |
|------|------|
| **일반 회원** | 전시·공연 탐색, 후기 작성, 굿즈 구매, 경매 참여 |
| **기업 회원** | 공식 주체로서 홍보 게시글 작성 |
| **관리자** | 신고 처리, 회원 관리, 콘텐츠 전반 관리 |

---

## 🆚 기존 서비스와 비교

| 서비스 | 특징 |
|--------|------|
| **인터파크** | 예매 중심, 커뮤니티 단절 |
| **케이옥션** | 사전 신청 필수, 높은 진입 장벽 |
| **OPUS** | 탐색·후기·구매·경매 **통합** |

---

## 🛠️ 트러블슈팅

### 최보윤
- **전시 상세 페이지 "잘못된 접근입니다" 오류**
  - 원인: `location.state` 의존으로 직접 URL 접근 시 `item`이 `undefined`가 되는 문제
  - 해결: `useParams()`로 전시 ID를 읽고 API 재조회하는 구조로 변경

- **배포 후 On-Stage API 호출 CORS 오류**
  - 원인: React에서 외부 공공 API 직접 호출 시 CORS 발생, Mixed Content 이슈
  - 해결: Spring 서버를 Proxy로 구성, `RestTemplate`으로 서버 측 API 호출, 이미지 URL HTTPS 강제 변환

### 박상민
- **경매 현재 가격 정합성 보정 로직**
  - 원인: `UNVEILING.currentPrice`와 `BIDDING` 테이블 최고 입찰가 불일치 간헐 발생
  - 해결: `Math.max(baseCurrent, maxBid)` 보정 로직 추가

- **MyBatis XML 파싱 오류**
  - 원인: `CASE WHEN` 구문의 `<`, `>` 기호가 XML 태그로 인식
  - 해결: SQL 전체를 `<![CDATA[ ... ]]>` 섹션으로 감싸 처리

- **동시 입찰 정합성 처리**
  - 원인: 동시 응찰 시 중복 입찰 및 데이터 갱신 오류
  - 해결: `FOR UPDATE`로 비관적 락 적용, 트랜잭션 선점 후 순차 처리

### 박유진
- **장바구니 새로고침 시 수량 두 배 오류**
  - 원인: 병합 로직이 컴포넌트 재마운트마다 반복 실행
  - 해결: Zustand Store 전역 상태에서 `hasMerged` 플래그 관리, 로그인 시 1회만 병합

- **`useGeneratedKeys`와 시퀀스 동시 사용 시 PK NULL 문제**
  - 원인: Oracle 시퀀스는 SQL 내부에서 실행되어 JDBC가 PK 값을 인식 못함
  - 해결: `useGeneratedKeys` 대신 `<selectKey>`로 INSERT 전에 시퀀스 값 조회

### 최현정
- **배포 환경에서 아이디 저장 기능 미동작**
  - 원인: 서버 쿠키가 프론트(Vercel)와 백엔드(AWS) 도메인 분리로 인해 접근 불가
  - 해결: 쿠키 대신 `localStorage` 기반 저장으로 변경

---

## 📊 ERD

> 프로젝트의 전체 데이터베이스 구조는 ERD Cloud를 통해 설계되었습니다.

---

## 📅 프로젝트 일정

| 단계 | 내용 | 기간 |
|------|------|------|
| 기획·설계 | 프로젝트 주제, 요구사항 정의, DB 설계 | 2026.01.23 ~ 01.26 |
| 개발 | 프론트엔드·백엔드 기능 구현 | 2026.01.27 ~ 02.26 |
| 배포 | AWS 배포 및 최종 점검 | 2026.02 말 |

---

## 📁 프로젝트 구조

```
OPUS
├── Front-end (React + Vite)
│   ├── On-Stage        # 전시·공연 탐색
│   ├── Proposals       # 게시판
│   ├── Unveiling       # 경매
│   └── Selections      # 굿즈
└── Back-end (Spring Boot + Oracle)
    ├── Member          # 회원 관리
    ├── Stage           # 전시·공연 API 연동
    ├── Unveiling       # 경매 도메인
    ├── Goods           # 굿즈·주문·결제
    └── Admin           # 관리자
```

<p align="center">
  <b>OPUS</b> — Opening Perspective, Unveiling Scene<br/>
  Presented by 니캉내캉
</p>
