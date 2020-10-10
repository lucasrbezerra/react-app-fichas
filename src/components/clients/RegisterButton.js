import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Button = props => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onClick} disabled={props.disabled}>
      <Text style={styles.buttonText}>{props.text}</Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  disabled: PropTypes.bool
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    backgroundColor:'#660000', 
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 50,
    marginRight: 50, 
    borderRadius: 10,
    marginVertical: 20,
},
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default Button;