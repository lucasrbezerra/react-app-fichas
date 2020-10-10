import React, { useState, useCallback, Fragment } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Keyboard, Alert } from 'react-native';
import { Formik } from 'formik';
import Button from './RegisterButton';
import { insertClient } from '../../databases/CRUD';
import DatePicker from 'react-native-datepicker';
import { Divider } from 'react-native-paper';
import { ListProdRegister } from '../products/ListProdRegister';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { wp } from '../../components/dimen';

function ClientID(){
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
    
    return parseInt(seed);
};

export function ClientForm({Close}){ 
    
    const [dateRegister, setDateRegister] = useState('');
    const [products, setProducts] = useState([]);
    
    function DateConvert(date){
        var day = date.substr(0,2);
        var month = date.substr(3,2);
        var year = date.substr(6,6);
        var newDate = new Date(year, month-1, day);

        return newDate;
    };

    const onRegister = useCallback(val => {
        setProducts(val);
    }, []);

      
    const handleSubmitClient = (values) => {
        try{
            
            const data = {
                id: ClientID(),
                name: values.name,
                street: values.street,
                num: values.num,
                neighborhood: values.neighborhood,
                city: values.city,
                state: values.state,
                phone: values.phone,
                dateRegister: DateConvert(dateRegister),
                products: products,
            }
            
            insertClient(data);
            Close();
            Keyboard.dismiss();
            showMessage({
                message: "Sucesso!",
                description: 'Cliente cadastrado com sucesso!',
                type: 'success',
                duration: 3500,
                textStyle: {
                    fontSize: 15,
                }
            });

        }catch(error){
            showMessage({
                message: "Falha!",
                description: `${error}`,
                type: 'danger',
                duration: 3500,
                textStyle: {
                    fontSize: 15
                }
            }); 
        }
    };


    return (
    <KeyboardAwareScrollView >
        <Formik
            initialValues={{ name: '', street: '', num: '', neighborhood: '', city: 'Campo Grande', state: 'MS', phone: ''}}
            onSubmit={values => handleSubmitClient(values)}
            validationSchema={yup.object().shape({
                name: yup
                    .string()
                    .required("Nome do cliente faltando!"),
                street: yup
                    .string()
                    .required("Rua do cliente faltando!"),
                num: yup
                    .number('')
                    .required("Numero faltando!"),
                neighborhood: yup
                    .string()
                    .required("Bairro do cliente faltando!"),
                city: yup
                    .string()
                    .required("Cidade do cliente faltando!"),
                state: yup
                    .string()
                    .required("Estado do cliente faltando!"),
                phone: yup
                    .string(),
            })}
        >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            <Fragment>
                <View style={styles.containerForm}>
                <View style={styles.nameView}>
                        <Text style={styles.title}>Nome</Text>
                        <TextInput 
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={() => setFieldTouched('name')}
                            placeholder='Fulano de tal'
                            
                            style={styles.inputName}
                        />
                        {touched.name && errors.name &&
                        <Text style={{ fontSize: 15, color: 'red', fontWeight: 'bold' }}>{errors.name}</Text>
                        }
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={styles.streetView}>
                            <Text style={styles.title}>Rua</Text>
                            <TextInput
                                value={values.street}
                                onChangeText={handleChange('street')}
                                onBlur={() => setFieldTouched('street')}
                                placeholder='Fulano de tal'
                                
                                style={styles.inputStreet}
                            />
                            {touched.street && errors.street &&
                                <Text style={{ fontSize: 15, color: 'red', fontWeight: 'bold' }}>{errors.street}</Text>
                            }
                        </View>
                        <View style={styles.numView}>
                            <Text style={styles.title}>N°</Text>
                            <TextInput
                                value={values.num}
                                onChangeText={handleChange('num')}
                                onBlur={() => setFieldTouched('street')}
                                placeholder='256'
                                keyboardType='numeric'
                                
                                style={styles.inputNum}
                            />
                            {touched.num && errors.num &&
                                <Text style={{ fontSize: 15, color: 'red', fontWeight: 'bold' }}>{errors.num}</Text>
                            }
                        </View>
                    </View>
                    <View style={styles.neighborhoodView}>
                        <Text style={styles.title}>Bairro</Text>
                        <TextInput
                            value={values.neighborhood}
                            onChangeText={handleChange('neighborhood')}
                            onBlur={() => setFieldTouched('street')}
                            style={styles.inputNeighborhood}
                            
                            placeholder='Coophavilla II'
                        />
                        {touched.neighborhood && errors.neighborhood &&
                            <Text style={{ fontSize: 15, color: 'red', fontWeight: 'bold' }}>{errors.neighborhood}</Text>
                        }
                    </View>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        <View style={styles.cityView}>
                            <Text style={styles.title}>Cidade</Text>
                            <TextInput
                                value={values.city}
                                onChangeText={handleChange('city')}
                                placeholder='Campo Grande'
                                onBlur={() => setFieldTouched('city')}
                                
                                style={styles.inputCity}
                            />
                            {touched.city && errors.city &&
                                <Text style={{ fontSize: 15, color: 'red', fontWeight: 'bold' }}>{errors.city}</Text>
                            }
                        </View>
                        <View style={styles.stateView}>
                            <Text style={styles.title}>Estado</Text>
                            <TextInput
                                value={values.state}
                                onChangeText={handleChange('state')}
                                onBlur={() => setFieldTouched('state')}
                                placeholder='MS'
                                
                                style={styles.inputState}
                            />
                            {touched.state && errors.state &&
                                <Text style={{ fontSize: 15, color: 'red', fontWeight: 'bold' }}>{errors.state}</Text>
                            }
                        </View>
                    </View>
                        <View style ={{ flexDirection:'row', alignItems: 'center'}}>
                            <View style={styles.phoneView}>
                                <Text style={styles.title}>Telefone</Text>
                                <TextInput
                                    value={values.phone}
                                    keyboardType='phone-pad'
                                    placeholder='(xx) x xxxx-xxxx'
                                    onBlur={() => setFieldTouched('phone')}
                                    onChangeText={handleChange('phone')}
                                    
                                    style={styles.inputPhone}
                                />
                                {touched.phone && errors.phone &&
                                    <Text style={{ fontSize: 10, color: 'red', fontWeight: 'bold' }}>{errors.phone}</Text>
                                }
                            </View>
                            <View style={styles.dateView}>
                                <Text style={styles.title}>Data</Text>
                                <DatePicker
                                    style={styles.inputDate}
                                    date={dateRegister}
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
                                        marginLeft: 36,
                                    },
                                    color: '#333333'
                                    }}
                                    onDateChange={setDateRegister}
                                />
                            </View>
                        </View>   
                    <Divider style={{backgroundColor: 'white', paddingVertical: 1}}/>
                    <ListProdRegister list={[]} onRegister={onRegister} />
                    <Button 
                        text='Cadastrar' 
                        onClick={handleSubmit}
                        disabled={!isValid}
                    />
                
                </View>       
            </Fragment>
            )}
        </Formik>
    </KeyboardAwareScrollView>
    )
};

