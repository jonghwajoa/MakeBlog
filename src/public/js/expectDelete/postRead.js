let Post = (() => {
  function Post() {}

  Post.prototype.read = function() {
    this.content = document.getElementById('postContent');
    this.viewCount = document.getElementById('viewCount');
    this.date = document.getElementById('createDate');
    this.postTitle = document.getElementById('title');
    this.headTitle = document.getElementById('headTitle');
    this.editor = readEditor();
    this.editor.setMarkdown(this.content.value.trim());
  };

  Post.prototype.getContent = async function(postNo, subNo = 1) {
    let result;
    try {
      result = await ajaxUtil.sendGetAjax(`/post/${postNo}/${subNo}`);
    } catch (e) {
      alert(`Server Error(${e.status})`);
      return;
    }
    let { content, title, count, created_at } = JSON.parse(result).post;
    this.date.innerHTML = `${created_at} |`;
    this.viewCount.innerHTML = `View ${count}`;
    this.postTitle.innerHTML = title;
    this.headTitle.innerHTML = `WeKnowJS-${title}`;
    this.editor.setValue(content.trim());
    window.history.replaceState(null, '', `/post/${postNo}/${subNo}`);
  };

  Post.prototype.deletePost = async function(postNo, subNo = 1) {
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

  function readEditor() {
    return new tui.Editor({
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
  }

  return Post;
})();

const postRead = new Post();
postRead.read();
