import { getRepository } from 'typeorm-expo/browser';
import { SecureStore } from 'expo';

import { UserModel, UserError } from '../db';

const SECURE_STORE_PINCODE = 'pincode';
const DEFAULT_USERNAME = 'Administrator'; // default username for 1'st signup user

// define user service
export class UserService {
  static async getUsers() {
    const UserRepo = getRepository(UserModel);
    const users = await UserRepo.find();

    return users;
  }

  static async updateUser({ id, ...userInfo }) {
    const UserRepo = getRepository(UserModel);
    // save
    await UserRepo.update(id, userInfo);

    const updatedUser = await UserRepo.findOne(id);

    return updatedUser;
  }

  static async signIn({ username = DEFAULT_USERNAME, pincode }) {
    const UserRepo = getRepository(UserModel);
    const user = await UserRepo.findOne({ username });

    // get pincode by username
    const savedPincode = await SecureStore.getItemAsync(SECURE_STORE_PINCODE, {
      keychainService: username
    });

    // diff pincode
    if (savedPincode !== pincode) {
      return Promise.reject(UserError.PincodeNotMatch);
    }

    return user;
  }

  static async signUp({ username = DEFAULT_USERNAME, pincode }) {
    const UserRepo = getRepository(UserModel);
    const users = await UserService.getUsers();

    // find existing user
    if (users.find(user => user.username === username)) {
      return Promise.reject(UserError.UserAlreadyExist);
    }

    // save pincode by username
    await SecureStore.setItemAsync(SECURE_STORE_PINCODE, pincode, {
      keychainService: username
    });

    // create user instance
    const user = new UserModel({
      username
    });

    // write to db
    await UserRepo.save(user);

    return user;
  }
}
