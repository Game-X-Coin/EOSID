import { getRepository } from 'typeorm-expo/browser';

import { SettingsModel } from '../db';

export default class SettingsService {
  static async getSettings() {
    const SettingsRepo = getRepository(SettingsModel);
    const settings = await SettingsRepo.find();

    return settings.length ? settings[0] : null;
  }

  static async initializeSettings() {
    const SettingsRepo = getRepository(SettingsModel);

    // create settings instance
    const settings = new SettingsModel();

    // write to db
    await SettingsRepo.save(settings);

    return settings;
  }

  static async updateSettings({ id, ...settingsInfo }) {
    const SettingsRepo = getRepository(SettingsModel);

    // save
    await SettingsRepo.update(id, settingsInfo);

    const updatedSettings = await SettingsRepo.findOne(id);

    return updatedSettings;
  }
}
