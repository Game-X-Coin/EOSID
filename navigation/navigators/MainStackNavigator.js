import React from 'react';
import { observer, inject } from 'mobx-react';
import { Linking } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import { Linking as ExpoLinking } from 'expo';

import {
  AccountScreen,
  SettingsScreen,
  AddNetworkScreen,
  NetworkScreen as SettingsNetworkScreen,
  AccountsScreen,
  TransferScreen,
  TransferAmountScreen,
  TransferResultScreen,
  PermissionRequestScreen,
  ManageResourceScreen,
  PermissionScreen,
  ActivityScreen,
  ActivityDetailScreen,
  ResourceScreen,
  SettingsAppPinScreen,
  SettingsAccountPinScreen,
  AboutUsScreen
} from '../../screens/Main';

import {
  ImportAccountScreen,
  ShowErrorScreen,
  ShowSuccessScreen,
  ConfirmPinScreen,
  ConfirmAppPinScreen,
  NewPinScreen,
  NewAppPinScreen
} from '../../screens/Shared';

import { Theme } from '../../constants';
import { WalletIcon, ActivityIcon, SettingsIcon } from '../../components/SVG';

// detail screens
const DetailScreens = {
  // accounts
  ImportAccount: ImportAccountScreen,
  Resource: ResourceScreen,
  ManageResource: ManageResourceScreen,
  Transfer: TransferScreen,
  TransferAmount: TransferAmountScreen,
  TransferResult: TransferResultScreen,
  Permission: PermissionScreen,
  // settings
  SettingsNetwork: SettingsNetworkScreen,
  SettingsAppPin: SettingsAppPinScreen,
  SettingsAccountPin: SettingsAccountPinScreen,
  SettingsAboutUs: AboutUsScreen,
  AddNetwork: AddNetworkScreen,
  Accounts: AccountsScreen,
  // activity
  ActivityDetail: ActivityDetailScreen,
  // confirm pincode
  ConfirmPin: ConfirmPinScreen,
  ConfirmAppPin: ConfirmAppPinScreen,
  // new pincode
  NewPin: NewPinScreen,
  NewAppPin: NewAppPinScreen,
  // confirm dapp sign
  PermissionRequest: PermissionRequestScreen,
  // show result status
  ShowError: ShowErrorScreen,
  ShowSuccess: ShowSuccessScreen
};

const iconMap = {
  Account: WalletIcon,
  Resources: WalletIcon,
  Activity: ActivityIcon,
  Settings: SettingsIcon
};

const labelMap = {
  Account: 'Wallet',
  Resources: 'Resources',
  Activity: 'Activities',
  Settings: 'Settings'
};

// tab navigator
const MainTabNavigator = createMaterialBottomTabNavigator(
  {
    Account: AccountScreen,
    Resources: ResourceScreen,
    Activity: ActivityScreen,
    Settings: SettingsScreen
  },
  {
    navigationOptions: ({
      navigation: {
        state: { routeName }
      }
    }) => ({
      title: labelMap[routeName],
      tabBarIcon: ({ tintColor }) => {
        return iconMap[routeName]({ color: tintColor });
      }
    }),
    activeColor: Theme.palette.active,
    inactiveColor: Theme.palette.inActive,
    barStyle: {
      backgroundColor: Theme.tab.backgroundColor
    }
  }
);

@inject('accountStore', 'settingsStore')
@observer
class MainTabNavigatorWrapper extends React.Component {
  constructor(params) {
    super(params);

    this.addLinkingListener();
  }

  handleLinkingHandler = event => {
    const data = ExpoLinking.parse(event.url);
    if (data.path && data.path !== '') {
      this.props.navigation.navigate(data.path, data.queryParams);
    }
  };

  addLinkingListener = () => {
    ExpoLinking.addEventListener('url', this.handleLinkingHandler);
  };

  async componentWillMount() {
    const { navigation, settingsStore } = this.props;

    const findLinking = async () => {
      const initialLinkingUri = await Linking.getInitialURL();
      const data = ExpoLinking.parse(initialLinkingUri);

      if (data.path && data.path !== '') {
        navigation.navigate(data.path, data.queryParams);
      }
    };

    if (settingsStore.settings.appPincodeEnabled) {
      navigation.navigate('ConfirmAppPin', {
        cantBack: true,
        cb: async () => {
          findLinking();
        }
      });
    } else {
      findLinking();
    }
  }

  componentWillUnmount() {
    ExpoLinking.removeEventListener('url', this.handleLinkingHandler);
  }

  componentDidMount() {
    this.props.accountStore.getAccountInfo();
  }

  render() {
    return <MainTabNavigator navigation={this.props.navigation} />;
  }
}

MainTabNavigatorWrapper.router = MainTabNavigator.router;

export const MainStackNavigator = createStackNavigator(
  {
    MainTab: MainTabNavigatorWrapper,
    ...DetailScreens
  },
  {
    headerMode: 'none',
    cardStyle: { backgroundColor: '#fff' },
    transitionConfig: () => ({
      screenInterpolator: sceneProps => {
        return StackViewStyleInterpolator.forHorizontal(sceneProps);
      }
    })
  }
);
