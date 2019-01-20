## 개발 명세서

### API

| API                   | METHOD | 기능                  |
| --------------------- | ------ | --------------------- |
| /auth/login           | GET    | 로그인 form           |
| /auth/login           | POST   | 로그인                |
| /auth/register        | GET    | 회원가입 form         |
| /auth/register        | POST   | 회원가입              |
| /post                 | GET    | 포스트 리스트 출력    |
| /post/new             | GET    | 포스트 생성 form      |
| /post                 | POST   | 포스트 생성           |
| /post/:id             | GET    | 포스트 보기           |
| /post/:id             | PUT    | 포스트 수정           |
| /post/:id             | DELETE | 포스트 삭제           |
| /post/:id/edit        | GET    | 포스트 수정 form      |
| /post/:id/            | POST   | 서브 포스트 생성      |
| /post/:id/:subId      | GET    | 서브 포스트 보기      |
| /post/:id/:subId      | PUT    | 서브 포스트 수정      |
| /post/:id/:subId      | DELETE | 서브 포스트 삭제      |
| /post/:id/:subId/edit | GET    | 서브 포스트 수정 form |
| /post/category        | POST   | 카테고리 추가         |
| /post/file            | POST   | 사진 저장             |

## 데이터 형식

ID : LEN[5,20] (5 부터 20 까지) lower (대소문자 구분 x)  
PW : LEN[5,20] (5 부터 20 까지) lower (대소문자 구분 x)
