document.addEventListener('DOMContentLoaded', function() {
  postRead.init();
});

let postRead = {
  content: document.getElementById('hiddenContent'),
  viewCount: document.getElementById('viewCount'),
  date: document.getElementById('createDate'),
  postTitle: document.getElementById('title'),
  headTitle: document.getElementById('headTitle'),

  init() {
    this.editor = new tui.Editor({
      el: document.querySelector('#content'),
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
    this.editor.setMarkdown(this.content.innerHTML.trim());
  },

  getContent(postNo, subNo = 1) {
    ajaxUtil
      .getPostContent(`/post/${postNo}/${subNo}`)
      .then(result => {
        let { content, title, count, created_at } = JSON.parse(result).post;

        this.date.innerHTML = `${created_at} |`;
        this.viewCount.innerHTML = `View ${count}`;
        this.postTitle.innerHTML = title;
        this.headTitle.innerHTML = `WeKnowJS-${title}`;
        this.editor.setValue(content.trim());
        window.history.replaceState(null, '', `/post/${postNo}/${subNo}`);
      })
      .catch(e => {
        alert(`Server Error(${e.status})`);
      });
  },

  deletePost(postNo) {
    let confirmflag = confirm(
      '게시글을 삭제하시겠습니까..??\n서브게시글도 전부 삭제됩니다.',
    );
    if (!confirmflag) {
      return;
    }

    ajaxUtil
      .deletePost(`/post/${postNo}`)
      .then(() => {
        alert('삭제 성공');
        location.href = '/post/';
      })
      .catch(e => {
        alert(`삭제 실패\n${e.status}`);
      });
  },
};
