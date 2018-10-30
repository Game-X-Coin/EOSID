import React from 'react';
import { observer, inject } from 'mobx-react';
import { Linking } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Icon, Linking as ExpoLinking } from 'expo';

import {
  AccountScreen,
  SettingsScreen,
  AddNetworkScreen,
  NetworkScreen as SettingsNetworkScreen,
  TransactionScreen,
  TransactionDetailScreen,
  AccountsScreen,
  TransferScreen,
  TransferAmountScreen,
  TransferResultScreen,
  ConfirmPinScreen,
  PermissionRequestScreen,
  ManageResourceScreen
} from '../../screens/Main';

import { ImportAccountScreen, ShowErrorScreen } from '../../screens/Shared';

// detail screens
const DetailScreens = {
  // accounts
  ImportAccount: ImportAccountScreen,
  ManageResource: ManageResourceScreen,
  Transfer: TransferScreen,
  TransferAmount: TransferAmountScreen,
  TransferResult: TransferResultScreen,
  // settings
  SettingsNetwork: SettingsNetworkScreen,
  AddNetwork: AddNetworkScreen,
  Accounts: AccountsScreen,
  // tx
  TransactionDetail: TransactionDetailScreen,
  // confirm pincode
  ConfirmPin: ConfirmPinScreen,
  // confirm dapp sign
  PermissionRequest: PermissionRequestScreen,
  // show error
  ShowError: ShowErrorScreen
};

// for tab icons
const iconMap = {
  Account: 'md-contact',
  Transaction: 'md-filing',
  Settings: 'md-settings'
};

// tab navigator
const MainTabNavigator = createMaterialBottomTabNavigator(
  {
    Account: AccountScreen,
    Transaction: TransactionScreen,
    Settings: SettingsScreen
  },
  {
    shifting: true,
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;

        return (
          <Icon.Ionicons
            size={26}
            name={iconMap[routeName]}
            color={tintColor}
          />
        );
      }
    })
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
  }
);
