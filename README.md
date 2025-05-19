# 무근본배틀 (NoBaseBattle)

> AI 프롬프팅과 이미지 생성을 활용한 상상력으로 싸우는 캐릭터 배틀 게임 서비스

<div align="center">
  <!-- 프로젝트 로고나 이미지가 있다면 추가 -->
  <!-- <img src="project_image.png" alt="무근본배틀 로고" width="600px"> -->
  
  <br />
  
  <!-- 배지 추가 -->
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white"/>
  <img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=flat&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white"/>
  <img src="https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazonaws&logoColor=white"/>
</div>

<br />

## 📌 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [팀원 소개](#팀원-소개)
3. [주요 기능](#주요-기능)
4. [기술 스택](#기술-스택)
5. [시스템 아키텍처](#시스템-아키텍처)
6. [개발 환경](#개발-환경)
7. [주요 화면](#주요-화면)

<br />

## 프로젝트 소개

**무근본배틀**은 AI 프롬프팅과 이미지 생성을 활용하여 나만의 캐릭터를 만들고, 이를 다른 사용자와 배틀시키는 게임 서비스입니다. 사용자는 텍스트 프롬프트나 직접 그린 이미지를 통해 독특한 캐릭터를 생성하고, AI가 상상력 기반의 배틀을 통해 결과를 판정합니다.

이 서비스는 어린이 및 청년층이 쉽고 재미있게 생성형 AI의 원리를 익히도록 도와주는 게이미피케이션 학습 도구로, 창의적 사고력과 프롬프트 설계 능력을 자연스럽게 향상시킬 수 있습니다.

### 📆 개발 기간

**2025.04.14 ~ 2025.05.22**

<br />

## 팀원 소개

<table>
  <tr>
    <td align="center"><b>이해수</b></td>
    <td align="center"><b>김찬우</b></td>
    <td align="center"><b>신동운</b></td>
    <td align="center"><b>상승규</b></td>
    <td align="center"><b>김용순</b></td>
    <td align="center"><b>김선명</b></td>
  </tr>
  <tr>
    <td align="center"><img src="https://github.com/identicons/jasonlong.png" width="100px;" alt=""/></td>
    <td align="center"><img src="https://github.com/identicons/jasonlong.png" width="100px;" alt=""/></td>
    <td align="center"><img src="https://github.com/identicons/jasonlong.png" width="100px;" alt=""/></td>
    <td align="center"><img src="https://github.com/identicons/jasonlong.png" width="100px;" alt=""/></td>
    <td align="center"><img src="https://github.com/identicons/jasonlong.png" width="100px;" alt=""/></td>
    <td align="center"><img src="https://github.com/identicons/jasonlong.png" width="100px;" alt=""/></td>
  </tr>
  <tr>
    <td align="center">
      팀장 & PM<br />
      발표 및 프롬프팅
    </td>
    <td align="center">
      백엔드<br />
      유저 인증인가<br />
      익명사용자 기능<br />
      텍스트 캐릭터 생성 및 배틀<br />
      동시성 이슈 해결
    </td>
    <td align="center">
      백엔드<br />
      이미지 캐릭터 생성<br />
      배틀 기능<br />
      이벤트<br />
      뱃지 기능
    </td>
    <td align="center">
      백엔드 & 인프라<br />
      CI/CD<br />
      개발/배포 서버 관리<br />
      랭킹 시스템<br />
      Redis DB 관리
    </td>
    <td align="center">
      프론트엔드<br />
      그림 캐릭터<br />
      이벤트<br />
      프록시 ID 연결
    </td>
    <td align="center">
      프론트엔드<br />
      로그인<br />
      텍스트 캐릭터<br />
      랭킹<br />
      이벤트 모달창
    </td>
  </tr>
</table>

<br />

## 주요 기능

### 1. 유저 시스템
- 이메일 기반 회원가입, 로그인, 로그아웃
- 닉네임, 뱃지 시스템
- 익명 모드로 가볍게 체험 가능

### 2. 캐릭터 생성
- **텍스트 기반 캐릭터 생성**: 사용자 프롬프트 입력 + 템플릿 제공
- **이미지 기반 캐릭터 생성**: 직접 그림판에서 그림 그리기
- 캐릭터 이름, 프롬프트/이미지 수정 및 삭제 기능
- 캐릭터 최대 5개 제한 (텍스트/이미지 각각)

### 3. 배틀 시스템
- **텍스트 배틀**: 프롬프트 기반 생성 캐릭터들 간의 AI 전투 결과 출력
- **이미지 배틀**: 그린 그림을 바탕으로 전투력, 능력치 등 상상력 기반 결과 출력
- **모의 배틀**: 상위권 캐릭터와 점수 미반영 연습 배틀
- **이벤트 배틀**: 특정 조건을 가진 기간 한정 토너먼트

### 4. 심사 시스템
- 생성형 AI 기반으로 캐릭터의 전투력 판단 및 승패 결정
- 매력적인 전투과정 소개

### 5. 랭킹 시스템
- 텍스트 / 이미지 캐릭터별 분리된 랭킹
- 일간 / 무기한 랭킹 제공
- 상위권 유저는 닉네임 색상 및 뱃지 부여

<br />

## 기술 스택

### Frontend
- React
- JavaScript
- HTML/CSS
- Axios
- AWS S3(이미지 저장)
- Google Analytics

### Backend
- Spring Boot 3.4.4
- Spring Security
- Spring Data MongoDB
- JWT
- Redis (랭킹, ELO 기반 매칭)
- MongoDB (NoSQL)

### DevOps & Infrastructure
- Docker
- Kubernetes
- Jenkins
- AWS EC2
- AWS S3
- Nginx
- 개발/배포 서버 분리

<br />

## 시스템 아키텍처

<!-- 시스템 아키텍처 이미지가 있다면 추가 -->
<!-- <img src="system_architecture.png" alt="시스템 아키텍처" width="800px"> -->

### 인프라 주요 특징
1. 개발 서버와 배포 서버 분리로 안정적인 서비스 제공
2. 서버 모니터링 시스템 구축으로 시스템 안정성 향상
3. Kubernetes Master 서버를 별도로 구성하여 효율적인 컨테이너 관리

<br />

## 개발 환경

### Frontend
- Node.js
- React
- JavaScript

### Backend
- Java 17
- Spring Boot 3.4.4
- Spring Data MongoDB
- Spring Security
- Gradle 빌드

### Database
- MongoDB (캐릭터, 배틀 정보 저장)
- Redis (랭킹 시스템, 실시간 매칭)

### DevOps
- Docker
- Kubernetes
- Jenkins
- AWS EC2
- Nginx

### 사용 플러그인
| 플러그인 ID | 버전 | 설명 |
|------------|------|------|
| java | - | 기본 Java 애플리케이션을 위한 필수 플러그인 |
| org.springframework.boot | 3.4.4 | 스프링부트 애플리케이션을 위한 핵심 플러그인 |
| io.spring.dependency-management | 1.1.7 | 의존성 버전 관리를 위한 BOM 지원 플러그인 |

<br />

## 주요 화면

<!-- <div align="center">
  <img src="screenshot1.png" alt="로그인 화면" width="45%">
  <img src="screenshot2.png" alt="캐릭터 생성 화면" width="45%">
  <img src="screenshot3.png" alt="배틀 화면" width="45%">
  <img src="screenshot4.png" alt="랭킹 화면" width="45%">
</div> -->

<br />

## 주요 기술적 특징

### 백엔드 기술적 특징
1. **동시성 문제 해결**: 배틀 시 발생할 수 있는 동시성 이슈를 효과적으로 처리
2. **NoSQL 활용**: MongoDB를 이용해 이벤트 전적 관리를 별도 테이블 없이 캐릭터 컬렉션에 통합
3. **Redis 활용**: 랭킹 시스템과 ELO 점수 기반 매칭 시스템 구현

### 프론트엔드 기술적 특징
1. **빠른 배포 주기**: 두 차례의 배포를 통해 사용자 경험 개선
2. **분석 기능**: Google Analytics를 통한 사용자 행동 분석 및 배틀 전적 데이터 수집
3. **이미지 처리**: S3를 활용한 그림 캐릭터 이미지 업로드 및 수정 기능
4. **이벤트 시스템**: 프론트엔드와 백엔드 양쪽에서 이벤트 시간 검증 처리

### 인프라 기술적 특징
1. **서버 분리**: 개발 서버와 배포 서버 분리를 통한 안정적인 서비스 제공
2. **모니터링 시스템**: 독립적인 서버 모니터링 시스템 구축
3. **컨테이너 오케스트레이션**: Kubernetes를 활용한 확장성 있는 인프라 구성
