import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import {ResponsiveHeigth, ResponsiveWidth, wp, hp} from '../dimen';


export const AddButtonProd = (props) => {
    const { style = {}, onPress, size } = props;
  
    return (
      <TouchableHighlight onPress={onPress} style={[styles.button, style]}>
          <Icon name="shoppingcart" size={size} color="black"/>
      </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    button: {
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      width: 65,
      height: 45,
      borderRadius: 36,
      position: 'absolute',
      shadowColor: 'white',
      shadowRadius: 5,
      shadowOffset: { height: 10 },
      shadowOpacity: 0.3,
      borderWidth: 1,
      borderColor: "#121212",
      marginLeft: ResponsiveWidth() - 75
    },
});