import { action, makeObservable, observable } from 'mobx';

class Auth {
  accessToken: string | null = null;

  constructor() {
    makeObservable(this, {
      accessToken: observable,
      setAccessToken: action,
    });
  }
  setAccessToken = (state: string | null) => {
    this.accessToken = state;
  };
}
