# 땅땅땅 API 명세 (OpenAPI 3.0.1)

본 문서는 제공된 OpenAPI 3.0.1 스펙을 기반으로 **모든 엔드포인트, 요청/응답 스키마, 보안 요건**을 한국어로 정리한 상세 명세입니다.

- **API 제목**: 땅땅땅 API  
- **설명**: 땅땅땅 스웨거  
- **버전**: 1.0.0  
- **기본 서버(Base URL)**: `/`  
- **보안**: `JWT TOKEN` (HTTP Bearer, JWT) — 대부분의 엔드포인트는 인증이 필요합니다.

---

## 인증 방식

- Authorization 헤더에 **Bearer 토큰**을 포함합니다.
  - 형식:  
    ```
    Authorization: Bearer <ACCESS_TOKEN>
    ```
- 보안 스키마
  - 이름: `JWT TOKEN`
  - 타입: `http`
  - 스킴: `bearer`
  - bearerFormat: `JWT`

---

## 공통 응답 규격

서버는 다음과 같은 공통 래퍼를 사용합니다.

### ApiResponse
| 필드 | 타입 | 설명 |
|---|---|---|
| isSuccess | boolean | 요청 처리 성공 여부 |
| code | string | 도메인별 응답/에러 코드 |
| message | string | 사용자 및 개발자용 메시지 |
| result | object | 실제 응답 데이터(없을 수 있음) |
| error | object | 에러 상세(없을 수 있음) |

### ApiResponseLong
| 필드 | 타입 | 설명 |
|---|---|---|
| isSuccess | boolean | 성공 여부 |
| code | string | 코드 |
| message | string | 메시지 |
| result | integer(int64) | 생성/수정 리소스의 식별자 등 |
| error | object | 에러 상세 |

### ApiResponseVoid
| 필드 | 타입 | 설명 |
|---|---|---|
| isSuccess | boolean | 성공 여부 |
| code | string | 코드 |
| message | string | 메시지 |
| result | object | 비어있을 수 있음 |
| error | object | 에러 상세 |

### ApiResponseString
| 필드 | 타입 | 설명 |
|---|---|---|
| isSuccess | boolean | 성공 여부 |
| code | string | 코드 |
| message | string | 메시지 |
| result | string | 문자열 결과 |
| error | object | 에러 상세 |

---

## 태그

- **Adopt API** — 채택 관련 API
- **Mypage** — 마이페이지 관련 API
- **Like API** — 좋아요 관련 API
- **Mainpage API** — 메인(홈) 화면 관련 API
- **Auth API** — 회원가입, 로그인, 토큰 재발급 등 인증
- **Case API** — 사건(1차, 2차 재판) 관련 API
- **final-judge-controller** — 최종 판결 관련 API
- **home-controller** — 루트(헬스체크) 등

---

# 엔드포인트 상세

> 표기: **[METHOD] 경로** — 요약  
> 인증 필요 시: `보안: JWT TOKEN`

## 1) Case API

### [POST] `/api/v1/rebuttals` — 반론(대댓글) 제출
- 설명: 특정 변론(`defenseId`) 또는 반론(`parentId`)에 대해 A/B 입장을 선택하여 반론을 제출합니다.
- 보안: JWT TOKEN
- 요청 본문: `RebuttalRequestDto` (application/json)
```json
{
  "defenseId": 0,
  "type": "A",
  "content": "string",
  "parentId": 0
}
```
- 응답:
  - `201 Created` — `ApiResponseLong` (result에 생성된 rebuttalId 등 long 값)

---

### [POST] `/api/v1/cases` — 1차 재판(초심) 생성 (솔로 모드)
- 보안: JWT TOKEN
- 요청 본문: `CaseRequestDto`
```json
{
  "mode": "SOLO",
  "title": "string",
  "argumentAMain": "string",
  "argumentAReasoning": "string",
  "argumentBMain": "string",
  "argumentBReasoning": "string"
}
```
- 응답:
  - `200 OK` — `ApiResponseCaseResponseDto` (result.caseId 포함)

