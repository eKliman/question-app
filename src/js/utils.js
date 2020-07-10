import { header } from './index.js';

export function validation(value, min, max) {
  const question = value.trim().length;
  let valid = question >= min && question <= max;
  return valid;
}

export function createAdminButtons() {
  header.insertAdjacentHTML(
    'beforeend',
    `
    <span class="header__admin" id="header__admin">Administrator</span>
    <button class="header__btn header__btn-out" id="header__btn-out">Log out</button>
    <button class="header__btn" id="header__btn-update">Update questions</button>
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
    <option value="dateUp" defaultSelected selected="true">Date &#11014;</option>
    <option value="dateDown">Date &#11015;</option>
    <option value="nameUp">Name &#11014;</option>
    <option value="nameDown">Name &#11015;</option>`)
    : (select.innerHTML = `
    <option value="dateUp" defaultSelected selected="true">Date &#11014;</option>
    <option value="dateDown">Date &#11015;</option>`);
}
