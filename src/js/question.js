import { list } from './index.js';
import { sortQuestions } from './utils.js';
export let token;

export class Question {
  static create(question) {
    return fetch('https://question-app-25e67.firebaseio.com/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        question.id = response.name;
        return question;
      })
      .then(addToLocalStorage)
      .then(Request.renderList);
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve('Wrong email or password!');
    }
    return fetch(
      `https://question-app-25e67.firebaseio.com/questions.json?auth=${token}`
    )
      .then((response) => response.json())
      .then((response) => {
        if (
          response &&
          response.error &&
          document.getElementById('modal-auth')
        ) {
          response.error;
        } else if (response && response.error) {
          return false;
        }
        return response
          ? Object.keys(response).map((key) => ({
              ...response[key],
              id: key,
            }))
          : [];
      });
  }

  static deleteItem(item) {
    const dataId = item.dataset.id;
    return fetch(
      `https://question-app-25e67.firebaseio.com/questions/${dataId}.json`,
      {
        method: 'DELETE',
      }
    );
  }

  static renderList(content) {
    let htmlList;

    if (token) {
      htmlList = content.length
        ? content.map(toCard).join('')
        : `<div>The list of questions is empty...</div>`;
    } else {
      htmlList = content.length
        ? content.map(toCard).join('')
        : `<div>You haven't asked any questions yet...</div>`;
    }

    list.innerHTML = htmlList;
  }

  static checkIsToken() {
    token = getDataFromLocalStorage('token')[0] || false;
  }
}

export function addToLocalStorage(question, key = 'questions') {
  let all;
  key === 'questions'
    ? (all = getDataFromLocalStorage('questions'))
    : (all = []);
  all.push(question);
  localStorage.setItem(key, JSON.stringify(all));
}

export function getDataFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

export function removeFromLocalStorage(key) {
  localStorage.removeItem(key);
}

export function renderWithoutAuth() {
  const content = getDataFromLocalStorage('questions');
  Question.renderList(sortQuestions(content, select.value));
}

export function renderAfterDelete(itemId) {
  Question.fetch(token).then((data) => {
    const Questions = data.filter((item) => item.id != itemId);
    Question.renderList(Questions);
  });
}

function toCard(question) {
  Question.checkIsToken();
  if (token) {
    return `
    <div class="form__item">
      <div class="form__item-body">
        <div class="form__item-date">
          ${new Date(question.date).toLocaleDateString()}
          ${new Date(question.date).toLocaleTimeString()}
        </div>
        <div class="form__item-text">${question.text}</div>
        <div class="form__item-author">
          <span class="form__author-name" id="form__author-name">${
            question.name || ''
          }</span>
          <span class="form__author-email" id="form__author-email">${
            question.email || ''
          }</span>
        </div>      
      </div>
      <div class="form__item-buttons">
        <button type="button" class="form__item-delete" data-id="${
          question.id
        }" title="Delete question">&times;</button>
      </div>
    </div>
    `;
  } else {
    return `
    <div class="form__item" data-id="${question.id}">
      <div class="form__item-body">
        <div class="form__item-date">
          ${new Date(question.date).toLocaleDateString()}
          ${new Date(question.date).toLocaleTimeString()}
        </div>
        <div class="form__item-text">${question.text}</div>
      </div>
    </div>
    `;
  }
}