---

### [POST] `/api/v1/cases/{caseId}/vote` — 배심원 투표
- 설명: 2차 재판에서 A/B측 투표. 재투표 시 입장 변경, 투표 시 AI 판결 비동기 업데이트.
- 보안: JWT TOKEN
- 경로 파라미터:
  - `caseId` (int64) — 필수
- 요청 본문: `VoteRequestDto`  
```json
{ "choice": "A" }
```
- 응답:
  - `200 OK` — `ApiResponseVoid`

---

### [GET] `/api/v1/cases/{caseId}/defenses` — 2차 재판 '변론' 목록 조회
- 설명: 2차 재판의 모든 변론과 각 변론의 반론 개수 조회
- 보안: JWT TOKEN
- 경로 파라미터:
  - `caseId` (int64) — 필수
- 응답:
  - `200 OK` — `ApiResponse`  
    예시:
```json
{
  "isSuccess": true,
  "code": "COMMON2000",
  "message": "변론 목록 조회에 성공하였습니다.",
  "result": [
    {
      "defenseId": 1,
      "authorNickname": "판사1",
      "side": "A",
      "content": "A측 변론입니다.",
      "likesCount": 10,
      "isLikedByMe": true,
      "rebuttalCount": 5
    }
  ],
  "error": null
}
```

---

### [POST] `/api/v1/cases/{caseId}/defenses` — 변론 제출
- 설명: 2차 재판에 A/B측 변론 제출. 제출 시 AI 판결 비동기 업데이트
- 보안: JWT TOKEN
- 경로 파라미터:
  - `caseId` (int64) — 필수
- 요청 본문: `DefenseRequestDto`
```json
{ "side": "A", "content": "string" }
```
- 응답:
  - `201 Created` — `ApiResponseLong`

---

### [PATCH] `/api/v1/cases/{caseId}/status` — 1차 재판 상태 변경(종료)
- 설명: 1차 판결 확인 후 사건 상태를 DONE으로 마감
- 보안: JWT TOKEN
- 경로 파라미터: `caseId` (int64)
- 요청 본문: `CaseStatusRequestDto`
```json
{ "status": "DONE" }
```
- 응답: `200 OK` — `ApiResponseVoid`

---

### [PATCH] `/api/v1/cases/{caseId}/appeal` — 2차 재판 시작
- 설명: 1차 판결 후 2차(SECOND) 시작. 시간 제한 없음
- 보안: JWT TOKEN
- 경로 파라미터: `caseId` (int64)
- 응답:
  - `200 OK` — `ApiResponse` (성공 메시지 예시 포함)
  - `400 Bad Request` — 이미 시작된 경우

---

### [GET] `/api/v1/defenses/{defenseId}/rebuttals` — 반론 목록 조회(중첩)
- 설명: 특정 변론에 달린 모든 반론을 중첩(대댓글) 구조로 조회
- 보안: JWT TOKEN
- 경로 파라미터: `defenseId` (int64)
- 응답:
  - `200 OK` — `ApiResponse`  
    예시(문자열로 축약된 JSON 포함):
```json
"{\"isSuccess\":true,\"code\":\"COMMON2000\",\"message\":\"반론 목록 조회에 성공하였습니다.\",\"result\":[{\"rebuttalId\":10,\"parentId\":null,\"authorNickname\":\"유저1\",\"type\":\"A\",\"content\":\"지지합니다.\",\"likesCount\":3,\"isLikedByMe\":false,\"children\":[{\"rebuttalId\":15,\"parentId\":10,...}]}],\"error\":null}"
```

---

### [GET] `/api/v1/cases/{caseId}` — 사건 상세 조회 (1차 입장문 포함)
- 보안: JWT TOKEN
- 경로 파라미터: `caseId` (int64)
- 응답:
  - `200 OK` — `ApiResponseCaseDetailResponseDto`

---

