import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, TextInput, Keyboard, Alert } from 'react-native';
import { Formik } from 'formik';
import { Divider } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import { collectProd } from '../../databases/CRUD';
import getRealm from '../../databases/realm'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {showMessage}  from 'react-native-flash-message';
import { ResponsiveHeigth } from '../dimen'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export function ProdCollect({Close, onDone, item, Client}){

    const [valuePaid, setValuePaid] = useState('');
    const [valuePay, setValuePay] = useState(item.valuePay);
    const [datePay, setDatePay] = useState(item.datePay);
    const [valueRemaining, SetValueRemaining] = useState(item.valueRemaining);
    const [numInstallmentsPaid, setNumInstallmentsPaid] = useState(item.numInstallmentsPaid);

    useEffect(() => {
        SetValueRemaining(CalculateReimaining(item.valueRemaining, CalculateValuePaid()).toString());
    }, [valueRemaining, valuePaid]);
    

    function CalculateValuePaid(){
        if(valuePaid == ''){
           return 0;
        }else{
            return valuePaid;
        }
    };

    function CalculateReimaining(Reimaining, Paid) {
        return parseFloat(Reimaining) - parseFloat(Paid);
    };

    async function loadProd() {
        const realm = await getRealm();
        const data = realm.objects('Client').filtered(`id = "${Client.id}"`);
        onDone(data[0].products);
    };

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

    const handleCollect = () => {
        try{
            const data = {     
                valuePaid: valuePaid,
                valuePay: valuePay,
                datePay: DatePayConvert(datePay),
                valueRemaining: valueRemaining,
                numInstallmentsPaid: valuePaid == 0 ? numInstallmentsPaid : numInstallmentsPaid + 1,
                collected: true,
                lastDatePaid: DatePayConvert(new Date()),
            }

            if(data.valuePaid == 0 && data.valueRemaining > 0){
                showMessage({
                    message: "Erro ao Cobrar",
                    description: "Você não inseriu um valor pago pelo cliente, tente novamente!",
                    type: 'danger',
                    duration: 5000,
                    textStyle: {
                        fontSize: 15
                    }
                  });
            }else if(data.valueRemaining < 0){
            showMessage({
                message: "Erro ao Cobrar",
                description: "O Cliente já pagou todo o valor!",
                type: 'danger',
                duration: 5000,
                textStyle: {
                    fontSize: 15
                }
                });
            }else if(data.datePay.toString() == data.lastDatePaid.toString()){
                showMessage({
                    message: "Erro ao Cobrar",
                    description: "Você não mudou a data para a próxima cobrança!",
                    type: 'danger',
                    duration: 5000,
                    textStyle: {
                        fontSize: 15
                    }
                });

            }else{
                collectProd(item, data);
                Close();
                Keyboard.dismiss();
                loadProd();
                showMessage({
                    message: "Sucesso!",
                    description: `Mercadoria do cliente ${Client.name} cobrado com sucesso!`,
                    type: 'success',
                    duration: 3500,
                    textStyle: {
                        fontSize: 15
                    }
                });
            }

        }catch(error){
            Alert.alert('Error:', error.message) 
        }
    };

    return(
    <KeyboardAwareScrollView style={{flex: 1, marginVertical: 8}}>
        <Formik>
            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
                    <MaterialIcons
                        name="close"
                        size={30}
                        color={'white'}
                        style={styles.IconClose}
                        onPress={Close}
                    />
                    <MaterialIcons 
                        name="done"
                        size={30}
                        color={'white'}
                        style={styles.IconDone}
                        onPress={handleCollect}
                    />
                </View>
                <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                    <Text style={{marginStart: 8, fontFamily: 'Nunito-Bold', fontSize: 22, color:'white', paddingVertical: 3}}> {Client.name} </Text>
                    <Text style={{fontFamily: 'Nunito-Bold', fontSize: 22, color:'white', paddingVertical: 3, marginRight: 8}}> {numInstallmentsPaid} / {item.numInstallments} </Text>
                </View>
                <Divider style={{backgroundColor: 'white', paddingVertical: 1, marginVertical: 5}}/>
                <View style={{flexDirection: 'row'}}>
                    <View style={styles.moneyView}>
                        <Text style={styles.title}>Valor Pago (R$)</Text>
                        <TextInput
                            value={valuePaid}
                            onChangeText={setValuePaid}
                            placeholder="50,00"
                            keyboardType='number-pad'
                            style={styles.inputMoney}
                        />
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
                <View style={{flexDirection: 'row'}}>
                    <View style={styles.moneyView}>
                        <Text style={styles.title}>Valor por Mês (R$)</Text>
                        <TextInput
                            placeholder="50,00"
                            keyboardType='number-pad'
                            onChangeText={setValuePay}
                            style={styles.inputMoney}
                            value={valuePay}
                        />
                    </View>
                    <View style={styles.moneyView}>
                        <Text style={styles.title}>Valor Restante (R$)</Text>
                        <TextInput
                            placeholder="50,00"
                            keyboardType='number-pad'
                            onChangeText={SetValueRemaining}
                            style={styles.inputMoney}
                            value={valueRemaining}
                        />
                    </View>
                </View>
            </View>
        </Formik>
    </KeyboardAwareScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#084D6E',
        marginLeft: 30,
        marginRight: 30,
        marginTop: ResponsiveHeigth() / 4,
        borderRadius: 10,
    },
    IconClose : {
        padding: 8
    },
    IconDone : {
        padding: 8
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
    title: {
        marginBottom: 3,
        color: 'white', 
        fontWeight:'bold'
    }
})