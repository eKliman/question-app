import { header } from './index.js';
let errorMessage = '';

export function validation(target) {
  let min, max;
  if (/input$/.test(target.id)) {
    min = 10;
    max = 256;
  } else if (/password$/.test(target.id)) {
    min = 6;
    max = 30;
  } else if (/email$/.test(target.id)) {
    min = 0;
    max = 30;
  } else {
    min = 3;
    max = 30;
  }

  checkInputValueLength(target, min, max);

  if (
    (/email$/.test(target.id) && target.value) ||
    /auth__email$/.test(target.id)
  ) {
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target.value)
      ? (errorMessage = `Email is not valid`)
      : '';
  }

  target.parentElement.querySelector('p').textContent = errorMessage;

  if (errorMessage) {
    target.style.borderBottom = '2px solid #ff0000';
    return false;
  } else {
    target.style.borderBottom = '2px solid #8788a7';
    return true;
  }
}

function checkInputValueLength(target, min, max) {
  const contentLength = target.value.trim().length;
  if (contentLength < min) {
    errorMessage = `${target.name} must be at least ${min} characters`;
  } else if (contentLength > max) {
    errorMessage = `${target.name} must be no more than ${max} characters`;
  } else {
    errorMessage = '';
  }
}

export function createAdminButtons() {
  header.insertAdjacentHTML(
    'beforeend',
    `
    <div class="header__admin-buttons" id="admin-buttons">
      <span class="header__admin" id="header__admin">Administrator</span>
      <button class="header__btn header__btn-update" id="header__btn-update" title="Update questions">    
      <svg class="header__icon-update" id="icon-refresh" width="30" height="30">
        <use xlink:href="img/icons.svg#refresh"></use>
      </svg>
      <span class="header__text-update" id="text-update">Update questions</span>
      </button>
      <button class="header__btn header__btn-out" id="header__btn-out"  title="Logout">
        <svg class="header__icon-logout" id="icon-logout" width="30" height="30">
          <use xlink:href="img/icons.svg#logOut"></use>
        </svg>
        <span class="header__text-logout" id="text-logout">Log out</span>
      </button>
    </div>
  `
  );
}

export function sortQuestions(questions, sortType) {
  if (sortType == 'dateUp') {
    return questions.sort((a, b) => b.date - a.date);
  } else if (sortType == 'dateDown') {
    return questions.sort((a, b) => a.date - b.date);
  } else if (sortType == 'nameUp') {
    return questions.sort((a, b) => {
      b.name - a.name;
      let nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase();
      if (nameA > nameB) return -1;
      if (nameA < nameB) return 1;
      return 0;
    });
  } else if (sortType == 'nameDown') {
    return questions.sort((a, b) => {
      a.name - b.name;
      let nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }
}

export function switchSort(select, token) {
  token
    ? (select.innerHTML = `
    <option value="dateUp" selected>Date &#11014;</option>
    <option value="dateDown">Date &#11015;</option>
    <option value="nameUp">Name &#11014;</option>
    <option value="nameDown">Name &#11015;</option>`)
    : (select.innerHTML = `
    <option value="dateUp" selected>Date &#11014;</option>
    <option value="dateDown">Date &#11015;</option>`);
}