### [GET] `/api/v1/cases/{caseId}/vote/result` — 2차 재판 투표 결과 조회
- 설명: A/B 투표 현황 및 퍼센트
- 보안: JWT TOKEN
- 경로 파라미터: `caseId` (int64)
- 응답:
  - `200 OK` — `ApiResponse`  
    예시:
```json
{
  "isSuccess": true,
  "code": "COMMON2000",
  "message": "투표 결과 조회에 성공하였습니다.",
  "result": {
    "totalVotes": 25,
    "aCount": 15,
    "bCount": 10,
    "aPercent": 60.0,
    "bPercent": 40.0
  },
  "error": null
}
```

---

### [GET] `/api/v1/cases/{caseId}/second` — 2차 재판 상세 정보 조회
- 설명: 2차 재판에 필요한 주제, 변론, 중첩 반론, 내 투표, 실시간 AI 판결 등
- 보안: JWT TOKEN
- 경로 파라미터: `caseId` (int64)
- 응답:
  - `200 OK` — `CaseDetail2ndResponseDto`

---

### [GET] `/api/v1/cases/{caseId}/judgment` — 1차 재판 AI 판결 결과 조회
- 보안: JWT TOKEN
- 경로 파라미터: `caseId` (int64)
- 응답:
  - `200 OK` — `ApiResponseJudgmentResponseDto`

---

## 2) Auth API

### [POST] `/api/v1/auth/signup` — 회원가입
- 설명: 이메일, 닉네임, 비밀번호로 가입
- 요청 본문: `SignupRequestDto`
```json
{
  "nickname": "홍길동",
  "email": "user@example.com",
  "password": "password1234"
}
```
- 응답:
  - `201 Created` — `ApiResponse` (성공 메시지)
  - `400 Bad Request` — 유효성 검증 실패 (예시 포함)
  - `409 Conflict` — 이메일 또는 닉네임 중복 (`AUTH_4001`)

예시(400):
```json
{
  "isSuccess": false,
  "code": "REQ_4002",
  "message": "파라미터 형식이 잘못되었습니다.",
  "result": null,
  "error": "[nickname] 닉네임은 2자 이상 10자 이하로 입력해주세요."
}
```

예시(201):
```json
{
  "isSuccess": true,
  "code": "COMMON2000",
  "message": "회원가입에 성공하였습니다.",
  "result": null,
  "error": null
}
```

예시(409):
```json
{
  "isSuccess": false,
  "code": "AUTH_4001",
  "message": "중복되는 아이디가 존재합니다.",
  "result": null,
  "error": "이미 존재하는 이메일입니다."
}
```

---

### [POST] `/api/v1/auth/login` — 로그인
- 설명: 이메일/비밀번호 검증 후 토큰 발급
- 요청 본문: `LoginRequestDto`
```json
{ "email": "user@example.com", "password": "password1234" }
```
- 응답:
  - `200 OK` — `ApiResponse`  
    예시:
```json
{
  "isSuccess": true,
  "code": "COMMON2000",
  "message": "로그인에 성공하였습니다.",
  "result": {
    "accessToken": "ey...",
    "refreshToken": "ey..."
  },
  "error": null
}
```
  - `401 Unauthorized` — 아이디/비밀번호 불일치

---

### [POST] `/api/v1/auth/refresh` — AccessToken 재발급
- 설명: RefreshToken으로 새 AccessToken 발급
- 요청 본문: `TokenRefreshRequestDto`
```json
{ "email": "user@example.com", "refreshToken": "ey..." }
```
- 응답:
  - `200 OK` — `ApiResponse`  
    예시:
```json
{
  "isSuccess": true,
  "code": "COMMON2000",
  "message": "액세스 토큰이 성공적으로 재발급되었습니다.",
  "result": { "accessToken": "ey..." },
  "error": null
}
```
  - `401 Unauthorized` — 유효하지 않거나 만료된 리프레시 토큰

---

## 3) Mypage

