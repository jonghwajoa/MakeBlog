## 개발 명세서

### API

| API             | METHOD | 기능               |
| --------------- | ------ | ------------------ |
| /auth           | GET    | 로그인 form        |
| /auth           | POST   | 로그인             |
| /auth/register  | GET    | 회원가입 form      |
| /auth/register  | POST   | 회원가입           |
| /posts          | GET    | 포스트 리스트 출력 |
| /posts/new      | GET    | 포스트 생성 form   |
| /posts          | POST   | 포스트 생성        |
| /posts/:id/edit | GET    | 포스트 수정 form   |
| /posts/:id      | PUT    | 포스트 수정        |
| /posts/:id      | DELETE | 포스트 삭제        |



## 데이터 형식

ID : LEN[5,20] (5 부터 20 까지) lower (대소문자 구분 x)

PW : LEN[5,20] (5 부터 20 까지) lower (대소문자 구분 x)



### 테이블

errorlog : 에러발생시 기록할것임 404 제외

userLogin : 로그인 테이블 , ID PW SALT 값만 저장 (salt : 암호화에 쓰일 값)

users : 로그인테이블 정보를 제외한 회원정보 저장

posts: 게시물 테이블