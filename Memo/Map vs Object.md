## 반복적인 요청

Subpage 와 solving 페이지의 html 전체를 요청하는 것이 아니라 바뀌는 Content 만 JSON 타입으로 요청한다.

여기서 든 생각..

> 동일한 리소스를 반복적인 요청할때 지속적으로 서버에 요청할 필요가 없다고 생각됐다.

한번 받은 리소스 정보를 저장함으로써 부하도 줄이고 반응속도도 향상시켜보자..

### 수정전

<br>

![1](https://user-images.githubusercontent.com/31912670/51841566-51500580-2352-11e9-9ee8-0d5a36c9b506.png)

<br>

![default](https://user-images.githubusercontent.com/31912670/51841674-88261b80-2352-11e9-829e-a62e3c03903f.jpg)

1107 번과 2003 번을 반복적으로 요청하고 있고 매번 서버에 요청을 시도한다.

> 서버 부하를 최소화하고 응답속도를 빠르게 개선하기 위해 요청한 리소스를 저장해보자...

### post.js

```js
Post.prototype.getContent = async function(postNo, subNo = '1') {
  let reqeustPost;
  if (this.mapSavePost.has(subNo)) {
    reqeustPost = this.mapSavePost.get(subNo);
  } else {
    try {
      reqeustPost = await ajaxUtil.sendGetAjax(`/post/${postNo}/${subNo}`);
      reqeustPost = JSON.parse(result);
    } catch (e) {
      alert(`요청 실패 ${e.message}`);
      return;
    }
  }

  /* ************ 중략 ********** */

  if (!this.mapSavePost.has(subNo)) {
    this.mapSavePost.set(subNo, { ...reqeustPost });
  }
};
```

post 에 대한 리소스를 가지고 있다면 요청하지 않고 가지고 있는 리소스로 화면에 표시하게 된다.

리소스가 없을때 서버에 요청하게 되고 Map 에 저장한다.

## Map vs Obejct

문득 든 생각 Map 과 Object 어떤 차이가 무엇일까..?
Object 자체가 Key,value 의 쌍인데..?

```js
let obj = {};
obj[1] = {
  content: 'content 1입니다.',
  title: 'title 1입니다.',
};

obj[2] = {
  content: 'content 2입니다.',
  title: 'title 2입니다.',
};

console.log(obj);
/*
{ '1': { content: 'content 1입니다.', title: 'title 1입니다.' },
  '2': { content: 'content 2입니다.', title: 'title 2입니다.' } }
*/

console.log(obj[1]);
//  { content: 'content 1입니다.', title: 'title 1입니다.' }

let map = new Map();
map.set(1, {
  content: 'content 1입니다.',
  title: 'title 1입니다.',
});

map.set(2, {
  content: 'content 2입니다.',
  title: 'title 2입니다.',
});

console.log(map);
/*
Map {
  1 => { content: 'content 1입니다.', title: 'title 1입니다.' },
  2 => { content: 'content 2입니다.', title: 'title 2입니다.' } }
*/

console.log(map.get(1));
// { content: 'content 1입니다.', title: 'title 1입니다.' }
```

What is the difference between a map and a dictionary?

모질라에 의하면

> A Map object can iterate its elements in insertion order - a for..of loop will return an array of [key, value] for each iteration.

> Objects are similar to Maps in that both let you set keys to values, retrieve those values, delete keys, and detect whether something is stored at a key. Because of this, Objects have been used as Maps historically; however, there are important differences between Objects and Maps that make using a Map better.
>
> An Object has a prototype, so there are default keys in the map. However, this can be bypassed using map = Object.create(null). The keys of an Object are Strings, where they can be any value for a Map. You can get the size of a Map easily while you have to manually keep track of size for an Object.
>
> Use maps over objects when keys are unknown until run time, and when all keys are the same type and all values are the same type.
>
> Use objects when there is logic that operates on individual elements.

즉

```js
for (let e of obj) {
  console.log(e);
}
// TypeError: obj is not iterable

for (let e of map) {
  console.log(e);
}
/*
[ 1, { content: 'content 1입니다.', title: 'title 1입니다.' } ]
[ 2, { content: 'content 2입니다.', title: 'title 2입니다.' } ]
*/
```

## 

### has , size 기능

그외에도 map은 has와 size프로퍼티를 제공한다. 

물론 Object도 추가적인 작업을 해준다면 사용할 수 있지만... 사용편의상 Map이 편리하다..



## clear() 

Map은 clear 기능을 제공한다. 키를 삭제하는데 걸리는 시간 O(1);

object의 경우 모든요소를 지우는데 O(N) 

여기서 명확한 차이를 보인다





> https://medium.com/front-end-weekly/es6-map-vs-object-what-and-when-b80621932373
>



## Map 을 쓸필요가 있을까?

SubPost 의 경우

1. 보통 길이가 20 을 넘지 않는다. (넘어도 상관없음..)
2. Sub_no 라는 INT 형을 사용한다.



즉 Map 을 사용할 이유가 없다.. idx 를 정수형으로 사용하고 있기 때문에 그냥 배열에 저장하면 된다..  



### Map vs Array

> HashMap uses an array underneath so it can never be faster than using an array correctly.

SubPost 갯수만큼의 길이를 할당시켜놓고 사용하면 더 효율적이다..

```js
Post.prototype.getContent = async function(postNo, subNo = 1) {
    let reqeustPost;
    if (this.savePost[subNo]) {
      reqeustPost = this.savePost[subNo];
    } else {
      try {
        reqeustPost = await ajaxUtil.sendGetAjax(`/post/${postNo}/${subNo}`);
        reqeustPost = JSON.parse(reqeustPost);
      } catch (e) {
        alert(`Server Error(${e.status})`);
        return;
      }
    }
    let { content, title, count, created_at } = reqeustPost;

   /* *********** 중략 *********** */

    if (!this.savePost[subNo]) {
      this.savePost[subNo] = { ...reqeustPost };
    }
  };
```