### [POST] `/api/users/image` — 프로필 이미지 등록/수정
- 설명: 프로필 이미지 업로드(수정). 스펙상 `Content-Type: multipart/form-data` 언급.
- 보안: JWT TOKEN
- 요청 본문: (스펙 표기는 application/json이지만, 실전에서는 form-data 사용 권장)
  - 필드: `profileImage` (binary)
```json
{
  "profileImage": "binary"
}
```
- 응답:
  - `200 OK` — `ApiResponse`  
    예시:
```json
{
  "isSuccess": true,
  "code": "COMMON2000",
  "message": "프로필 사진 변경 완료 S3_Image_URL",
  "result": {},
  "error": null
}
```

---

### [PATCH] `/api/users/modify` — 내 정보 수정(닉네임, 이메일)
- 설명: 현재 로그인한 사용자 정보 수정
- 보안: JWT TOKEN
- 요청 본문: `UserUpdateRequestDto`
```json
{ "email": "test123@naver.com" }
```
- 응답:
  - `200 OK` — `ApiResponse`  
    예시:
```json
{
  "isSuccess": true,
  "code": "COMMON2000",
  "message": "유저 정보 업데이트 성공",
  "result": {
    "nickname": "tlsdo",
    "profileImageUrl": "프로필 이미지",
    "email": "test123@naver.com"
  },
  "error": null
}
```

---

### [GET] `/api/users/record` — 유저 전적 조회
- 설명: 로그인한 유저의 승/패 횟수 조회
- 보안: JWT TOKEN
- 응답:
  - `200 OK` — `ApiResponse`  
    예시:
```json
{
  "isSuccess": true,
  "code": "COMMON2000",
  "message": "전적 조회에 성공했습니다",
  "result": { "id": 1, "winCnt": 5, "loseCnt": 3 },
  "error": null
}
```
  - `401 Unauthorized` — 인증 필요

---

### [GET] `/api/users/rank` — 유저 등급(랭크) 조회
- 설명: 현재 등급, 경험치, 랭크 이름 조회
- 보안: JWT TOKEN
- 응답:
  - `200 OK` — `ApiResponse`  
    예시:
```json
{
  "isSuccess": true,
  "code": "COMMON2000",
  "message": "",
  "result": { "id": 1, "rank": "변호사 1단계", "exp": 18363 },
  "error": null
}
```
  - `401 Unauthorized`

---

### [GET] `/api/users/getInfo` — 내 정보 조회
- 보안: JWT TOKEN
- 응답:
  - `200 OK` — `ApiResponse`  
    예시:
```json
{
  "isSuccess": true,
  "code": "COMMON2000",
  "message": "유저 정보 조회 성공",
  "result": {
    "nickname": "tlsdo",
    "profileImageUrl": "프로필 이미지",
    "email": "test123@naver.com"
  },
  "error": null
}
```

---

### [GET] `/api/users/cases` — 유저 참여 사건 기록 조회
- 설명: 참여했던/중인 모든 사건(진행중, 완료 포함)
- 보안: JWT TOKEN
- 응답:
  - `200 OK` — `ApiResponse` (예시 포함)
  - `401 Unauthorized`

---

### [GET] `/api/users/achievements` — 유저 업적 조회
- 설명: 로그인한 유저의 모든 업적 목록
- 보안: JWT TOKEN
- 응답:
  - `200 OK` — `ApiResponse`  
    예시:
```json
{
  "isSuccess": true,
  "code": "COMMON2000",
  "message": "유저 업적 조회 성공",
  "result": [
    {
      "userId": 1,
      "achievementId": 101,
      "achievementName": "첫 승리",
      "achievementDescription": "첫 번째 재판에서 승리했습니다.",
      "achievementIconUrl": "https://example.com/icons/first_win.png",
      "achievementTime": "2025-10-28T14:30:00"
    }
  ],
  "error": null
}
```

---

## 4) Like API

