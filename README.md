# Make Tech Blog

https://www.weknowjs.xyz/

## API

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
| /solving              | GET    | solving home          |
| /solving              | POST   | solving 생성          |
| /solving/new          | GET    | 문제 생성 form        |
| /solving/:id          | GET    | solving 보기          |

<br>
  
# v1 (배포버전)

개발기간 : 180814 ~ 180901

- Https (Let`s Encrypt)
- 패스워드암호화 (bcrypt)
- 마크다운 에디터 사용 (NHN - Toast Editor)

  - GIT Hub : <https://github.com/nhnent/tui.editor>

  - example: <https://nhnent.github.io/tui.editor/api/latest/tutorial-example01-basic.html>

- 게시글 안에 게시글 작성가능
- 방문자 카운트
- 페이징 처리
- 댓글 (disqus)

### v1 오류 수정

- 본글 삭제시 서브글 미삭제
- postNo 와 subNo 의 불일치 요청시 post 와 subPost 혼합 응답 수정
- post subpost view 분리

<br>

# v2 (완료사항 - 미배포)

개발기간 : 19.01.17 ~ continue

- 방문로그 추가
- 게시글 컬럼 추가
- 카테고리 추가 기능
- js 파일 분리
- post route 파라미터 정리 (공통 검증 분리)
- Solving HTML,css 구현

## v2 (진행사항)

- 테스트 코드작성
- 오류수정..
- Solving 기능구현

### v2 목표까지 남은 기능 (미진행)

- html 다시 작성하기.. (3 월중 시작)

<br>
