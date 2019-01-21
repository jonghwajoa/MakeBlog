let ajaxUtil = {
  getPostContent(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject({ status: xhr.status, message: xhr.responseText });
        }
      };

      xhr.open('GET', url, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send();
      xhr.onerror = () => reject(req.status);
    });
  },

  sendPostAjax(url, params) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 201) {
          resolve(true);
        } else {
          reject({ status: xhr.status, message: xhr.responseText });
        }
      };
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(params));
      xhr.onerror = () => reject(req.status);
    });
  },

  deletePost(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.status === 204) {
          resolve(true);
        } else {
          reject({ status: xhr.status, message: xhr.responseText });
        }
      };

      xhr.open('DELETE', url, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send();
      xhr.onerror = () => reject(req.status);
    });
  },
};