### [POST] `/api/likes` — 좋아요 토글
- 설명: 특정 콘텐츠에 대해 좋아요 추가/취소
- 보안: JWT TOKEN
- 요청 본문: `LikeRequestDto`
```json
{ "contentId": 1, "contentType": "DEFENSE" }
```
- 응답:
  - `200 OK` — `ApiResponse`  
    예시(좋아요 추가):
```json
{
  "status": 200,
  "message": "좋아요가 추가되었습니다.",
  "data": true
}
```
    예시(좋아요 취소):
```json
{
  "status": 200,
  "message": "좋아요가 취소되었습니다.",
  "data": false
}
```

---

## 5) Mainpage API

### [GET] `/api/home/users/defenses` — 유저의 변론/반론 조회
- 설명: 로그인한 유저가 작성한 변론 및 반론
- 보안: JWT TOKEN
- 응답:
  - `200 OK` — `ApiResponse` (예시 포함)
  - `401 Unauthorized`

---

### [GET] `/api/home/users/cases` — 유저의 진행중인 재판 조회
- 설명: 참여 중인 진행 사건 목록
- 보안: JWT TOKEN
- 응답:
  - `200 OK` — `ApiResponse` (예시 포함)
  - `401 Unauthorized`

---

### [GET] `/api/home/hot` — 인기 사건 리스트
- 응답:
  - `200 OK` — `ApiResponseListCaseSimpleDto`

---

## 6) Adopt API

### [GET] `/api/final/adopt/{caseId}` — 채택 정보 조회
- 보안: JWT TOKEN (스펙상 명시 X이지만 일반적으로 인증 필요)
- 경로 파라미터: `caseId` (int64)
- 응답:
  - `200 OK` — `ApiResponseAdoptResponseDto`

### [POST] `/api/final/adopt/{caseId}` — 채택 수행
- 경로 파라미터: `caseId` (int64)
- 요청 본문: `AdoptRequestDto`
```json
{
  "defenseId": [1,2],
  "rebuttalId": [10,11]
}
```
- 응답:
  - `200 OK` — `ApiResponseString`

### [GET] `/api/final/adopt/{caseId}/best` — 베스트 의견 조회
- 경로 파라미터: `caseId` (int64)
- 응답:
  - `200 OK` — `ApiResponseAdoptResponseDto`

---

## 7) final-judge-controller

### [GET] `/api/final/judge/{caseId}` — 최종 판결 상세 조회
- 경로 파라미터: `caseId` (int64)
- 응답:
  - `200 OK` — `ApiResponseJudgementDetailResponseDto`

### [POST] `/api/final/judge/{caseId}` — 최종 판결 생성
- 경로 파라미터: `caseId` (int64)
- 요청 본문: `FinalJudgmentRequestDto`
```json
{ "votesA": 10, "votesB": 15 }
```
- 응답:
  - `200 OK` — `ApiResponseLong`

---

## 8) home-controller

### [GET] `/` — 스웨거 테스트(헬스)
- 응답:
  - `200 OK` — `string`

---

# 데이터 스키마 (components/schemas)

아래는 스펙에 정의된 모든 스키마의 속성을 표로 정리한 것입니다. `required`인 필드는 별도 표기합니다.

## RebuttalRequestDto
- required: `content`, `defenseId`, `type`
| 필드 | 타입 | 제약/설명 |
|---|---|---|
| defenseId | integer(int64) | 대상 변론 ID |
| type | string | enum: `A`, `B` |
| content | string | 본문 |
| parentId | integer(int64) | 상위 반론 ID(대댓글용, 선택) |

## CaseRequestDto
- required: `argumentAMain`, `argumentAReasoning`, `argumentBMain`, `argumentBReasoning`, `mode`, `title`
| 필드 | 타입 | 제약/설명 |
|---|---|---|
| mode | string | enum: `SOLO`, `PARTY` |
| title | string | 제목 |
| argumentAMain | string | A측 핵심 주장 |
| argumentAReasoning | string | A측 근거 |
| argumentBMain | string | B측 핵심 주장 |
| argumentBReasoning | string | B측 근거 |

