const Post = (() => {
  function Post() {
    this.curSubNo = 1;
    // this.mapSavePost = new Map();
    this.savePost = [];
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

    let subPostLength = document.getElementsByClassName('subpost_element').length;

    if (!subPostLength) {
      document.getElementsByClassName('content-side')[0].style.display = 'none';
    }
  };

  Post.prototype.writeInit = function() {
    this.postTitle = document.getElementById('title');
    this.categorySelect = document.getElementById('category-select');
    this.deleteSelect = document.getElementById('category-delete');
    this.categoryAdd = document.getElementById('category-add');
    this.tag = document.getElementById('tag');
    this.editor = writeEditor();
  };

  Post.prototype.updateInit = function() {
    this.content = document.getElementById('hiddenContent');
    this.postTitle = document.getElementById('title');
    this.tag = document.getElementById('tag');
    this.categorySelect = document.getElementById('category-select');
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
    const category = this.categorySelect;
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
  Post.prototype.getContent = async function(postNo, subNo = 1) {
    let reqeustPost;
    if (this.savePost[subNo]) {
      reqeustPost = this.savePost[subNo];
    } else {
      try {
        reqeustPost = await ajaxUtil.sendGetAjax(`/post/${postNo}/${subNo}`);
        console.log(reqeustPost);
        reqeustPost = JSON.parse(reqeustPost);
      } catch (e) {
        alert(`Server Error(${e.status})`);
        return;
      }
    }
    let { content, title, count, created_at } = reqeustPost;

    this.date.innerHTML = `${created_at}`;
    this.viewCount.innerHTML = `${count}`;
    this.postTitle.innerHTML = title;
    this.headTitle.innerHTML = `WeKnowJS ${title}`;
    this.editor.setValue(content.trim());
    window.history.replaceState(null, '', `/post/${postNo}/${subNo}`);
    this.curSubNo = subNo;

    if (!this.savePost[subNo]) {
      this.savePost[subNo] = { ...reqeustPost };
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
    const category = this.categorySelect;
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

  Post.prototype.addCategory = async function() {
    let requestCategoryName = this.categoryAdd.value;

    let result;
    try {
      result = await ajaxUtil.sendPostAjax('/post/category/', { requestCategoryName });
    } catch (e) {
      alert(`${e.message}`);
      return;
    }

    let newSelect = document.createElement('option');
    let newSelect2 = document.createElement('option');
    let { no, message } = JSON.parse(result);

    newSelect.text = requestCategoryName;
    newSelect.value = no;
    newSelect2.text = requestCategoryName;
    newSelect2.value = no;
    this.categorySelect.options.add(newSelect);
    this.deleteSelect.options.add(newSelect2);
    alert(message);
  };

  Post.prototype.deleteCategory = async function() {
    let deleteSelect = this.deleteSelect;

    let reqeustDeleteCategoryName = deleteSelect.value;

    try {
      await ajaxUtil.sendDeleteAjax(`/post/category/${reqeustDeleteCategoryName}`);
    } catch (e) {
      alert(`${e.message}`);
      return;
    }

    for (let i = 0; i < deleteSelect.length; i++) {
      if (deleteSelect.options[i].value == reqeustDeleteCategoryName) {
        deleteSelect.remove(i);
        this.categorySelect.remove(i);
      }
    }

    alert('카테고리 삭제 성공');
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
