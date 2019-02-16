class Post {
  constructor() {
    this.curSubNo = 1;
    this.savePost = [];
    this.subPost = document.getElementsByClassName('subpost_element');
    this.editor;
    this.tags = [];
  }

  readInit() {
    this.content = document.getElementById('postContent');
    this.viewCount = document.getElementById('viewCount');
    this.date = document.getElementById('createDate');
    this.postTitle = document.getElementById('title');
    this.readEditor();
    let trimContent = this.content.value.trim();
    this.editor.setMarkdown(trimContent);
    this.subPostViewHandle();
  }

  subPostViewHandle() {
    let subPostLength = this.subPost.length;
    let contentSide = document.getElementsByClassName('content-side')[0];
    if (!subPostLength) {
      contentSide.style.display = 'none';
    } else {
      let subPostBtn = document.getElementById('subPostBtn');
      let subPostView = document.getElementsByClassName('sidepost')[0];
      let subPostBtnState = false;
      subPostBtn.addEventListener('click', () => {
        if (!subPostBtnState) {
          subPostView.style.display = 'block';
        } else {
          subPostView.style.display = 'none';
        }
        subPostBtnState = !subPostBtnState;
      });

      let lastHeight = 0;
      window.addEventListener('scroll', () => {
        let curHeight = window.scrollY;
        if (curHeight > lastHeight) {
          contentSide.style.display = 'none';
          subPostView.style.display = 'none';
          subPostBtnState = false;
        } else {
          contentSide.style.display = 'block';
        }
        lastHeight = curHeight;
      });
    }
  }

  writeInit() {
    this.postTitle = document.getElementById('title');
    this.categorySelect = document.getElementById('category-select');
    this.deleteSelect = document.getElementById('category-delete');
    this.categoryAdd = document.getElementById('category-add');
    this.tag = document.getElementById('tag');
    this.writeEditor();

    let tagAddBtn = document.getElementById('tagAddBtn');
    let tagAddName = document.getElementById('tagAddName');

    tagAddBtn.addEventListener('click', e => {
      this.addTag(tagAddName.value);
    });
  }

  addTag(requestTagName) {
    if (!requestTagName) {
      alert('공백은 추가할 수 없습니다.');
      return;
    }

    if (requestTagName.length > 50) {
      alert('TAG의 최대길이는 50입니다.');
      return;
    }

    let tags = this.tags;
    for (let e of tags) {
      if (e == requestTagName) {
        alert('이미 추가된 TAG 입니다.');
        return;
      }
    }
    tags.push(requestTagName);

    let tagE = document.createElement('span');
    tagE.className = 'tag-item';
    tagE.innerText = requestTagName;
    tagE.style.marginRight = '5px';

    tagE.addEventListener('click', () => {
      tagE.remove();
    });
    this.tag.append(tagE);
  }

  updateInit() {
    this.content = document.getElementById('content-hidden');
    this.postTitle = document.getElementById('title');
    this.tag = document.getElementById('tag');
    this.categorySelect = document.getElementById('category-select');
    this.writeEditor();
    this.editor.setMarkdown(this.content.value.trim());

    if (this.tag) {
      let tagVal = this.tag.value.split(' ');
      tagVal.shift();

      this.tag.value = tagVal.map(item => item.substr(1, item.length)).join(' ');
    }
  }

  async submit() {
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

    let createResult;
    try {
      createResult = await ajaxUtil.sendPostAjax('/posts/', params);
      location.href = `/posts/${JSON.parse(createResult).no}`;
    } catch (e) {
      alert(`작성 실패\n${e.responseText}`);
    }
  }

  async getContent(postNo, subNo = 1) {
    let reqeustPost;
    if (this.savePost[subNo]) {
      reqeustPost = this.savePost[subNo];
    } else {
      try {
        reqeustPost = await ajaxUtil.sendGetAjax(`/posts/${postNo}/${subNo}`);
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
    this.editor.setValue(content.trim());

    window.history.pushState(reqeustPost, null, `/posts/${postNo}/${subNo}`);

    this.curSubNo = subNo;

    if (!this.savePost[subNo]) {
      this.savePost[subNo] = { ...reqeustPost };
    }
    window.scrollTo(0, 10);
  }

  async deletePost(postNo) {
    let message = '서브게시글을 삭제하시겠습니까?';
    let url = `/posts/${postNo}/${this.curSubNo}`;
    let redirect = `/posts/${postNo}`;

    if (this.curSubNo === 1) {
      message = '게시글을 삭제하시겠습니까..??\n서브게시글도 전부 삭제됩니다.';
      url = `/posts/${postNo}`;
      redirect = '/posts';
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
  }

  async updateView(postNo) {
    let path = `/posts/${postNo}/${this.curSubNo}/edit`;
    if (this.curSubNo === 1) {
      path = `/posts/${postNo}/edit`;
    }
    location.href = path;
  }

  async submitSub(postNo) {
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
      await ajaxUtil.sendPostAjax(`/posts/${postNo}`, params);
      location.href = `/posts/${postNo}`;
    } catch (e) {
      alert(`작성 실패\n${e.responseText}`);
    }
  }

  async update(postNo) {
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

    let url = `/posts/${postNo}`;

    try {
      await ajaxUtil.sendPutAjax(url, params);
      location.href = `/posts/${postNo}`;
    } catch (e) {
      alert(`업데이트 실패\n${e.responseText}`);
    }
  }

  async updateSub(postNo, subNo) {
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

    let url = `/posts/${postNo}/${subNo}`;

    try {
      await ajaxUtil.sendPutAjax(url, params);
      location.href = `/posts/${postNo}/${subNo}`;
    } catch (e) {
      alert(`업데이트 실패\n${e.responseText}`);
    }
  }

  /**
   * @deprecated
   */
  async addCategory() {
    let requestCategoryName = this.categoryAdd.value;

    let result;
    try {
      result = await ajaxUtil.sendPostAjax('/posts/category/', { requestCategoryName });
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
  }

  /**
   * @deprecated
   */
  async deleteCategory() {
    let deleteSelect = this.deleteSelect;

    let reqeustDeleteCategoryName = deleteSelect.value;

    try {
      await ajaxUtil.sendDeleteAjax(`/posts/category/${reqeustDeleteCategoryName}`);
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
  }

  backLoadContent(prevState) {
    if (!prevState) {
      location.reload();
      return;
    }
    let { content, title, count, created_at } = prevState;
    this.date.innerHTML = `${created_at}`;
    this.viewCount.innerHTML = `${count}`;
    this.postTitle.innerHTML = title;
    this.editor.setValue(content.trim());
  }

  readEditor() {
    this.editor = new tui.Editor({
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

  writeEditor() {
    this.editor = new tui.Editor({
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
            return cb(`https://weknowjs.xyz/images/${result}`);
          } catch (e) {
            alert(e.statusText);
          }
        },
      },
    });
  }
}

post = new Post();
