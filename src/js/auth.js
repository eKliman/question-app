import { addToLocalStorage } from './question.js';

export function createModal() {
  const body = document.querySelector('body');
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('id', 'modal-auth');
  modal.innerHTML = `
    <div class="modal__inner" id="modal__inner">
      <button class="modal__close" id="modal__close" type="button">&times;</button>
      <form class="form auth-form" id="auth-form">
        <h3 class="form__title">Authorization</h3>
        <div class="form__input-block auth-email">
          <input type="email" class="form__input" id="auth__email" placeholder=" ">
          <label for="auth__email" class="form__label">* Email:</label>
        </div>
        <div class="form__input-block">
          <input type="password" class="form__input" id="auth__password" placeholder=" ">
          <label for="auth__password" class="form__label">* Password:</label>
        </div>
        <p class="error" id="modal-error"></p>
        <div class="form__submit auth-button-block"  id="auth-submit">
          <button type="submit" class="form__button" id="modal__button">Log in</button>
        </div>
      </form>
    </div>
  `;
  body.insertAdjacentElement('beforeend', modal);

  modal.addEventListener('click', function (event) {
    if (
      event.target.closest('#modal__close') ||
      !event.target.closest('#modal__inner')
    ) {
      modal.remove();
    }
  });
}

export async function authWithEmailAndPassword(email, password) {
  const apiKey = 'AIzaSyCNIHkd21B3iKFZQzyEGmAmpCEtS8toi10';
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (response.status == 200) {
    const data = await response.json();
    addToLocalStorage(data.idToken, 'token');
    return data.idToken;
  }

  throw new Error(response.status);
}
