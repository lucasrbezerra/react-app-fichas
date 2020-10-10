import React, {useState} from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Keyboard, Alert } from 'react-native';
import { Formik } from 'formik';
import Icon from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-datepicker';
import { Divider } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { updateProd } from '../../databases/CRUD';
import getRealm from '../../databases/realm';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ResponsiveHeigth } from '../dimen'; 
import * as yup from 'yup';

export function ProdEdit({Close, onDone, item, Client}) {

    const [qtd, setQtd] = useState(item.qtd);
    const [numInstallments, setNumInstallments] = useState(item.numInstallments);
    const [valueEntered, setValueEntered] = useState(item.valueEntered);
    const [dateBuy, setDateBuy] = useState(item.dateBuy);
    const [datePay, setDatePay] = useState(item.datePay);
    const [valuePaid, setValuePaid] = useState(item.valuePaid);
    const [numInstallmentsPaid, setNumInstallmentsPaid] = useState(item.numInstallmentsPaid);
    const [lastDatePaid, setLastDatePaid] = useState(item.lastDatePaid);

    function DatePayConvert(datePay){
        var day, month, year, newDate;
        
        if(typeof(datePay) === 'string'){
            day = datePay.substr(0,2);
            month = datePay.substr(3,2)
            year = datePay.substr(6,6);
            newDate = new Date(year, month-1, day);
        }else{
            day = datePay.getDate();
            month = datePay.getMonth();
            year = datePay.getFullYear();
            newDate = new Date(year, month, day);
        }

        return newDate;
    };

    function DateBuyConvert(dateBuy){
        var day, month, year, newDate;
        
        if(typeof(dateBuy) === 'string'){
            day = dateBuy.substr(0,2);
            month = dateBuy.substr(3,2)
            year = dateBuy.substr(6,6);
            newDate = new Date(year, month-1, day);
        }else{
            day = dateBuy.getDate();
            month = dateBuy.getMonth();
            year = dateBuy.getFullYear();
            newDate = new Date(year, month, day);
        }

        return newDate;
    };

    function CalculateValueRemaining(Value, Entered, valuePaid){

        return parseFloat(Value) - parseFloat(Entered) - parseFloat(valuePaid);      
    
    };

    const Increment = () => {
        setQtd(parseInt(qtd) + 1);
    };

    const IncrementInstallments = () => {
        setNumInstallments(parseInt(numInstallments) + 1);
    };

    const Decrement = ( ) => {
        setQtd(parseInt(qtd) - 1);
    };

    const DecrementInstallments = ( ) => {
        setNumInstallments(parseInt(numInstallments) - 1);
    };

    async function loadProd() {
        const realm = await getRealm();
        const data = realm.objects('Client').filtered(`id = "${Client.id}"`);
        onDone(data[0].products);
    };

    const handleEditProd = (values) => {
        try{

            console.log("ramaining: ", CalculateValueRemaining(values.valueProd, valueEntered != '' ? valueEntered.toString() : 0, valuePaid).toString());

            const data = {
                name: values.name,
                qtd: qtd.toString(),
                numInstallments: numInstallments.toString(),
                numInstallmentsPaid: numInstallmentsPaid,
                valueProd: values.valueProd != '' ? values.valueProd : '0',
                valueEntered: valueEntered,
                valuePay: values.valuePay,
                valuePaid: valuePaid,
                valueRemaining: CalculateValueRemaining(values.valueProd, valueEntered != '' ? valueEntered.toString() : 0, valuePaid).toString(),
                dateBuy: DateBuyConvert(dateBuy),
                datePay: DatePayConvert(datePay),
                lastDatePaid: lastDatePaid,
            }

                if(lastDatePaid == datePay){
                    showMessage({
                        message: 'Atenção',
                        description: 'Esse produto já foi cobrado no dia de hoje!',
                        type:'warning',
                        duration: 3000,
                        textStyle: {
                            fontSize: 15
                        }
                    })
                }

                updateProd(item, data);
                Close();
                Keyboard.dismiss();
                loadProd();

        }catch(error){
            Alert.alert('Error:', error.message) 
        }
    };

    return(
        <KeyboardAwareScrollView>
        <Formik
        initialValues={{ name: item.name, valueProd: item.valueProd, valuePay: item.valuePay}}
        onSubmit={values => handleEditProd(values)}
        validationSchema={yup.object().shape({
            name: yup
                .string('Você digitou um texto!')
                .required("Insira o nome da mercadoria!"),
            valueProd: yup
                .number('Você digitou um texto!')
                .required('Insira o valor da mercadoria!'),
            valuePay: yup
                .number('Você digitou um texto!')
                .required('Insira o valor a ser pago por mês!'),
        })}
        >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <MaterialIcons style = {styles.IconClose}
                        name="close"
                        size={30}
                        color={'white'}
                        onPress={Close}
                    />
                    <MaterialIcons style = {styles.IconDone}
                        name="done"
                        size={30}
                        color={'white'}
                        disabled={!isValid}
                        onPress={handleSubmit}
                    />
                </View>
                <Text style={{textAlign: 'center', fontFamily: 'Nunito-Bold', fontSize: 18, color:'white'}}>Compra de Mercadoria</Text>
                <Divider style={{backgroundColor: 'white', paddingVertical: 1, marginVertical: 5, marginTop: 5}}/>
                <ScrollView>
                <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={styles.nameView}>
                            <Text style={{ marginBottom: 3, color: 'white', fontWeight:'bold' }}>Nome</Text>
                            <TextInput 
                                value={values.name}
                                onChangeText={handleChange('name')}
                                onBlur={() => setFieldTouched('name')}
                                placeholder='Cadeira de fio'
                                style={styles.inputName}
                            />
                            {touched.name && errors.name &&
                                <Text style={{ fontSize: 15, color: 'red', fontWeight: 'bold' }}>{errors.name}</Text>
                            }
                        </View>
                        <View>
                            <Text style={{ marginBottom: 3, color: 'white', fontWeight:'bold' }}>Qtd</Text>
                                <TextInput 
                                    autoCompleteType='cc-number'                                        
                                    style={styles.inputQtd}
                                    placeholder='1'
                                    keyboardType='numeric'
                                    onChangeText={setQtd}
                                    value={qtd.toString()}
                                />
                        </View>
                        <View style={styles.qtdView}>
                            <Icon style = {styles.IconStyle}
                                name="caretup"
                                size={24}
                                color={'black'}
                                onPress={Increment}
                            />
                            <Icon style = {styles.IconStyle}
                                name="caretdown"
                                size={24}
                                color={'black'}
                                onPress={Decrement}
                            />  
                        </View> 
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={styles.moneyView}>
                            <Text style={{ marginBottom: 3, color: 'white', fontWeight:'bold' }}>Valor da Mercadoria (R$)</Text>
                            <TextInput
                                value={values.valueProd}
                                onChangeText={handleChange('valueProd')}
                                onBlur={() => setFieldTouched('name')}
                                placeholder="300,00"
                                keyboardType='number-pad'
                                style={styles.inputMoney}
                            />
                            {touched.valueProd && errors.valueProd &&
                                <Text style={{ fontSize: 15, color: 'red', fontWeight: 'bold' }}>{errors.valueProd}</Text>
                            }
                        </View>
                        <View>
                            <Text style={{ marginBottom: 3, color: 'white', fontWeight:'bold' }}>N° de Parcelas</Text>
                            <TextInput  
                                keyboardType='numeric'                                       
                                style={styles.inputQtd}
                                onChangeText={setNumInstallments}
                                value={numInstallments.toString()}
                            />
                        </View>
                        <View style={styles.qtdView}>
                            <Icon style = {styles.IconStyle}
                                name="caretup"
                                size={24}
                                color={'black'}
                                onPress={IncrementInstallments}
                            />
                            <Icon style = {styles.IconStyle}
                                name="caretdown"
                                size={24}
                                color={'black'}
                                onPress={DecrementInstallments}
                            />  
                        </View> 
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.moneyView}>
                            <Text style={{ marginBottom: 3, color: 'white', fontWeight:'bold' }}>Entrada (R$)</Text>
                            <TextInput
                                placeholder="50,00"
                                keyboardType='number-pad'
                                onChangeText={setValueEntered}
                                style={styles.inputMoney}
                                value={valueEntered.toString()}
                            />
                        </View>
                            <View style={styles.dateView}>
                            <Text style={styles.title}>Data da Compra</Text>
                                <DatePicker
                                    style={styles.inputDate}
                                    date={dateBuy}
                                    mode="date"
                                    androidMode='calendar'
                                    placeholder="23-10-2000"
                                    format="DD-MM-YYYY"
                                    minDate="23/10/2019"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        marginLeft: 36
                                    }
                                    }}
                                    onDateChange={setDateBuy}
                                />
                        </View>
                    </View>
                    <Divider style={{backgroundColor: 'white', paddingVertical: 1, marginVertical: 5, marginTop: -3}}/>
                    <Text style={{marginStart: 10, fontFamily: 'Nunito-Bold', fontSize: 24, color:'white'}}>Parcelas</Text>
                    <View style={{flexDirection: 'row', marginVertical: 0}}>
                        <View style={styles.moneyView}>
                            <Text style={styles.title}>Valor por Mês (R$)</Text>
                            <TextInput
                                value={values.valuePay}
                                onChangeText={handleChange('valuePay')}
                                onBlur={() => setFieldTouched('valuePay')}
                                placeholder="50,00"
                                keyboardType='number-pad'
                                style={styles.inputMoney}
                            />
                            {touched.valuePay && errors.valuePay &&
                                <Text style={{ fontSize: 15, color: 'red', fontWeight: 'bold' }}>{errors.valuePay}</Text>
                            }
                        </View>
                            <View style={styles.dateView}>
                            <Text style={styles.title}>Próxima Data</Text>
                                <DatePicker
                                    style={styles.inputDate}
                                    date={datePay}
                                    mode="date"
                                    androidMode='calendar'
                                    placeholder="23-10-2000"
                                    format="DD-MM-YYYY"
                                    minDate="23/10/2019"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        marginLeft: 36
                                    }
                                    }}
                                    onDateChange={setDatePay}
                                />
                        </View>
                    </View>
                </ScrollView>
            </View>
        )}
        </Formik>
        </KeyboardAwareScrollView>
    )   
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#084D6E',
        marginLeft: 30,
        marginTop: ResponsiveHeigth() / 20,
        marginRight: 30,
        borderRadius: 10,
    },
    nameView:{
        flex: 1,
        padding: 8,
    },
    inputName: {
        fontFamily:'Nunito-Bold',
        fontSize: 15,
        backgroundColor: 'white',
        borderColor: 'black',
        padding: 10,
        marginBottom: 3,
        borderRadius: 5,
        color: '#333333'
    },
    qtdView:{
        backgroundColor: 'white',
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
        marginTop: 19,
        height: 48,
        marginRight: 8
    },
    inputQtd: {
        fontFamily:'Nunito-Bold',
        fontSize: 15,
        backgroundColor: 'white',
        borderColor: 'black',
        padding: 10,
        marginBottom: 3,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        color: '#333333'
    },
    moneyView:{
        flex: 1,
        padding: 8,
    },
    inputMoney: {
        fontFamily:'Nunito-Bold',
        fontSize: 15,
        backgroundColor: 'white',
        borderColor: 'black',
        padding: 10,
        marginBottom: 3,
        borderRadius: 5,
        color: '#333333'
    },
    inputEntered: {
        height: 51,
        color: 'black',
        fontFamily:'Nunito-Bold',
        fontSize: 15,
        backgroundColor: 'white',
        borderWidth: 3/2,
        borderColor: 'black',
        padding: 10,
        marginBottom: 3,
        borderRadius: 5,
    },
    dateView:{
        padding: 8
    },  
    inputDate: {
        fontSize: 15,
        color: 'black',
        backgroundColor: 'white',
        borderColor: 'black',
        padding: 4,
        borderRadius: 5,
        marginBottom: 5,
    },
    IconStyle : {
        alignSelf: 'center'
    },
    IconClose : {
        padding: 8
    },
    IconDone : {
        padding: 8
    },
    title: {
        marginBottom: 3,
        color: 'white', 
        fontWeight:'bold'
    }
});