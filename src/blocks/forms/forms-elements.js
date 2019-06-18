const CUSTOM_SELECT_ARROW = () => {
  const xmlns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(xmlns, 'svg');
  const h = 4;
  const w = 6.7;
  const path = document.createElementNS(xmlns, "path");
  svg.setAttribute("viewBox", "0 0 " + w + " " + h);
  svg.setAttribute("width", w);
  svg.setAttribute("height", h);
  path.setAttribute('d', 'M6.5 1.1c.3-.3.3-.7 0-.9-.3-.3-.7-.3-.9 0L3.4 2.5 1.1.2C.8-.1.4-.1.2.2c-.3.3-.3.7 0 .9l2.7 2.7c.3.3.7.3.9 0l2.7-2.7z');
  svg.appendChild(path);
  svg.classList.add('choices-arrow');
  return svg;
};
const initSelect = () => {
  const choices = new Choices('[data-custom-select]', {
    searchEnabled: false,
    callbackOnInit: () => {
      const selects = [...document.querySelectorAll('.choices')];
      const arrow = CUSTOM_SELECT_ARROW();
      selects.forEach((select) => {
        select.appendChild(arrow);
      })
    }
  });
};

window.addEventListener('load', () => {
  // INIT ALL CUSTOM SELECTS
  document.querySelector(`[data-custom-select]`) ? initSelect() : false;

  // INIT ALL CUSTOM  UPLOAD FILES
  const fileInputs = [...document.querySelectorAll('[data-custom-fileupload]')];
  fileInputs.forEach((fileInput) => {
    const fileName = fileInput.nextElementSibling.querySelector('[data-choose-file]');
    fileInput.addEventListener('change', (e) => {
      const target = e.target.files[0] && e.target.files[0].name;
      const size = (e.target.files[0] && e.target.files[0].size / 1024 / 1024).toFixed(1);
      if (target) {
        fileName.innerHTML = `<span class="file-name">${target}</span><span class="file-size"> (${size} Mb)</span>
            <button type="button" class="file-reset" aria-label="удалить файл"></button>`;
        document.querySelector('.file-reset').addEventListener('click', (evt) => {
          e.target.value = ``;
          fileName.innerHTML = 'Прикрепить файл';
          evt.preventDefault();
        });
      } else {
        fileName.innerHTML = '';
      }
    })
  })
});

