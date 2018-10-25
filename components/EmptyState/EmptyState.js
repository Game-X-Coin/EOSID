import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Title, Paragraph, Colors } from 'react-native-paper';

export class EmptyState extends Component {
  render() {
    const { image, title, description, children } = this.props;

    const IMAGE_SIZE = 200;

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
          source={image}
        />

        <Title style={{ marginBottom: 5 }}>{title}</Title>

        <Paragraph
          style={{
            marginBottom: 35,
            paddingHorizontal: 30,
            color: Colors.grey500,
            textAlign: 'center'
          }}
        >
          {description}
        </Paragraph>

        {children}
      </View>
    );
  }
}
