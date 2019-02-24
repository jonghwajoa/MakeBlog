class Post {
  constructor() {
    this.curSubNo = 1;
    this.savePost = [];
    this.subPost = document.getElementsByClassName('subpost_element');
    this.editor;
    this.tags = [];
    this.listData;
  }

  readInit() {
    this.content = document.getElementById('postContent');
    this.viewCount = document.getElementById('viewCount');
    this.date = document.getElementById('createDate');
    this.postTitle = document.getElementById('title');
    this.editor = new Editor().readEditor('content-text');
    let trimContent = this.content.value.trim();
    this.editor.setMarkdown(trimContent);
    this.subPostViewHandle();
  }

  writeInit() {
    this.postTitle = document.getElementById('title');
    this.tag = document.getElementById('tag');
    this.editor = new Editor().writeEditor('content-text');
    this.tagEvent();
    this.writeSubmit();
  }

  updateInit() {
    this.content = document.getElementById('content-hidden');
    this.editor = new Editor().writeEditor('content-text');
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
}

post = new Post();
