import { put, delay } from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions/index';

// kind a function
// function* is generator, function that can be executed incremently
export function* logoutSaga(action) {
  yield localStorage.removeItem('token');
  yield localStorage.removeItem('expirationDate');
  yield localStorage.removeItem('userId');

  yield put(actions.logoutSucceed());
}

export function* checkoutTimeoutSaga(action) {
  console.log('Generator'+action.expirationTime);
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}

export function* authUserSaga(action) {
  yield put(actions.authStart());
  // dispatch(authStart());
  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  }
  let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBKmaRb3SjSzaJkjvtq6LNRelqs7S-jzBE';
  if (!action.isSignup) {
    url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBKmaRb3SjSzaJkjvtq6LNRelqs7S-jzBE';
  }
  const response = yield axios.post(url, authData)
    // .then(response => {
    // console.log(response);
    try {
      const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);
      yield localStorage.setItem('token', response.data.idToken);
      yield localStorage.setItem('expirationDate', expirationDate);
      yield localStorage.setItem('userId', response.data.localId);

      yield put(actions.authSuccess(response.data.idToken, response.data.localId));
      yield put(actions.checkAuthTimeout(response.data.expiresIn));
      // dispatch(authSuccess(response.data.idToken, response.data.localId));
      // dispatch(checkAuthTimeout(response.data.expiresIn));
      // })
    }
    catch(err) {
      console.log(err);
      // dispatch(authFail(err.response.data.error));
      yield put(actions.authFail(err.response.data.error))
    }
}

export function* authCheckStateSaga(action) {
  const token = yield localStorage.getItem('token');
  if (!token) {
    yield put(actions.logout());
  } else {
    const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
    if (expirationDate >= new Date()) {
      const userId = localStorage.getItem('userId');
      yield put(actions.authSuccess(token, userId));
      yield put(actions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
    } else {
      yield put(actions.logout(token));
    }
  }
}