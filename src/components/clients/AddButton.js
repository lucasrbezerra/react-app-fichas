import React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'

export const AddButtonClient = (props) => {
  const { onPress, size } = props;
  
  return (
      <TouchableHighlight onPress={onPress} style={styles.button}>
        <Icon name="plus" size={size} color="#FFF"/>
      </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#660000",
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    height: 65,
    right: 0,
    bottom: 0,
    borderRadius: 36,
    marginRight: 10,
    marginVertical: 10 ,
    position: 'absolute',
    shadowColor: 'white',
    shadowRadius: 5,
    shadowOffset: { height: 10 },
    shadowOpacity: 0.3,
    borderWidth: 1,
    borderColor: "#121212"
  },
});