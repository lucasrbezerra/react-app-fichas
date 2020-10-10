import React, {useState} from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';


function Display({text}){
return (
    <View style={styles.DisplayContainer}>
      <View style={{height: 120, alignItems: 'flex-end'}}>
        <Text style={{fontSize: 50, color: 'white', marginRight: 8, marginTop: 45}}> {text} </Text>
      </View>
      <View style={{height: 80, alignItems: 'flex-end'}}>
        <Text style={{fontSize: 35, color: 'white', marginRight: 15}}>  </Text>
      </View>
    </View>
)
};

function NumberButtons({label, styled, onPress}){
return(
  <View style = {styles.container}>
    <TouchableOpacity onPress={onPress} style={styled}>
        <Text style={styles.textButton}>{label}</Text>
    </TouchableOpacity>
  </View>
)
};

export function CalculatorScreen() {

const [numbers, setNumbers] = useState([]);
const [display, setDisplay ] = useState('');
const [operation, setOperation] = useState('');


function DeleteNum(){
  var n = display.length;
  var newDisplay = display.substr(0, n-1);
  setDisplay(newDisplay);
};

function calculate(){
  let values = numbers
  let newDisplayText = ''

  values.push(parseFloat(display.replace(',', '.')))

  switch(operation) {
    case '+':
      newDisplayText = values.reduce((a, b) => a + b).toFixed(2).toString()
      break
    case '-':
      newDisplayText = values.reduce((a, b) => a - b).toFixed(2).toString()
      break
    case 'x':
      newDisplayText = values.reduce((a, b) => a * b).toFixed(2).toString()
      break
    case '/':
      newDisplayText = values.reduce((a, b) => a / b).toFixed(2).toString()
      break
  }

  newDisplayText = newDisplayText.replace('.', ',')

  setDisplay(newDisplayText);
  setOperation(null);
  setNumbers([]);
};

const setOperations = (operation) => {
  let newValues = numbers;

  newValues.push(parseFloat(display.replace(',', '.')))

  setDisplay('');
  setOperation(operation);
  setNumbers(newValues);
};

const addValue = (value) => {

  let newDisplayText = display == '' ? value : display + value

  setDisplay(newDisplayText);

};

const addDecimal = () => {
  if (!display.includes(',') && display !== '') {
    addValue(',')
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <Display text={display} />
      <View style={styles.buttonsScreen}>
        <View style={styles.leftScreen}>
          <View style={styles.clearView}>
            <NumberButtons label="Limpar" styled={styles.buttonView} onPress={() => setDisplay('')}/>
          </View>
          <View style={{flex: 1, marginTop: 2}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <NumberButtons label="7" styled={styles.buttonView} onPress={() => addValue('7')}/>
              <NumberButtons label="8" styled={styles.buttonView} onPress={() => addValue('8')}/>
              <NumberButtons label="9" styled={styles.buttonView} onPress={() => addValue('9')}/>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <NumberButtons label="4" styled={styles.buttonView} onPress={() => addValue('4')}/>
              <NumberButtons label="5" styled={styles.buttonView} onPress={() => addValue('5')}/>
              <NumberButtons label="6" styled={styles.buttonView} onPress={() => addValue('6')}/>
            </View>
            <View style={{flex: 1,  flexDirection: 'row'}}>
              <NumberButtons label="1" styled={styles.buttonView} onPress={() => addValue('1')}/>
              <NumberButtons label="2" styled={styles.buttonView} onPress={() => addValue('2')}/>
              <NumberButtons label="3" styled={styles.buttonView} onPress={() => addValue('3')}/>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <NumberButtons label="0" styled={styles.buttonView} onPress={() => addValue('0')}/>
              <NumberButtons label="," styled={styles.buttonView} onPress={() => addDecimal()}/>
              <NumberButtons label="=" styled={styles.buttonView} onPress={calculate} />
            </View>
          </View>
        </View>

        <View style={styles.rightScreen}>
          <NumberButtons label="Del" styled={styles.buttonView} onPress={() => DeleteNum()}/>
          <NumberButtons label="/" styled={styles.buttonView} onPress={() => setOperations('/')}/>
          <NumberButtons label="x" styled={styles.buttonView} onPress={() => setOperations('x')}/>
          <NumberButtons label="-" styled={styles.buttonView} onPress={() => setOperations('-')}/>
          <NumberButtons label="+" styled={styles.buttonView} onPress={() => setOperations('+')}/>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container : {
      flex: 1,
    },
    DisplayContainer : {
      height: 200,
      backgroundColor: '#121212'
    },
    buttonView: {
      flex: 1, 
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'grey',
      height: 60,
    },
    textButton: {
      fontSize: 25,
      color: 'white'
    },
    clearView:{
      height: 90,
    },
    leftScreen:{
      flex: 1,  
      flexDirection: 'column',  
    },
    buttonsScreen:{
      flex: 1, 
      flexDirection: 'row'
    },
    rightScreen:{
      width: 110,
      marginLeft: 2
    }
    
});