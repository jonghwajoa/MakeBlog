class Nav {
  constructor() {
    this.nav = document.getElementsByTagName('nav')[0];
    this.mMenu = document.getElementsByClassName('mMenu')[0];
    this.pcMenu = document.getElementsByClassName('pcMenu')[0];
    this.moveTop = document.getElementById('moveTop-btn');
    this.navBaseHeight = 70;
    this.lastHeight = 0;
    this.mNavState = false;
    this.curHeight = 0;
    this.welcomeMessage();
    this.eventInit();
  }

  eventInit() {
    this.moveTop.addEventListener('click', () => {
      window.scrollTo(0, 0);
      this.moveTop.style.display = 'none';
    });

    this.mMenu.addEventListener('click', () => {
      if (this.mNavState) {
        this.pcMenu.style.display = 'none';
      } else {
        this.pcMenu.style.display = 'block';
      }
      this.mNavState = !this.mNavState;
    });

    window.addEventListener('resize', () => {
      this.exitMmenu();
    });

    window.addEventListener('scroll', () => {
      let curHeight = window.scrollY;
      let lastHeight = this.lastHeight;
      let nav = this.nav;
      let moveTop = this.moveTop;
      this.exitMmenu();
      if (curHeight > this.navBaseHeight && curHeight > lastHeight) {
        nav.style.display = 'none';
      } else {
        nav.style.display = 'block';
      }

      if (curHeight > lastHeight) {
        moveTop.style.display = 'none';
      } else {
        if (curHeight > 500) {
          moveTop.style.display = 'block';
        }
      }
      this.lastHeight = curHeight;
    });
  }

  // 스크롤 음직이거나 브라우저 너비 바뀌면 toggle false 초기화
  exitMmenu() {
    this.mNavState = false;
    this.pcMenu.style.display = 'none';
    if (this.getWidth() > 780) {
      this.pcMenu.style.display = 'block';
    }
  }

  // 브라우저 width
  getWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth,
    );
  }

  welcomeMessage() {
    console.log('%cWELCOME BLOG', 'font:5em Arial;color:#EC6521;font-weight:bold');
  }
}

new Nav();
