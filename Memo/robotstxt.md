## Robots.txt

검색엔진 로봇들의 접근을 조절해주고 제어하는 역할을 수행

- html 파일이 아닌 txt파일로 작성할것
- 루트 디렉토리에 위치할것
- User-agent : 브랜드사
- Disallow : 허용하지 않는 경로



```json
User-agent : Yeti,
Disaalow : /hello/
```

Yeti : 네이버 검색로봇

/hello 경로에 대해서는 수집을 금지한다.

- Yeti : 네이버
- Googlebot : 구글
- Bingbot : 빙
- Slurp : 야후



>  구글은 중복콘텐츠에 대해 페널티를 주기도 하기 때문에 만약 여러분 웹사이트 내 중복 콘텐츠가 있을 경우 robots.txt를 통해 적절히 제어해주는 것이 검색엔진최적화에 도움



## stiemap.xml

웹 사이트 내 모든 페이지의 목록을 나열한 파일 

목차와 같은 역할을 수행

- 일반적인 크롤링 과정에서 쉽게 발견되지 않는 웹페이지도 문제 없이 크롤링되고 색인될 수 있음
- 루트 디렉토리에 위치 하지 않아도됨.. 하지만 보통은 루트에 업로드함
- 검색엔진 최적화 점수를 주진 않지만 색인될 수 있게 도와주기 떄문에 검색엔진 최적화에 긍정적인 영향을 줌
- 





> https://www.twinword.co.kr/blog/search-engine-optimization-guide/