const Post = (() => {
  function Post() {
    this.curSubNo = 1;
    this.mapSavePost = new Map();
  }

  Post.prototype.readInit = function() {
    this.content = document.getElementById('postContent');
    this.viewCount = document.getElementById('viewCount');
    this.date = document.getElementById('createDate');
    this.postTitle = document.getElementById('title');
    this.headTitle = document.getElementById('headTitle');
    this.editor = readEditor();
    let trimContent = this.content.value.trim();
    this.editor.setMarkdown(trimContent);

    this.mapSavePost.set('1', {
      content: this.content.value.trim(),
      title: this.postTitle.innerHTML.trim(),
      count: this.viewCount.innerHTML.trim(),
      created_at: this.date.innerHTML.trim(),
    });
  };

  Post.prototype.writeInit = function() {
    this.postTitle = document.getElementById('title');
    this.category = document.getElementById('category');
    this.categoryName = document.getElementById('addCategory');
    this.selectBox = document.getElementById('category');
    this.tag = document.getElementById('tag');
    this.editor = writeEditor();
  };

  Post.prototype.updateInit = function() {
    this.content = document.getElementById('hiddenContent');
    this.postTitle = document.getElementById('title');
    this.tag = document.getElementById('tag');
    this.category = document.getElementById('category');
    this.editor = writeEditor();
    this.editor.setMarkdown(this.content.innerHTML.trim());

    if (this.tag) {
      let tagVal = this.tag.value.split(' ');
      tagVal.shift();

      this.tag.value = tagVal.map(item => item.substr(1, item.length)).join(' ');
    }
  };

  //write 함수
  Post.prototype.submit = async function submit() {
    const title = this.postTitle.value;
    const content = this.editor.getMarkdown().trim();
    const category = this.category;
    const categoryText = '#' + category[category.selectedIndex].text;
    let tag = this.tag.value.trim().replace(/\s*,+\s*|\s+/g, ' #');

    if (!title) {
      alert('제목을 입력하세요..');
      return false;
    }

    if (!content) {
      alert('내용을 입력하세요.');
      return false;
    }

    if (tag) {
      tag = categoryText + ' #' + tag;
    } else {
      tag = categoryText;
    }

    const params = {
      title,
      tag,
      content,
      category: category.value,
    };

    try {
      await ajaxUtil.sendPostAjax('/post/', params);
      location.href = '/post/';
    } catch (e) {
      alert(`작성 실패\n${e.responseText}`);
    }
  };

  // read함수
  Post.prototype.getContent = async function(postNo, subNo = '1') {
    let result;
    if (this.mapSavePost.has(subNo)) {
      result = this.mapSavePost.get(subNo);
      console.log('응 여기실행');
    } else {
      try {
        result = await ajaxUtil.sendGetAjax(`/post/${postNo}/${subNo}`);
        result = JSON.parse(result).post;
      } catch (e) {
        alert(`Server Error(${e.status})`);
        return;
      }
    }
    let { content, title, count, created_at } = result;

    this.date.innerHTML = `${created_at} |`;
    this.viewCount.innerHTML = `View ${count}`;
    this.postTitle.innerHTML = title;
    this.headTitle.innerHTML = `WeKnowJS-${title}`;
    this.editor.setValue(content.trim());
    window.history.replaceState(null, '', `/post/${postNo}/${subNo}`);
    this.curSubNo = subNo;

    if (!this.mapSavePost.has(subNo)) {
      this.mapSavePost.set(subNo, {
        content: this.content.value.trim(),
        title: this.postTitle.innerHTML.trim(),
        count: this.viewCount.innerHTML.trim(),
        created_at: this.date.innerHTML.trim(),
      });
    }
  };

  // read 함수
  Post.prototype.deletePost = async function(postNo) {
    let message = '서브게시글을 삭제하시겠습니까?';
    let url = `/post/${postNo}/${this.curSubNo}`;
    let redirect = `/post/${postNo}`;

    if (this.curSubNo === 1) {
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

  Post.prototype.updateView = async function(postNo) {
    let path = `/post/${postNo}/${this.curSubNo}/edit`;
    if (this.curSubNo === 1) {
      path = `/post/${postNo}/edit`;
    }
    location.href = path;
  };

  Post.prototype.submitSub = async function(postNo) {
    const title = this.postTitle.value;
    const content = this.editor.getMarkdown().trim();

    if (!title) {
      alert('제목을 입력하세요..');
      return false;
    }

    if (!content) {
      alert('내용을 입력하세요.');
      return false;
    }

    const params = {
      title,
      content,
    };

    try {
      await ajaxUtil.sendPostAjax(`/post/${postNo}`, params);
      location.href = `/post/${postNo}`;
    } catch (e) {
      alert(`작성 실패\n${e.responseText}`);
    }
  };

  Post.prototype.update = async function(postNo) {
    const title = this.postTitle.value;
    const content = this.editor.getMarkdown().trim();
    const category = this.category;
    const categoryText = '#' + category[category.selectedIndex].text;
    let tag = this.tag.value.trim().replace(/\s*,+\s*|\s+/g, ' #');

    if (!title) {
      alert('제목을 입력하세요..');
      return false;
    }

    if (!content) {
      alert('내용을 입력하세요.');
      return false;
    }

    if (tag) {
      tag = categoryText + ' #' + tag;
    } else {
      tag = categoryText;
    }

    const params = {
      title,
      tag,
      content,
      category: category.value,
    };

    let url = `/post/${postNo}`;

    try {
      await ajaxUtil.sendPutAjax(url, params);
      location.href = `/post/${postNo}`;
    } catch (e) {
      alert(`업데이트 실패\n${e.responseText}`);
    }
  };

  Post.prototype.updateSub = async function(postNo, subNo) {
    const title = this.postTitle.value;
    const content = this.editor.getMarkdown().trim();

    if (!title) {
      alert('제목을 입력하세요..');
      return false;
    }

    if (!content) {
      alert('내용을 입력하세요.');
      return false;
    }

    const params = {
      title,
      content,
    };

    let url = `/post/${postNo}/${subNo}`;

    try {
      await ajaxUtil.sendPutAjax(url, params);
      location.href = `/post/${postNo}/${subNo}`;
    } catch (e) {
      alert(`업데이트 실패\n${e.responseText}`);
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

  function writeEditor() {
    return new tui.Editor({
      el: document.getElementById('editSection'),
      initialEditType: 'markdown',
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
        async addImageBlobHook(photo, cb) {
          try {
            let result = await ajaxUtil.saveFileAjax(photo);
            return cb(`http://localhost/images/${result}`);
          } catch (e) {
            alert(e.statusText);
          }
        },
      },
    });
  }

  return Post;
})();

/*
async function addCategory() {
  const categoryName = this.categoryName.value;
  const selectBox = this.category;
  let result;
  try {
    result = await ajaxUtil.sendPostAjax('/post/category/', categoryName);
  } catch (e) {
    alert(`${e.responseText}`);
    return;
  }

  let select = document.createElement('option');
  let { no, message } = JSON.parse(result.responseText);
  select.text = categoryName;
  select.value = no;
  selectBox.options.add(select);
  alert(message);
}

async function addCategory2() {
  const categoryName = this.categoryName.value;
  const selectBox = this.selectBox;
  let result;
  try {
    result = await ajaxUtil.sendPostAjax('/post/category/', { categoryName });
  } catch (e) {
    alert(`${e.message}\n${e.status}`);
    return;
  }
  let select = document.createElement('option');
  let { no, message } = JSON.parse(result);
  select.text = categoryName;
  select.value = no;
  selectBox.options.add(select);
  alert(message);
}

*/
