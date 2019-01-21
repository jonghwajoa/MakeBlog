document.addEventListener('DOMContentLoaded', function() {
  postRead.init();
});

let postRead = {
  content: document.getElementById('hiddenContent'),
  postTitle: document.getElementById('title'),
  headTitle: document.getElementById('headTitle'),
  tag: document.getElementById('tag'),
  category: document.getElementById('category'),

  titleInit() {

  },

  init() {
    this.editor = new tui.Editor({
      el: document.getElementById('editSection'),
      initialEditType: 'markdown',
      initialValue: content,
      previewStyle: 'vertical',
      height: '100vh',
      exts: [
        'scrollSync',
        'table',
        'uml',
        {
          name: 'chart',
          minWidth: 100,
          maxWidth: 600,
          minHeight: 100,
          maxHeight: 300,
        },
        'colorSyntax',
      ],

      hooks: {
        addImageBlobHook(photo, cb) {
          const xhr = new XMLHttpRequest();
          const formData = new FormData();
          formData.append('photo', photo);
          xhr.onload = function() {
            if (xhr.status === 200) {
              return cb(`http://localhost/images/${xhr.responseText}`);
            }
            return alert('업로드 실패');
          };
          xhr.open('POST', '/post/file', true);
          xhr.send(formData);
        },
      },
    });
    this.editor.setMarkdown(this.content.innerHTML.trim());
  },

  getContent(postNo, subNo = 1) {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status === 200) {
        let { content, title, count, created_at } = JSON.parse(
          xhr.responseText,
        ).post;

        this.date.innerHTML = `${created_at} |`;
        this.viewCount.innerHTML = `View ${count}`;
        this.postTitle.innerHTML = title;
        this.headTitle.innerHTML = `WeKnowJS-${title}`;
        this.editor.setValue(content.trim());
        window.history.replaceState(null, '', `/post/${postNo}/${subNo}`);
      } else {
        alert(`${xhr.responseText}`);
      }
    };

    xhr.open('GET', `/post/${postNo}/${subNo}`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send();
  },

  deletePost() {
    let confirmflag = confirm(
      '게시글을 삭제하시겠습니까..??\n서브게시글도 전부 삭제됩니다.',
    );
    if (confirmflag) {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 204) {
          alert('삭제성공');
          location.href = '/post/';
        } else {
          alert(`작성 실패\n${xhr.responseText}`);
        }
      };
      xhr.open('DELETE', '/post/<%=post.no%>', true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send();
    }
  },
};
