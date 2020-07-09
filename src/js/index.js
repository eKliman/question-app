// import { createModal } from './auth.js';
import { validation } from './utils.js';
import { createAdminButtons } from './utils.js';
import { Question } from './question';
import { token } from './question';
import { renderWithoutAuth } from './question';
import { removeFromLocalStorage } from './question';
import '../../node_modules/normalize.css/normalize.css';
import '../scss/fonts.scss';
import '../scss/style.scss';

const questionForm = document.getElementById('question-form');
const questionInput = questionForm.querySelector('#question__input');
const name = questionForm.querySelector('#question__name');
const email = questionForm.querySelector('#question__email');
const askBtn = questionForm.querySelector('#question__button');
const allQuestionsBtn = document.getElementById('header__btn');
const listTitle = document.getElementById('list-title');
const questionInputsClearBtn = document.getElementById('question__clear');
export const list = document.getElementById('question__list');
export const header = document.getElementById('header');

function submitFormHandler(event) {
  event.preventDefault();

  if (
    validation(questionInput.value, 10, 256) &&
    validation(name.value, 3, 30)
  ) {
    const question = {
      date: new Date().toJSON(),
      text: questionInput.value.trim(),
      name: name.value.trim(),
      email: email.value || '',
    };
    askBtn.disabled = true;

    // Async request to server to save question
    Question.create(question).then(() => {
      clearQuestionFormInputs();
      renderWithoutAuth();
    });
  }
}

function enableBtn() {
  if (
    validation(questionInput.value, 10, 256) &&
    validation(name.value, 3, 30)
  ) {
    askBtn.disabled = false;
  } else {
    askBtn.disabled = true;
  }
}

function openModal() {
  import('./auth.js').then((auth) => {
    auth.createModal();
    const authForm = document.getElementById('auth-form');
    authForm.addEventListener('input', (event) => {
      notEmpty(event.target);
    }),
      { once: true };
    authForm.addEventListener('submit', authFormHandler), { once: true };
  });
}

function clearAuthInputs() {
  const email = document.querySelector('#auth__email');
  const password = document.querySelector('#auth__password');
  if (email) {
    email.value = '';
    notEmpty(email);
  }
  if (password) {
    password.value = '';
    notEmpty(password);
  }
}

function authFormHandler(event) {
  event.preventDefault();
  document.getElementById('modal__button').disabled = true;
  const email = event.target.querySelector('#auth__email').value;
  const password = event.target.querySelector('#auth__password').value;
  clearAuthInputs();
  import('./auth.js').then((auth) => {
    auth
      .authWithEmailAndPassword(email, password)
      .catch(console.error)
      .then(Question.fetch)
      .then(renderAfterAuth);
  });
}

function renderAfterAuth(content) {
  const modalError = document.getElementById('modal-error');
  if (typeof content === 'string') {
    clearAuthInputs();
    document.getElementById('modal__button').disabled = false;
    modalError ? (modalError.textContent = content) : '';
  } else if (typeof content === 'boolean') {
    removeFromLocalStorage('token');
    renderWithoutAuth();
  } else {
    const modal = document.getElementById('modal-auth');
    modal ? modal.remove() : '';
    switchToAdminInterface();
    Question.renderList(content);
  }
}

function adminButtonsHandler() {
  header.addEventListener('click', (event) => {
    if (event.target.closest('#header__btn-out')) {
      removeFromLocalStorage('token');
      renderWithoutAuth();
      switchToUserInterface();
    } else if (event.target.closest('#header__btn-update')) {
      Question.fetch(token).then(Question.renderList);
    }
  });
}

function switchToUserInterface() {
  header.querySelector('#header__admin').remove();
  header.querySelector('#header__btn-out').remove();
  header.querySelector('#header__btn-update').remove();
  allQuestionsBtn.classList.remove('hide');
  questionForm.classList.remove('hide');
  listTitle.textContent = 'Your latest questions';
}

function switchToAdminInterface() {
  allQuestionsBtn.classList.add('hide');
  questionForm.classList.add('hide');
  listTitle.textContent = 'List of questions';
  createAdminButtons();
  adminButtonsHandler();
}

export function notEmpty(target) {
  if (target.value) {
    if (!target.classList.contains('not-empty')) {
      target.classList.add('not-empty');
    }
  } else {
    target.classList.remove('not-empty');
  }
}

function clearQuestionFormInputs() {
  const questionFormInputs = questionForm.querySelectorAll('input');
  questionFormInputs.forEach((element) => {
    element.value = '';
    notEmpty(element);
  });
}

window.addEventListener('load', () => {
  clearQuestionFormInputs();
  Question.checkIsToken();
  if (token) {
    Question.fetch(token).then(renderAfterAuth);
  } else {
    renderWithoutAuth();
  }
});
questionForm.addEventListener('submit', submitFormHandler);
questionForm.addEventListener('input', (event) => {
  notEmpty(event.target);
  enableBtn();
});
questionInputsClearBtn.addEventListener('click', clearQuestionFormInputs);
allQuestionsBtn.addEventListener('click', openModal);
list.addEventListener('click', (event) => {
  if (event.target.closest('.form__item-delete')) {
    Question.deleteItem(event.target);
  }
});