const styles = StyleSheet.create({
    containerForm: {
        flex: 1
    },
    nameView:{
        padding: 8
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
    streetView:{
        padding: 8,
        flex: 1
    },
    inputStreet: {      
        fontFamily:'Nunito-Bold',
        fontSize: 15,
        backgroundColor: 'white',
        borderColor: 'black',
        padding: 10,
        marginBottom: 3,
        borderRadius: 5,
        color: '#333333'
    },
    numView:{
        padding: 8,
        width: wp(80)
    },
    inputNum: {
        fontFamily:'Nunito-Bold',
        fontSize: 15,
        backgroundColor: 'white',
        borderColor: 'black',
        padding: 10,
        marginBottom: 3,
        borderRadius: 5,
        color: '#333333'
    },
    neighborhoodView:{
        padding: 8
    },  
    inputNeighborhood: {      
        fontFamily:'Nunito-Bold',
        fontSize: 15,
        backgroundColor: 'white',
        borderColor: 'black',
        padding: 10,
        marginBottom: 3,
        borderRadius: 5,
        color: '#333333'
    },
    cityView:{
        padding: 8,
        flex: 1
    },
    inputCity: {
        fontFamily:'Nunito-Bold',
        fontSize: 15,
        backgroundColor: 'white',
        borderColor: 'black',
        padding: 10,
        marginBottom: 3,
        borderRadius: 5,
        color: '#333333'
    },
    stateView:{
        padding: 8,
        width: wp(80)
    },
    inputState: {
        fontFamily:'Nunito-Bold',
        fontSize: 15,
        backgroundColor: 'white',
        borderColor: 'black',
        padding: 10,
        marginBottom: 3,
        borderRadius: 5,
        color: '#333333'
    },
    phoneView:{
        flex: 1,
        padding: 8
    },
    inputPhone: {
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
});