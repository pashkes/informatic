
(function () {

  const burgerButton = document.querySelector('.js-toggle-menu');
  const submenus = document.querySelectorAll('.js-submenu');
  const CLASS_MENU_OPENED = 'menu-is-opened';
  const overlay = document.querySelector('.overlay');
  const navItems = document.querySelectorAll('a');

  const onClickToggleMainMenu = () => {
    burgerButton.addEventListener('click', function () {
      modals.close();
      document.body.classList.toggle(CLASS_MENU_OPENED);
      let expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);

      if (!expanded) {
        window.addEventListener('keydown', onKeyDownWindowHandler, true);
        document.addEventListener('click', handlerClickOutsideMenu, true);
        overlay.classList.add('show');
      } else {
        window.removeEventListener('keydown', onKeyDownWindowHandler, true);
        document.removeEventListener('click', handlerClickOutsideMenu, true);
        removeOverlay();
      }
    });
  };

  const onKeyDownWindowHandler = (evt) => {
    const ENTER_CODE = 27;
    if (evt.keyCode === ENTER_CODE) {
      document.body.classList.remove(CLASS_MENU_OPENED);
      burgerButton.setAttribute('aria-expanded', 'false');
      removeOverlay();
      document.removeEventListener('keydown', onKeyDownWindowHandler, false);
    }
  };

  const handlerClickOutsideMenu = (evt) => {
    if (evt.target.closest('.header__body') || evt.target.closest('.js-toggle-menu')) {
      return false;
    }
    removeOverlay();
    document.body.classList.remove(CLASS_MENU_OPENED);
    burgerButton.setAttribute('aria-expanded', 'false');
  };

  const onClickSubmenuToggle = () => {
    for (let i = 0; i < submenus.length; i++) {
      submenus[i].addEventListener('click', function (evt) {
        evt.preventDefault();
        (this.closest('li')).classList.toggle('is-expanded');
        let expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
      });
    }
  };

  const removeOverlay = () => {
    if (!overlay) return false;
    overlay.classList.remove('show');
  };
  const closeMenuAfterClickLink = () => {
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        removeOverlay();
        document.body.classList.remove(CLASS_MENU_OPENED);
        burgerButton.setAttribute('aria-expanded', 'false');
      })
    })
  };

  burgerButton && onClickToggleMainMenu();
  submenus && onClickSubmenuToggle();
  closeMenuAfterClickLink();
})();
