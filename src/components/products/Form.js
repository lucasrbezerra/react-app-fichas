import React, {useState} from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Keyboard, Alert } from 'react-native';
import { Divider } from 'react-native-paper';
import { Formik } from 'formik';
import DatePicker from 'react-native-datepicker';
import { insertProd } from '../../databases/CRUD';
import getRealm from '../../databases/realm';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { showMessage } from 'react-native-flash-message'
import * as yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ResponsiveHeigth } from '../dimen'; 


function ProdID(){
    var seed, d, m, y, h, min, sec, milsec, date;

    date = new Date();
    d = date.getDate().toString();
    m = date.getMonth().toString();
    y = date.getFullYear().toString();
    h = date.getHours().toString();
    min = date.getMinutes().toString();
    sec = date.getSeconds().toString();
    milsec = date.getMilliseconds().toString();

    seed = d + m + y + h + min + sec + milsec;
    
    console.log("Entrou aq");
    return parseInt(seed);
};

export function ProdForm({Close, onDone, list, register, Client}) {

    
    const [qtd, setQtd] = useState(1);
    const [numInstallments, setNumInstallments] = useState(2);
    const [valueEntered, setValueEntered] = useState('');
    const [dateBuy, setDateBuy] = useState('');
    const [datePay, setDatePay] = useState('');
    const [valuePaid, setValuePaid] = useState(0);
    const [numInstallmentsPaid, setNumInstallmentsPaid] = useState(0);

    const [auxVet, setAuxVet] = useState(list);

    function DatePayConvert(datePay){

        var day = datePay.substr(0,2);
        var month = datePay.substr(3,2);
        var year = datePay.substr(6,6);
        var newDate = new Date(year, month-1, day, 0, 0, 0);

        return newDate;
    };

    function DateBuyConvert(dateBuy){
        var day = dateBuy.substr(0,2);
        var month = dateBuy.substr(3,2);
        var year = dateBuy.substr(6,6);

        var newDate = new Date(year, month-1, day);

        return newDate;
    };

    function ValueRemaining(Value, Entered){

       return parseFloat(Value) - parseFloat(Entered);      
   
    };

    const Increment = () => {
        setQtd(parseInt(qtd + 1));
    };

    const IncrementInstallments = () => {
        setNumInstallments(parseInt(numInstallments + 1));
    };

    const Decrement = ( ) => {
        setQtd(parseInt(qtd - 1));
    };

    const DecrementInstallments = ( ) => {
        setNumInstallments(parseInt(numInstallments - 1));
    };

    async function loadProd() {
        const realm = await getRealm();
        const data = realm.objects('Client').filtered(`id = "${Client.id}"`);
        onDone(data[0].products);
    };

    const handleAddProd = (values) => {
        try{
            ProdID();
            const data = {
                id: ProdID(),
                name: values.name,
                qtd: qtd.toString(),
                numInstallments: numInstallments.toString(),
                numInstallmentsPaid: numInstallmentsPaid,
                valueProd: values.valueProd != '' ? values.valueProd : '0',
                valueEntered: valueEntered != '' ? valueEntered.toString() : '0',
                valuePay: values.valuePay,
                valuePaid: valuePaid.toString(),
                valueRemaining: ValueRemaining(values.valueProd, valueEntered != '' ? valueEntered.toString() : 0 ).toString(),
                dateBuy: DateBuyConvert(dateBuy),
                datePay: DatePayConvert(datePay),
                lastDatePaid: new Date(2000,10,23),
                collected: false,
            }

            if(!register){
                insertProd(Client, data);
                loadProd();
            }
            else{
                auxVet.push(data);
                onDone(auxVet);
            }

                Close();
                Keyboard.dismiss();
                showMessage({
                    message: 'Sucesso',
                    description: 'Mercadoria inserida!',
                    type: 'success',
                    textStyle:{
                        fontSize: 15
                    }
                })

        }catch(error){
            showMessage({
                message: 'Erro',
                description: 'Não foi possivel inserir a mercadoria!',
                type: 'danger',
                textStyle:{
                    fontSize: 15
                }
            }) 
        }
    };

    return(
        <KeyboardAwareScrollView style={{flex: 1}}>
        <Formik
        initialValues={{ name: '', valueProd: '', valuePay: ''}}
        onSubmit={values => handleAddProd(values)}
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