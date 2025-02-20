# backend
## **1. 회원가입 (Register)**

- **URL**: `POST /api/register/`
- **설명**: 사용자가 회원가입을 진행
- **요청 데이터 (JSON)**:
  ```json
  {
    "uid": "1234567890",
    "name": "홍길동",
    "kakao_email": "test@example.com",
    "phone_number": "010-1234-5678",
    "birth_date": "1990-01-01",
    "full_address": "서울특별시 강남구 테헤란로",
    "address_detail": "101동 202호"
  }
  ```
- **응답 데이터 (JSON)**:
  - **성공 (201 Created)**
    ```json
    {
      "success": true,
      "message": "SUCCESS sign up"
    }
    ```
  - **실패 (400 Bad Request)**
    ```json
    {
      "success": false,
      "message": "에러 메시지"
    }
    ```

---

## **2. 로그인 (Login)**

- **URL**: `POST /api/login/`
- **설명**: 사용자가 로그인합니다.
- **요청 데이터 (JSON)**:
  ```json
  {
    "uid": "1234567890",
    "kakao_email": "test@example.com"
  }
  ```
- **응답 데이터 (JSON)**:
  - **성공 (200 OK)**
    ```json
    {
      "success": true,
      "message": "SUCCESS login"
    }
    ```
  - **실패 (400 Bad Request)**
    ```json
    {
      "success": false,
      "message": "FAIL login"
    }
    ```

---

## **3. 사용자 정보 조회 (User Info)**

- **URL**: `GET /api/user-info/`
- **설명**: 로그인한 사용자의 정보를 조회
- **요청 헤더**:
  - 세션 기반 인증 (로그인 후 요청해야 함)
- **응답 데이터 (JSON)**:
  - **성공 (200 OK)**
    ```json
    {
      "success": true,
      "user": {
        "uid": "1234567890",
        "name": "홍길동",
        "kakao_email": "test@example.com",
        "phone_number": "010-1234-5678",
        "birth_date": "1990-01-01"
      }
    }
    ```
  - **실패 (401 Unauthorized)**
    ```json
    {
      "success": false,
      "message": "FAIL need login"
    }
    ```

---

## **4. 로그아웃 (Logout)**

- **URL**: `POST /api/logout/`
- **설명**: 사용자 로그아웃
- **요청 데이터**: 없음
- **응답 데이터 (JSON)**:
  - **성공 (200 OK)**
    ```json
    {
      "success": true,
      "message": "SUCCESS logout"
    }
    ```

---

## **API 엔드포인트**

| HTTP Method | URL               | 설명             |
| ----------- | ----------------- | -------------- |
| `POST`      | `/api/register/`  | 회원가입           |
| `POST`      | `/api/login/`     | 로그인            |
| `GET`       | `/api/user-info/` | 로그인한 사용자 정보 조회 |
| `POST`      | `/api/logout/`    | 로그아웃           |

---

## **인증 방식**

- `session-based authentication`을 사용하여 로그인 상태를 유지
- 로그인 후 요청 시 Django 세션을 활용하여 인증을 수행

---
