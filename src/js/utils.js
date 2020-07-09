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
