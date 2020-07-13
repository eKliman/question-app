// import { createModal } from './auth.js';
import { validation } from './utils.js';
import { createAdminButtons } from './utils.js';
import { sortQuestions } from './utils.js';
import { switchSort } from './utils.js';
import { Question } from './question';
import { token } from './question';
import { renderWithoutAuth } from './question';
import { removeFromLocalStorage } from './question';
import { renderAfterDelete } from './question';
import { getDataFromLocalStorage } from './question';
import '../../node_modules/normalize.css/normalize.css';
import '../scss/fonts.scss';
import '../scss/style.scss';
import '../scss/media.scss';

const questionForm = document.getElementById('question-form');
const questionInput = questionForm.querySelector('#question__input');
const name = questionForm.querySelector('#question__name');
const email = questionForm.querySelector('#question__email');
const askBtn = questionForm.querySelector('#question__button');
const allQuestionsBtn = document.getElementById('header__btn');
const listTitle = document.getElementById('list-title');
const questionInputsClearBtn = document.getElementById('question__clear');
const select = document.getElementById('select');
export const list = document.getElementById('question__list');
export const header = document.getElementById('header');

function submitFormHandler(event) {
  event.preventDefault();

  if (
    validation(questionInput) &&
    validation(name) &&
    (validation(email) || !email.value)
  ) {
    const question = {
      // date: new Date().toJSON(),
      date: Date.now(),
      text: questionInput.value.trim(),
      name: name.value.trim(),
      email: email.value || '',
    };
    askBtn.disabled = true;

    // Async request to server to save question
    Question.create(question).then(() => {
      clearQuestionFormInputs();
      renderWithoutAuth();
      askBtn.disabled = false;
    });
  }
}

function openModal() {
  import('./auth.js').then((auth) => {
    auth.createModal();
    const authForm = document.getElementById('auth-form');
    authForm.addEventListener('focusout', (event) => {
      if (event.target.closest('input')) {
        checkNotEmpty(event.target);
        validation(event.target);
      }
    });
    authForm.addEventListener('submit', authFormHandler), { once: true };
  });
}

function clearAuthInputs() {
  const email = document.querySelector('#auth__email');
  const password = document.querySelector('#auth__password');
  if (email) {
    email.value = '';
    checkNotEmpty(email);
  }
  if (password) {
    password.value = '';
    checkNotEmpty(password);
  }
}

function authFormHandler(event) {
  event.preventDefault();
  const emailInput = event.target.querySelector('#auth__email');
  const passwordInput = event.target.querySelector('#auth__password');
  if (validation(emailInput) && validation(passwordInput)) {
    document.getElementById('modal__button').disabled = true;
    const email = emailInput.value;
    const password = passwordInput.value;
    clearAuthInputs();
    import('./auth.js').then((auth) => {
      auth
        .authWithEmailAndPassword(email, password)
        .catch(console.error)
        .then(Question.fetch)
        .then(renderAfterAuth);
    });
  }
}

function renderAfterAuth(content) {
  const modalError = document.getElementById('modal-auth-error');
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
    Question.renderList(sortQuestions(content, select.value));
  }
}

function adminButtonsHandler() {
  header.addEventListener('click', (event) => {
    if (event.target.closest('#header__btn-out')) {
      removeFromLocalStorage('token');
      renderWithoutAuth();
      switchToUserInterface();
    } else if (event.target.closest('#header__btn-update')) {
      Question.fetch(token).then((content) => {
        Question.renderList(sortQuestions(content, select.value));
      });
    }
  });
}

function switchToUserInterface() {
  header.querySelector('#admin-buttons')
    ? header.querySelector('#admin-buttons').remove()
    : '';
  switchSort(select, false);
  allQuestionsBtn.classList.remove('hidden');
  questionForm.classList.remove('hidden');
  listTitle.textContent = 'Your latest questions';
}

function switchToAdminInterface() {
  allQuestionsBtn.classList.add('hidden');
  questionForm.classList.add('hidden');
  listTitle.textContent = 'List of questions';
  switchSort(select, true);
  createAdminButtons();
  adminButtonsHandler();
}

export function checkNotEmpty(target) {
  if (target.value) {
    if (!target.classList.contains('not-empty')) {
      target.classList.add('not-empty');
    }
  } else {
    target.classList.remove('not-empty');
  }
}

function clearQuestionFormInputs() {
  const questionFormInputs = questionForm.querySelectorAll('.form__input');
  questionFormInputs.forEach((element) => {
    element.value = '';
    checkNotEmpty(element);
  });
}

function changeContent() {
  window.innerWidth <= 450
    ? (allQuestionsBtn.textContent = 'All')
    : (allQuestionsBtn.textContent = 'All questions');
}

window.addEventListener('load', () => {
  clearQuestionFormInputs();
  changeContent();
  Question.checkIsToken();
  switchSort(select, token);
  if (token) {
    Question.fetch(token).then(renderAfterAuth);
  } else {
    renderWithoutAuth();
  }
});
questionForm.addEventListener('submit', submitFormHandler);
questionForm.addEventListener('focusout', (event) => {
  if (event.target.closest('.form__input')) {
    checkNotEmpty(event.target);
    validation(event.target);
  }
});
questionInputsClearBtn.addEventListener('click', clearQuestionFormInputs);
allQuestionsBtn.addEventListener('click', openModal);
list.addEventListener('click', (event) => {
  if (event.target.closest('.form__item-delete')) {
    renderAfterDelete(event.target.dataset.id);
    Question.deleteItem(event.target);
  }
});
select.addEventListener('change', () => {
  Question.checkIsToken();
  if (token) {
    Question.fetch(token).then((data) => {
      Question.renderList(sortQuestions(data, select.value));
    });
  } else {
    const content = getDataFromLocalStorage('questions');
    Question.renderList(sortQuestions(content, select.value));
  }
});

window.addEventListener('resize', changeContent);
