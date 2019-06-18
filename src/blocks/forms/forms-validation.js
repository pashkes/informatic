
(function(){
  const forms = [...document.querySelectorAll('form')];

  const fieldValidation = (field) => {
    let err = false;
    let errMsg = '';
    const val = field.value;
    const errContainer = field.parentNode.querySelector('[data-error]');

    if (!val.length) {
      err = true;
      errMsg = errContainer.dataset.errorEmpty;
    }

    const pattern = field.getAttribute('pattern') && new RegExp(field.getAttribute('pattern'), 'g');

    if (val.length && pattern && !pattern.test(val)) {
      err = true;
      errMsg = errContainer.dataset.errorWrong;
    }

    const isRegisterPassword = field.getAttribute('type') === 'password' && field.dataset.registerPassword;

    if (err && !isRegisterPassword) {
      errContainer.innerText = errMsg;
      field.classList.add('error');
      return;
    }

    if (!isRegisterPassword) return;

    const mainPassword = field.closest('form').querySelector('[name="password"]');

    if (!mainPassword) return;

    const repeatPassword = field.closest('form').querySelector('[name="repeat-password"]');
    const mainPassErrConteiner = mainPassword.parentNode.querySelector('[data-error]');
    const repeatPassErrConteiner = repeatPassword.parentNode.querySelector('[data-error]');

    if (!mainPassword.value || !repeatPassword.value) {
      err = true;
      errMsg = errContainer.dataset.errorEmpty;
    }

    if (mainPassword.value !== repeatPassword.value) {
      err = true;
      errMsg = errContainer.dataset.errorWrong;
    }

    if (mainPassword.value === repeatPassword.value && !err) {
      mainPassword.classList.remove('error');
      repeatPassword.classList.remove('error');
    };

    if (err) {
      mainPassword.classList.add('error');
      repeatPassword.classList.add('error');
      mainPassErrConteiner.innerText = errMsg;
      repeatPassErrConteiner.innerText = errMsg;
    }
  }

  forms.forEach((form) => {
    const fields = [...form.querySelectorAll('[required]')];

    fields.forEach((field) => {
      field.addEventListener('focus', () => {
        field.classList.remove('error');
      });
      field.addEventListener('focusout', () => {
        fieldValidation(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      form.classList.add('was-validated');

      fields.forEach((field) => {
        fieldValidation(field);
      });

      // kludge for safari till it doesn't redraw UI after form submit
      if (form.querySelector('.error')) {
        form.querySelector('[type="submit"]').focus();
        return;
      }

      const url = 'php/send.php';
      const data = new FormData(form);

      fetch(url, {
        method: 'POST',
        body: data
      })
      .then(response => response.json())
      .then((data) => {
        success.click();
        setTimeout(() => {
          form.reset();
        }, 5000);
      })
      .catch(err => {
        console.error(err);
      });

    })
  })
})();