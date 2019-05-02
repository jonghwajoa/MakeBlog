# Make Tech Blog

- https://www.jonghwa.xyz
- https://www.weknowjs.xyz

---

## 프로젝트 진행하면서 생긴 궁금증

- [! or false](https://github.com/jonghwajoa/MakeBlog/blob/master/Memo/!%20or%20false.md)
- [선언식 vs 표현식](https://github.com/jonghwajoa/MakeBlog/blob/master/Memo/%EC%84%A0%EC%96%B8%EC%8B%9Dvs%ED%91%9C%ED%98%84%EC%8B%9D.md)
- [반복적인 요청 ( Map vs Object )](https://github.com/jonghwajoa/MakeBlog/blob/master/Memo/Map%20vs%20Object.md)
- [pushState, replaceState](https://github.com/jonghwajoa/MakeBlog/blob/master/Memo/pushState.md)
- [Robots.txt](https://github.com/jonghwajoa/MakeBlog/blob/master/Memo/robotstxt.md)
- [HTML5 로컬스토리지](https://github.com/jonghwajoa/MakeBlog/blob/master/Memo/%EC%9B%B9%EC%8A%A4%ED%86%A0%EB%A6%AC%EC%A7%80.md)

<br>

## v 1.1

개발기간 : 180814 ~ 180901

- Https (Let`s Encrypt)
- 패스워드암호화 (bcrypt)
- 마크다운 에디터 사용 (NHN - Toast Editor)

  - GIT Hub : <https://github.com/nhnent/tui.editor>

  - example: <https://nhnent.github.io/tui.editor/api/latest/tutorial-example01-basic.html>

- 게시글 안에 게시글 작성가능
- 방문자 카운트
- 페이징 처리(perPage 적용)
- 댓글 (disqus)

### V1 오류 수정

- 본글 삭제시 서브글 미삭제 (cascade 미적용)
- postNo 와 subNo 의 불일치 요청시 post 와 subPost 혼합 응답 수정
- post subpost view 분리

<br>

## V 2

개발기간 : 19.01.17 ~ 19.02.17

- 방문로그 추가
- 게시글 컬럼 추가 (sub_no)
- 카테고리 추가 기능
- js 파일 분리
- post route 파라미터 정리 (공통 검증 분리)
- Solving HTML,css 구현
- Solving 기능구현
- 카테고리 추가 삭제 기능 (POST 페이지)
- solving js 재작성, map 저장

## 수정

- solving category count 컬럼 삭제 (length 로 대체)
- 카테고리 Set null 설정 -> RESTRICT 변경 (삭제 실패시 상태코드 409 반환)
- 수정하기,삭제하기 id 값 미변경
- page 파라미터 오류 500 error 에러 점검 -> parseint 에서 number 로 대체
- 업데이트 hidden p tag -> input hidden 으로 수정

<br>

## V 2.1 ( 배포 버전 )

개발 기간 : 19.02.18 ~ 19.03.10

- Post 페이지 카테고리 기능 삭제
- TAG 기능 추가
- Repository 폴더 삭제 진행
- Open Graph 태그

## V 2.2 (개발중)

개발 기간 : 19.03.16 ~

### 목표 기능

- Admin 페이지

* - 방문자 그래프로 표현하기
* - 오류내역 확인기능
* api 분리하기

### 진행정도

- 방문자 그래프 표현하기 완료
- 오류내역 확인기능 완료
