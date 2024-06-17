import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PendingInvoicesScreen() {
  return (
    <View style={styles.container}>
      <Text>Pending Invoices Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
