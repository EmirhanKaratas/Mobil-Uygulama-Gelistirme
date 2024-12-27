import { View, Text } from 'react-native';
import React from 'react';

export default function UserDetails({ route }) {
  // route.params ile gelen parametreleri alıyoruz
  const { fullName } = route.params;

  return (
    <View>
      <Text>User Details: {fullName}</Text>
    </View>
  );
}
