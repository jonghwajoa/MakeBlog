## ! 연산자와 false

> ! or false 어떤것이 가독성이 더 좋은것인가...?

```js
const subPostValidation = ({ title, content }) => {
  if (!arrayElementIsString([title, content])) {
    return false;
  }

  if (!isLength(title, 1, 100)) {
    return false;
  }
  return true;
};
```

입력값을 검증하는 함수에서 ! 연산자를 쓰고있다. !를 쓰면 편한데.. 이것이 과연 가독성이 좋다고 할 수 있는가..?

```js
const subPostValidation = ({ title, content }) => {
  if (arrayElementIsString([title, content]) === false) {
    return false;
  }

  if (isLength(title, 1, 100) === false) {
    return false;
  }
  return true;
};
```

false 를 사용하면 길어진다는 단점이 있지는 더 명확해 보인다.. (주관적인 생각)
사실 ! 연산자를 봤을때 False 를 리턴하면 진행되는 인지되지만. false 가 더 명확한 표기법인것 같기도하다..?

https://stackoverflow.com/questions/11831881/if-boolean-false-vs-if-boolean
! 이 더 가독성 좋다고 한다.. (그냥 개인선호도 문제)
팀 규칙에 맞추는것이 가장 현명한 기호이다.

```js
const subPostValidation = ({ title, content }) => {
  if (!arrayElementIsString([title, content]) || !isLength(title, 1, 100)) {
    return false;
  }
  return true;
};
```

