import { observable, computed, action } from 'mobx';

import { UserService } from '../services';

class Store {
  @observable
  users = [];

  @observable
  currentUser = null;

  @computed
  get isSignIn() {
    return Boolean(this.currentUser);
  }

  @action
  setUser(user) {
    this.currentUser = user;
  }

  @action
  getUsers() {
    return UserService.getUsers().then(users => {
      this.users = users;
    });
  }

  @action
  updateUser(userInfo) {
    return UserService.updateUser({
      ...userInfo,
      id: this.currentUser.id
    }).then(user => {
      console.log(user);
      this.setUser(user);
    });
  }

  @action
  async signIn(formData) {
    return UserService.signIn(formData).then(user => {
      this.setUser(user);
    });
  }

  @action
  async signUp(formData) {
    return UserService.signUp(formData).then(user => {
      this.setUser(user);
    });
  }

  @action
  async signOut() {
    this.setUser(null);
  }
}

export const UserStore = new Store();
