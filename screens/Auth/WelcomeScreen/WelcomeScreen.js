import React, { Component } from 'react';
import { View, SafeAreaView, Button, Text } from 'react-native';

/* import { Button } from '../../shared/button';
import { Text } from '../../shared/text';
 */
export class WelcomeScreen extends Component {
  moveScreen = routeName => this.props.navigation.navigate(routeName);

  render() {
    return (
      <View>
        <SafeAreaView>
          <View>
            <Text text="EOSID" />
          </View>

          <View>
            <View>
              <Text text={'welcomeScreen.title'} />
              <Text text={'welcomeScreen.subTitle'} />
            </View>

            <View>
              <Button
                title="welcomeScreen.signIn"
                onPress={() => this.moveScreen('SignIn')}
              />
              <Button
                title="welcomeScreen.signUp"
                onPress={() => this.moveScreen('SignUp')}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
