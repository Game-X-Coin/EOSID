import { observable, computed, action } from 'mobx';

import { SettingsService } from '../services';
import { SettingsModel } from '../db';

class Store {
  @observable
  settings = SettingsModel.placeholder;

  @computed
  get initialized() {
    return Boolean(this.settings.id);
  }

  @action
  setSettings(settings) {
    this.settings = settings || SettingsModel.placeholder;
  }

  @action
  getSettings() {
    return SettingsService.getSettings().then(settings => {
      this.setSettings(settings);
    });
  }

  @action
  initializeSettings() {
    if (this.initialized) {
      return;
    }

    return SettingsService.initializeSettings().then(settings => {
      this.setSettings(settings);
    });
  }

  @action
  updateSettings(settingsInfo) {
    return SettingsService.updateSettings({
      ...settingsInfo,
      id: this.settings.id
    }).then(settings => {
      this.setSettings(settings);
    });
  }
}

export default new Store();
