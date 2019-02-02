let login = (() => {
  const loginId = document.getElementById('id');
  const loginPw = document.getElementById('pw');
  const module = {};

  function validation(id, pw) {
    if (id.length < 5 || id.length > 20 || typeof id !== 'string') {
      alert('아이디 형식이 올바르지 않습니다.');
      return false;
    }
    if (pw.length < 5 || pw.length > 20 || typeof id !== 'string') {
      alert('비밀번호 형식이 올바르지 않습니다.');
      return false;
    }
    return true;
  }

  module.login = async () => {
    let id = loginId.value;
    let pw = loginPw.value;

    if (!validation(id, pw)) {
      return false;
    }

    try {
      await ajaxUtil.sendPostAjax('/auth/login', { id, pw });
      location.href = '/posts/';
    } catch (e) {
      return alert(e.message);
    }
  };

  return module;
})();
