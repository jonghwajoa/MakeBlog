class Post {
  constructor() {
    this.listData;
    this.postArea = document.getElementById('post-area');
  }

  async listInit() {
    let tagQuery = this.getQueryStringValue('tag').trim();

    if (!(await this.getAllPost())) return;
    this.showAllBtnEvent();

    let drawData = this.listData;
    if (tagQuery) {
      drawData = this.tagFilter(tagQuery);
    }

    let initPath = tagQuery ? `/posts?tag=${tagQuery}` : '/posts';
    this.drawPost(drawData);
    window.history.replaceState(drawData, '', initPath);
    window.onpopstate = function(e) {
      post.backEvent(e.state);
    };
  }

  /* 리스트 페이지 전체 게시글 보기 버튼 이벤트 */
  showAllBtnEvent() {
    const showAllPost = document.getElementById('showAllPost');
    showAllPost.addEventListener('click', () => {
      this.drawPost(this.listData);
      window.history.pushState(this.listData, '', '/posts');
    });
  }

  /**
   * @returns boolean
   */
  async getAllPost() {
    let reqeustListData;
    try {
      reqeustListData = await ajaxUtil.sendGetAjax(`/posts`);
      reqeustListData = JSON.parse(reqeustListData);
      this.listData = reqeustListData;
      return true;
    } catch (e) {
      alert(`Server Error\n${e.message}`);
      return false;
    }
  }

  /**
   * @param {Array} tagDataArray
   */
  drawPost(tagDataArray) {
    let postHtml = '';

    for (let post of tagDataArray) {
      postHtml += '<div class=post><div class=postTag><ul>';
      for (let tag of post.tag) {
        postHtml += `<li><a class='tagEvent'>&#8917;${tag.Tag.name}</a></li>`;
      }
      postHtml += '</ul></div>';
      postHtml += `<h3><a href=/posts/${post.no}>${post.title}</a></h3>`;
      postHtml += `<div class=postInfo><span>${post.created_at} | view ${post.count}</span></div></div>`;
    }
    this.postArea.innerHTML = postHtml;

    this.postTagEventInit();

    window.scrollTo(0, 0);
  }

  postTagEventInit() {
    const tagEvent = Array.from(document.getElementsByClassName('tagEvent'));
    for (let e of tagEvent) {
      e.addEventListener('click', () => {
        const tagName = e.innerHTML.substr(1);
        const filterData = this.tagFilter(tagName);
        this.drawPost(filterData);
        window.history.pushState(filterData, '', `/posts?tag=${tagName}`);
      });
    }
  }

  postRemoveAll() {
    let postArea = this.postArea;
    while (postArea.firstChild) {
      postArea.removeChild(postArea.firstChild);
    }
  }

  /**
   * @param {String} reqeustTagName
   * @returns Array
   */
  tagFilter(reqeustTagName) {
    return this.listData.filter(e => {
      for (let tag of e.tag) {
        if (tag.Tag.name == reqeustTagName) return true;
      }
    });
  }

  /**
   * @param {String} tagName
   */
  tagAreaEvent(tagName) {
    let filterData = this.tagFilter(tagName);
    this.drawPost(filterData);
    window.history.pushState(filterData, '', `/posts?tag=${tagName}`);
  }

  backEvent(prevState) {
    this.drawPost(prevState);
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

let post = new Post();
