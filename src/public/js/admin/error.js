class ErrorPage {
  constructor() {
    this.eventInit();
  }

  eventInit() {
    const bodyContent = document.getElementsByClassName('error-body-content');

    for (const e of bodyContent) {
      e.addEventListener('click', event => {
        if (event.target.className === 'error-body-content') {
          event.target.className += 'click';
        } else {
          event.target.className = 'error-body-content';
        }
      });
    }

    const checkBtn = document.getElementsByClassName('check-btn');

    for (const e of checkBtn) {
      e.addEventListener('click', async event => {
        const id = event.target.id.substr(1);
        const targetSelectTag = document.getElementById(`s${id}`);
        console.log(targetSelectTag);
        const params = {
          no: id,
          isCheck: targetSelectTag.value,
        };

        let result;
        try {
          result = await ajaxUtil.sendPatchAjax(`/api/admin/error/errorCheck`, params);
        } catch (e) {
          alert(e);
          return;
        }

        alert('업데이트 완료');
      });
    }
  }
}

const errorPage = new ErrorPage();
