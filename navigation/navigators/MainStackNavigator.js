import React from 'react';
import { observer, inject } from 'mobx-react';
import { Linking } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
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
  Activity: ActivityIcon,
  Settings: SettingsIcon
};

const labelMap = {
  Account: 'Wallet',
  Activity: 'Activities',
  Settings: 'Settings'
};

// tab navigator
const MainTabNavigator = createMaterialBottomTabNavigator(
  {
    Account: AccountScreen,
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

@inject('accountStore')
@observer
class MainTabNavigatorWrapper extends React.Component {
  constructor(params) {
    super(params);

    this.addLinkingListener();
    this.state = { redirectData: null, initialLinkingUri: '' };
  }

  handleLinkingHandler = event => {
    const data = ExpoLinking.parse(event.url);
    if (data.path && data.path !== '') {
      this.props.navigation.navigate(data.path, data.queryParams);
    }
    this.setState({ redirectData: data });
  };

  addLinkingListener = () => {
    ExpoLinking.addEventListener('url', this.handleLinkingHandler);
  };

  async componentWillMount() {
    const initialLinkingUri = await Linking.getInitialURL();
    const data = ExpoLinking.parse(initialLinkingUri);
    if (data.path && data.path !== '') {
      this.props.navigation.navigate(data.path, data.queryParams);
    }
    this.setState({ initialLinkingUri });
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
    cardStyle: { backgroundColor: '#fff' }
    /* transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.bezier(0.42, 0, 1, 1)),
        timing: Animated.timing,
        useNativeDriver: true
      },
      screenInterpolator: ({ layout, position, scene }) => {
        const { index } = scene;
        const { initWidth } = layout;

        const translateX = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [initWidth, 0, -30]
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1]
        });

        return { opacity, transform: [{ translateX }] };
      }
    }) */
  }
);