## CaseResponseDto
| 필드 | 타입 | 설명 |
|---|---|---|
| caseId | integer(int64) | 생성된 사건 ID |

## ApiResponseCaseResponseDto
- result: `CaseResponseDto`

## VoteRequestDto
- required: `choice`
| 필드 | 타입 | 제약/설명 |
|---|---|---|
| choice | string | enum: `A`, `B` |

## DefenseRequestDto
- required: `side`, `content`
| 필드 | 타입 | 제약/설명 |
|---|---|---|
| side | string | enum: `A`, `B` |
| content | string | 본문 |

## SignupRequestDto
- required: `email`, `nickname`, `password`
| 필드 | 타입 | 제약/설명 |
|---|---|---|
| nickname | string | minLength: 2, maxLength: 10 |
| email | string | 이메일 |
| password | string | minLength: 8 |

## TokenRefreshRequestDto
- required: `email`, `refreshToken`
| 필드 | 타입 | 설명 |
|---|---|---|
| email | string | 이메일 |
| refreshToken | string | 리프레시 토큰 |

## LoginRequestDto
- required: `email`, `password`
| 필드 | 타입 |
|---|---|
| email | string |
| password | string |

## LikeRequestDto
- required: `contentId`, `contentType`
| 필드 | 타입 | 제약/설명 |
|---|---|---|
| contentId | integer(int64) | 대상 콘텐츠 ID |
| contentType | string | enum: `DEFENSE`, `REBUTTAL` |

## FinalJudgmentRequestDto
| 필드 | 타입 |
|---|---|
| votesA | integer(int64) |
| votesB | integer(int64) |

## AdoptRequestDto
| 필드 | 타입 | 설명 |
|---|---|---|
| defenseId | array(integer int64) | 채택할 변론 ID 배열 |
| rebuttalId | array(integer int64) | 채택할 반론 ID 배열 |

## CaseStatusRequestDto
- required: `status`
| 필드 | 타입 | 제약 |
|---|---|---|
| status | string | enum: `FIRST`, `SECOND`, `THIRD`, `DONE` |

## UserUpdateRequestDto
| 필드 | 타입 |
|---|---|
| nickname | string |
| profileImageUrl | string |
| email | string |

## ArgumentDetailDto
| 필드 | 타입 | 설명 |
|---|---|---|
| mainArgument | string | 핵심 주장 |
| reasoning | string | 근거 |
| authorId | integer(int64) | 작성자 |

## CaseDetailResponseDto
| 필드 | 타입 | 설명 |
|---|---|---|
| caseId | integer(int64) | 사건 ID |
| title | string | 제목 |
| status | string | enum: `FIRST`, `SECOND`, `THIRD`, `DONE` |
| mode | string | enum: `SOLO`, `PARTY` |
| argumentA | `ArgumentDetailDto` | A 입장 |
| argumentB | `ArgumentDetailDto` | B 입장 |

## RebuttalDto
| 필드 | 타입 | 설명 |
|---|---|---|
| rebuttalId | integer(int64) | 반론 ID |
| parentId | integer(int64) | 상위 반론 ID |
| authorNickname | string | 작성자 닉네임 |
| type | string | enum: `A`, `B` |
| content | string | 본문 |
| likesCount | integer(int32) | 좋아요 수 |
| isLikedByMe | boolean | 내가 좋아요 했는지 |

## DefenseDto
| 필드 | 타입 | 설명 |
|---|---|---|
| defenseId | integer(int64) | 변론 ID |
| authorNickname | string | 작성자 |
| side | string | enum: `A`, `B` |
| content | string | 본문 |
| likesCount | integer(int32) | 좋아요 수 |
| isLikedByMe | boolean | 내 좋아요 여부 |
| rebuttals | array of `RebuttalDto` | 하위 반론 목록 |

