const ajaxUtil = {
  /**
   * @param {String} url
   * @returns responseText
   */
  sendGetAjax(url) {
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

  /**
   * @param {String} url
   * @param {Object} params
   * @returns responseText
   */
  sendPostAjax(url, params) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status <= 210) {
          resolve(xhr.responseText);
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

  /**
   * @param {String} url
   * @param {Object} params
   * @returns responseText
   */
  sendPutAjax(url, params) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        if (xhr.status === 204) {
          resolve(xhr.responseText);
        } else {
          reject({ status: xhr.status, message: xhr.responseText });
        }
      };
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(params));
      xhr.onerror = () => reject(req.status);
    });
  },

  /**
   * @param {String} url
   * @returns {Boolean}
   */
  sendDeleteAjax(url) {
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

  saveFileAjax(photo) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('photo', photo);
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr);
        }
      };
      xhr.open('POST', '/post/file', true);
      xhr.send(formData);
      xhr.onerror = () => reject(req.status);
    });
  },
};
