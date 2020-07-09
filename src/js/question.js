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

  static renderList(content) {
    const list = document.getElementById('question__list');
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
  Question.renderList(content);
}

function toCard(question) {
  return `
  <div class="form__item">
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
  `;
}
