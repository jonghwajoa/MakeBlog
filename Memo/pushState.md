# pushState

URL 은 자원의 정보로 활용된다.

이 프로젝트(블로그)에서는 Ajax 를 통해서 content 를 가져오는데 이떄 URL 이 변경되지 않는다..

즉 누군가 이 정보를 공유하고자할때, 즐겨찾기하고 URL 로 접근했을때 한번에 도달할 수 없다는 이야기가 된다.

그래서 Ajax 로 content 를 요청하더라도 그에 해당하는 URL 로 변경시킬 필요가 있다.

```js
history.pushState(state, title, url);
```

state 는 말그대로 data 를 의미한다.
title : 말그대로 title 을 지정하는듯하다. 해봤지만.. 작동하진 않더라..
url : 변경하고자 하는 url 주소를 저장한다.

<br>  

```js
window.history.pushState(result, null, `/solving/${problemNum}`);
```

result 는 Object...
title,content,problemNum 등을 저장하고 있다.

![state](https://user-images.githubusercontent.com/31912670/52406005-05e6e580-2b10-11e9-9959-47a0f8856eab.jpg)

<br>  

그렇다면 data를 언제 사용할까..?

브라우저를 사용하다보면 뒤로가기를 많이 사용할 것이다.

이때 뒤로가기 이벤트에 응답할 이벤트를 등록하지 않으면 URL을 뒤로가지는데 Content는 고정이 되버린다.

이를 해결하기위해서 window.onpopstate 이벤트와 연동해서 사용할 수 있다.

`popstate` 이벤트는 현재 활성화된 히스토리 엔트리에 변화가 있을 때 마다 실행됩니다. 만약 `pushState` 함수나 `replaceState` 함수에 의해 현재 활성화되어 있는 히스토리 엔트리가 조작 및 변경된다면, `popstate` 이벤트의 `state` 속성은 히스토리 항의 state 객체의 사본이 됩니다

> https://developer.mozilla.org/ko/docs/Web/API/History_API

<br>  

```js
<script>
window.onpopstate = function(e) {
    solving.backLoadContent(e.state);
}
</script>
```

e.state는 해당 URL에 해당하는 값(Ajax를 통해 받아온 값)을 저장하고 backLoadContent함수를 선언하여서 데이터를  대입한다.

이방법 외에도 document.body.innerhtml 자체를 조작할 수도 있다.





