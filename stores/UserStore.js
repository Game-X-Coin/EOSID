import { observable, computed, action } from 'mobx';

import { UserService } from '../services';
import { UserModel } from '../db';

class Store {
  @observable
  users = [];

  @observable
  currentUser = UserModel.placeholder;

  @observable
  pincode = '';

  @computed
  get isSignIn() {
    return Boolean(this.pincode);
  }

  @action
  setPincode(pincode) {
    this.pincode = pincode;
  }

  @action
  setUser(user) {
    console.log(user);
    this.currentUser = user || UserModel.placeholder;
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
      this.setUser(user);
    });
  }

  @action
  async signIn(formData) {
    return UserService.signIn(formData).then(user => {
      this.setUser(user);
      this.setPincode(formData.pincode);
    });
  }

  @action
  async signUp(formData) {
    return UserService.signUp(formData).then(user => {
      this.setUser(user);
      this.setPincode(formData.pincode);
      this.getUsers();
    });
  }

  @action
  async signOut() {
    this.setUser(null);
    this.setPincode(null);
  }
}

export const UserStore = new Store();
