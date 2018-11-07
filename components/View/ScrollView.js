import React, { PureComponent } from 'react';
import { RefreshControl, ScrollView as RNScrollView, View } from 'react-native';

export class ScrollView extends PureComponent {
  render() {
    const { refreshing, style, children, onRefresh } = this.props;

    return (
      <RNScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="always"
        refreshControl={
          onRefresh && (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          )
        }
      >
        <View style={{ flex: 1, ...style }}>{children}</View>
      </RNScrollView>
    );
  }
}