## VoteDto
| 필드 | 타입 | 제약 |
|---|---|---|
| choice | string | enum: `A`, `B` |

## JudgmentResponseDto
| 필드 | 타입 | 설명 |
|---|---|---|
| judgeIllustrationUrl | string | 판사 일러스트 URL |
| verdict | string | 평결(요약) |
| conclusion | string | 결론 텍스트 |
| ratioA | integer(int32) | A 비율 |
| ratioB | integer(int32) | B 비율 |

## CaseDetail2ndResponseDto
| 필드 | 타입 | 설명 |
|---|---|---|
| caseId | integer(int64) | 사건 ID |
| caseTitle | string | 사건 제목 |
| defenses | array of `DefenseDto` | 변론 목록 |
| userVote | `VoteDto` | 내 투표 |
| currentJudgment | `JudgmentResponseDto` | 현재 AI 판결 |

## ApiResponseJudgmentResponseDto
- result: `JudgmentResponseDto`

## CaseSimpleDto
| 필드 | 타입 | 설명 |
|---|---|---|
| caseId | integer(int64) | 사건 ID |
| title | string | 제목 |
| mainArguments | array(string) | 핵심 주장 요약 배열 |

## ApiResponseListCaseSimpleDto
- result: array of `CaseSimpleDto`

## DefenseAdoptDto
| 필드 | 타입 |
|---|---|
| caseId | integer(int64) |
| userId | integer(int64) |
| defenseId | integer(int64) |
| debateSide | string (enum `A`, `B`) |
| content | string |
| likeCount | integer(int32) |

## RebuttalAdoptDto
| 필드 | 타입 |
|---|---|
| caseId | integer(int64) |
| userId | integer(int64) |
| defenseId | integer(int64) |
| rebuttalId | integer(int64) |
| parentId | integer(int64) |
| parentContent | string |
| debateSide | string (enum `A`, `B`) |
| content | string |
| likeCount | integer(int32) |

## JudgementDetailResponseDto
| 필드 | 타입 | 설명 |
|---|---|---|
| judgmentId | integer(int64) | 최종 판결 ID |
| content | string | 판결 본문 |
| ratioA | integer(int32) | A 비율 |
| ratioB | integer(int32) | B 비율 |
| adoptedDefenses | array of `DefenseAdoptDto` | 채택된 변론 |
| adoptedRebuttals | array of `RebuttalAdoptDto` | 채택된 반론 |

## AdoptResponseDto
| 필드 | 타입 |
|---|---|
| defenses | array of `DefenseAdoptDto` |
| rebuttals | array of `RebuttalAdoptDto` |

## ApiResponseAdoptResponseDto
- result: `AdoptResponseDto`

## ApiResponseCaseDetailResponseDto
- result: `CaseDetailResponseDto`

## ApiResponseJudgementDetailResponseDto
- result: `JudgementDetailResponseDto`

---

# 상태 코드 요약

- **200 OK** — 일반 성공
- **201 Created** — 생성 성공
- **400 Bad Request** — 유효성 오류/잘못된 요청
- **401 Unauthorized** — 인증 실패
- **409 Conflict** — 중복 등 충돌
- 기타 서버 오류는 서비스 표준 규칙에 따릅니다.

---

# 요청 예시: cURL 패턴

아래 패턴을 기반으로 각 엔드포인트의 경로/바디를 치환해 사용합니다.

```bash
# 인증이 필요한 요청
curl -X GET "https://<HOST>/:path" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json"

# JSON POST
curl -X POST "https://<HOST>/api/v1/cases" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "SOLO",
    "title": "환경오염 책임",
    "argumentAMain": "기업 책임",
    "argumentAReasoning": "근거...",
    "argumentBMain": "개인 책임",
    "argumentBReasoning": "근거..."
  }'
```

---

# 보안 스키마 (components/securitySchemes)

- `JWT TOKEN`  
  - type: `http`  
  - scheme: `bearer`  
  - bearerFormat: `JWT`

---
