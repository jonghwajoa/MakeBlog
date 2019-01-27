let postRead = (() => {
  const content = document.getElementById('postContent');
  const viewCount = document.getElementById('viewCount');
  const date = document.getElementById('createDate');
  const postTitle = document.getElementById('title');
  const headTitle = document.getElementById('headTitle');
  let editor;
  let module = {};

  module.init = () => {
    editor = new tui.Editor({
      el: document.getElementById('content-text'),
      exts: [
        'table',
        'uml',
        {
          name: 'chart',
          minWidth: 100,
          maxWidth: 600,
          minHeight: 100,
          maxHeight: 300,
        },
      ],
    });
    editor.setMarkdown(content.value.trim());
  };

  module.getContent = async (postNo, subNo = 1) => {
    let result;
    try {
      result = await ajaxUtil.sendGetAjax(`/post/${postNo}/${subNo}`);
    } catch (e) {
      alert(`Server Error(${e.status})`);
      return;
    }
    let { content, title, count, created_at } = JSON.parse(result).post;
    date.innerHTML = `${created_at} |`;
    viewCount.innerHTML = `View ${count}`;
    postTitle.innerHTML = title;
    headTitle.innerHTML = `WeKnowJS-${title}`;
    editor.setValue(content.trim());
    window.history.replaceState(null, '', `/post/${postNo}/${subNo}`);
  };

  module.deletePost = async (postNo, subNo = 1) => {
    let message = '서브게시글을 삭제하시겠습니까?';
    let url = `/post/${postNo}/${subNo}`;
    let redirect = `/post/${postNo}`;

    if (subNo === 1) {
      message = '게시글을 삭제하시겠습니까..??\n서브게시글도 전부 삭제됩니다.';
      url = `/post/${postNo}`;
      redirect = '/post';
    }

    let confirmflag = confirm(message);
    if (!confirmflag) {
      return;
    }

    try {
      await ajaxUtil.sendDeleteAjax(url);
      alert('삭제 성공');
      location.href = redirect;
    } catch (e) {
      alert(`삭제 실패\n${e.status}`);
    }
  };

  return module;
})();

document.addEventListener('DOMContentLoaded', function() {
  postRead.init();
});
