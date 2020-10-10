import React, {} from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ClientEdit } from '../components/clients/Edit';
import LinearGradient from 'react-native-linear-gradient';

export function DetailsScreen({navigation, route}) {

  const { item } = route.params;
  const { handleRefresh } = route.params;

  return (
    <LinearGradient colors={['#660000', 'black']} start={{x: 0.0, y: 0.05}} end={{x: 0.0, y: 1.25}} style={styles.container}>
      <ScrollView>
        <ClientEdit navigation={navigation} item={item} handleRefresh={handleRefresh}/>           
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
     flex: 1, 
  },
});