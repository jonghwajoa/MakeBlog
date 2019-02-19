class Post {
  constructor() {
    this.curSubNo = 1;
    this.savePost = [];
    this.subPost = document.getElementsByClassName('subpost_element');
    this.editor;
    this.tags = [];
    this.listData;
  }

  async listInit() {
    this.postInsertArea = document.getElementById('post-area');
    let tagQuery = this.getQueryStringValue('tag').trim();

    if (tagQuery) {
      this.tagFilter(tagQuery);
    } else {
      this.tagFilter('notFilter');
    }

    let initPath = tagQuery ? `/posts?tag=${tagQuery}` : '/posts';
    window.history.replaceState(this.listData, '', initPath);
  }

  /* 리스트 페이지 전체 게시글 보기 버튼 이벤트 */
  listPageEventInit() {
    const showAllPost = document.getElementById('showAllPost');
    showAllPost.addEventListener('click', () => {
      this.tagFilter('notFilter');
      window.history.pushState(this.listData, '', '/posts');
    });
  }

  /**
   * @returns boolean
   */
  async listPageGetDate() {
    let reqeustListData;
    try {
      reqeustListData = await ajaxUtil.sendGetAjax(`/posts`);
      reqeustListData = JSON.parse(reqeustListData);
      this.listData = reqeustListData;
      return true;
    } catch (e) {
      alert(`Server Error(${e.message})`);
      return false;
    }
  }

  /**
   * @param {Array} requestTagDataArray
   */
  listPageDrawPost(requestTagDataArray) {
    let postInsert = this.postInsertArea;
    let postHtml = '';

    for (let post of requestTagDataArray) {
      postHtml += '<div class=post><div class=postTag><ul>';
      for (let tag of post.tag) {
        postHtml += `<li><a class='tagEvent'>&#8917;${tag.Tag.name}</a></li>`;
      }
      postHtml += '</ul></div>';
      postHtml += `<h3><a href=/posts/${post.no}>${post.title}</a></h3>`;
      postHtml += `<div class=postInfo><span>${post.created_at} | view ${post.count}</span></div></div>`;
    }
    postInsert.innerHTML += postHtml;

    const tagEvent = Array.from(document.getElementsByClassName('tagEvent'));
    for (let e of tagEvent) {
      e.addEventListener('click', () => {
        this.tagFilter(e.innerHTML.substr(1));
      });
    }
    window.scrollTo(0, 0);
  }

  listPagePostAllRemove() {
    let postInsert = this.postInsertArea;
    while (postInsert.firstChild) {
      postInsert.removeChild(postInsert.firstChild);
    }
  }

  /**
   * @param {String} reqeustTagName
   * @returns Array
   */
  listPagetagFilter(reqeustTagName) {
    return this.listData.filter(e => {
      for (let tag of e.tag) {
        if (tag.Tag.name == reqeustTagName) return true;
      }
    });

    // window.history.pushState(requestTagData, '', `/posts?tag=${reqeustTag}`);
    // this.drawListView(requestTagData);
  }

  backLoadList(prevState) {
    console.log(prevState);
    this.postInsertArea.innerHTML = prevState;
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

  writeInit() {
    this.postTitle = document.getElementById('title');
    this.tag = document.getElementById('tag');
    this.writeEditor();
    this.tagEvent();
    this.writeSubmit();
  }

  updateInit() {
    this.content = document.getElementById('content-hidden');
    this.writeEditor();
    this.editor.setMarkdown(this.content.value.trim());
    this.postTitle = document.getElementById('title');
    this.tag = document.getElementById('tag');
    this.tagEvent();

    let tagArray = Array.from(document.getElementsByClassName('hiddenTag'));
    for (let e of tagArray) {
      this.addTag(e.value);
    }
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

  tagEvent() {
    let tagAddBtn = document.getElementById('tagAddBtn');
    let tagAddName = document.getElementById('tagAddName');

    tagAddName.addEventListener('keypress', e => {
      const key = e.which || e.keyCode;
      if (key === 13) {
        this.addTag(tagAddName.value.trim());
      }
    });

    tagAddBtn.addEventListener('click', () => {
      this.addTag(tagAddName.value.trim());
    });
  }

  writeSubmit() {
    let submitBtn = document.getElementById('submit');

    submitBtn.addEventListener('click', async () => {
      const title = this.postTitle.value;
      const content = this.editor.getMarkdown().trim();
      let tagsElement = Array.from(document.getElementsByClassName('tag-item'));
      let tags = [];

      for (let tag of tagsElement) {
        tags.push(tag.innerText.trim());
      }

      if (!title) {
        alert('제목을 입력하세요..');
        return false;
      }

      if (!content) {
        alert('내용을 입력하세요.');
        return false;
      }

      if (!tags.length) {
        alert('TAG를 입력하세요.');
        return false;
      }

      const params = {
        title,
        tags,
        content,
      };

      let postCreateResult;
      try {
        postCreateResult = await ajaxUtil.sendPostAjax('/posts/', params);
        location.href = `/posts/${JSON.parse(postCreateResult).no}`;
      } catch (e) {
        alert(e.message);
      }
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
      this.tags = this.tags.filter(e => e != requestTagName);
    });
    this.tag.append(tagE);
    tagAddName.value = '';
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
      alert(`작성 실패\n${e.message}`);
    }
  }

  async update(postNo) {
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
      tags: this.tags,
    };

    let url = `/posts/${postNo}`;
    try {
      await ajaxUtil.sendPutAjax(url, params);
      location.href = `/posts/${postNo}`;
    } catch (e) {
      alert(`업데이트 실패\n${e.message}`);
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
      alert(`업데이트 실패\n${e.message}`);
    }
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
      el: document.getElementById('content-content'),
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

  getQueryStringValue(key) {
    return decodeURIComponent(
      window.location.search.replace(
        new RegExp('^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'),
        '$1',
      ),
    );
  }
}

post = new Post();
