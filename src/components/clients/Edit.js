import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Keyboard, Alert } from 'react-native';
import { Formik } from 'formik';
import { updateClient } from '../../databases/CRUD'
import { Divider } from 'react-native-paper';
import { ListProdEdit } from '../products/ListProdEdit';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showMessage } from 'react-native-flash-message';
import * as yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { wp, hp } from '../dimen';


export function ClientEdit({navigation, item, handleRefresh}){ 

    const [dateRegister, setDateRegister] = useState(item.dateRegister);
    const [products, setProducts] = useState(item.products);
    const [edit, setEdit] = useState(false);
    const [icon, setIcon] = useState(false);

    function DateConvert(date){

        var day, month, year, newDate;
        
        if(typeof(date) === 'string'){
            day = date.substr(0,2);
            month = date.substr(3,2)
            year = date.substr(6,6);
            newDate = new Date(year, month-1, day);
            
        }else{
            day = date.getDate();
            month = date.getMonth();
            year = date.getFullYear();  
            newDate = new Date(year, month, day);
        }

        return newDate;
    };

    const handleEditClient = (values) => {
        try{
            const data = {
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

            updateClient(item, data);
            setEdit(false);
            setIcon(false);
            Keyboard.dismiss();
            showMessage({
                message: 'Sucesso!',
                description: 'Cliente Editado com Sucesso!',
                type: 'info',
                duration: 3500,
                textStyle: {
                    fontSize: 15
                }
            })
            handleRefresh();

        }catch(error){
            Alert.alert('Error:', error.message) 
        }
    };

    function handleEditClick(){
        setEdit(true);
        setIcon(true);
    };

    function handleCancel(){
        setEdit(false);
        setIcon(false);
        Keyboard.dismiss();
    };

    return (
        <KeyboardAwareScrollView>
        <Formik
            initialValues={{ name: item.name , street: item.street, num: item.num, neighborhood: item.neighborhood, city: item.city, state: item.state, phone: item.phone}}
            onSubmit={values => handleEditClient(values)}
            validationSchema={yup.object().shape({
                name: yup
                    .string()
                    .required("Insira o nome do cliente!"),
                street: yup
                    .string()
                    .required('Insira a rua do cliente!'),
                num: yup
                    .number('Você digitou um texto!')
                    .required('Insira o numero residencial do cliente!'),
                neighborhood: yup
                    .string()
                    .required('Insira o bairro do cliente!'),
                city: yup
                    .string()
                    .required('Insira a cidade do cliente!'),
                state: yup
                    .string()
                    .required('Insira o estado do cliente!'),
                phone: yup
                    .string(),
            })}
        >
             {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                  <View style={styles.containerForm}>
                    <View style={{flexDirection:'row', height: hp(50), alignItems: 'center', justifyContent: 'space-between'}}>
                        <Icon name='arrow-back' size={30} color='white' style={{marginLeft: 8}} onPress={() => navigation.goBack()}/>
                        <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 20, color:'white', }}>Ficha do Cliente</Text>
                            {!icon ? (
                                <Icon   name="edit" 
                                        size={30} color='white'  
                                        style={{marginRight: 8}}
                                        onPress={handleEditClick}
                                />
                            ) : (
                            <View style={{flexDirection: 'row'}}>
                                <Icon   name="done"
                                        size={30} 
                                        style={{marginRight: 15}}
                                        disabled={!isValid}
                                        color='white' 
                                        onPress={handleSubmit}
                                />
                                <Icon   name="cancel"
                                        size={30} 
                                        color='white' 
                                        style={{marginRight: 8}}
                                        onPress={handleCancel}
                                />
                            </View>
                            )}
                    </View>
                  <Divider style={{backgroundColor: 'white', height: hp(2)}}/>
                    <View style={styles.nameView}>
                        <Text style={styles.title}>Nome</Text>
                        <TextInput 
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={() => setFieldTouched('name')}
                            placeholder='Fulano de tal'
                            editable={edit}
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
                                editable={edit}
                                style={styles.inputStreet}
                            />
                            {touched.street && errors.street &&
                                <Text style={{ fontSize: 15, color: 'red', marginLeft: 10, fontWeight: 'bold' }}>{errors.street}</Text>
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
                                editable={edit}
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
                            editable={edit}
                            placeholder='Coophavilla II'
                        />
                        {touched.neighborhood && errors.neighborhood &&
                            <Text style={{ fontSize: 15, color: 'red', marginLeft: 10, fontWeight: 'bold' }}>{errors.neighborhood}</Text>
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
                                editable={edit}
                                style={styles.inputCity}
                            />
                            {touched.city && errors.city &&
                                <Text style={{ fontSize: 15, color: 'red', marginLeft: 10, fontWeight: 'bold' }}>{errors.city}</Text>
                            }
                        </View>
                        <View style={styles.stateView}>
                            <Text style={styles.title}>Estado</Text>
                            <TextInput
                                value={values.state}
                                onChangeText={handleChange('state')}
                                onBlur={() => setFieldTouched('state')}
                                placeholder='MS'
                                editable={edit}
                                style={styles.inputState}
                            />
                            {touched.state && errors.state &&
                                <Text style={{ fontSize: 15, color: 'red', marginLeft: 10, fontWeight: 'bold' }}>{errors.state}</Text>
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
                                    editable={edit}
                                    style={styles.inputPhone}
                                />
                                {touched.phone && errors.phone &&
                                    <Text style={{ fontSize: 10, color: 'red', fontWeight: 'bold' }}>{errors.phone}</Text>
                                }
                            </View>
                            <View style={styles.dateView}>
                                <Text style={styles.title}>Data</Text>
                                <DatePicker
                                    disabled={!edit}
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
             
                <Divider style={{backgroundColor: 'white', paddingVertical: 1, marginVertical: 5, marginTop: -6}}/>
                <ListProdEdit list={item.products} Client={item} register={false}/>
            </View>
            )} 
        </Formik>
    </KeyboardAwareScrollView>
    )
};

const styles = StyleSheet.create({
    containerForm : {
        flex: 1,
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