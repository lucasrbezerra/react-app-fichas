import React, {useState, useCallback, Fragment, useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { AddButtonProd } from './AddButton';
import { ProdForm } from './Form';
import { ProdEdit } from './Edit';
import { ProdCollect } from './Collect';
import { deleteProd } from '../../databases/CRUD';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import getRealm from '../../databases/realm';
import { showMessage } from 'react-native-flash-message';


export function ListProdEdit({list, Client, onRegister, register}) {

  const [modalCloseProd, setModalCloseProd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [item, setItem] = useState();
  const [modalCollect, setModalCollect] = useState(false);
  const [product, setProduct] = useState(list.length > 0 ? list : []);


  const onDone = useCallback(val => {
      setProduct(val);
      if(register){
        onRegister(product);
      }
  }, []);


  const Close = () => {
    setModalCloseProd(false);
  };

  const CloseEdit = () => {
    setModalEdit(false);
  };

  const CloseCollect = () => {
    setModalCollect(false);
  };

  async function loadProd() {
    const realm = await getRealm();
    const data = realm.objects('Client').filtered(`id = "${Client.id}"`);
    setProduct(data[0].products);
  };

  async function DeleteProd(item){
    deleteProd(item);
    loadProd();
    showMessage({
      message: "Atenção!",
      description: `${item.name} foi excluido da lista de produtos!`,
      type: 'warning',
      duration: 3000,
      textStyle: {
          fontSize: 15,
      }
    })
  };

  function handleDelete(item){
    Alert.alert(
      "Atenção!",
      `Você tem certeza em deletar ${item.name} da lista de produtos?`,
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => DeleteProd(item) }
      ],
      { cancelable: false }
    )
  };

  const handleEdit = ({item}) => {
    setModalEdit(true);
    setItem(item);
  };

  const handleCollect = ({item}) => {
    setModalCollect(true);
    setItem(item);
  };
  
  return(
    <View style={{ flexDirection:'column'}}>
      <View style={{justifyContent: 'center'}}>
        <Text style={styles.BigTitle}>Mercadoria</Text>
        <AddButtonProd
          onPress={() => setModalCloseProd(true)}
          size={24}
        />
      </View>
      <View>
        { product.map((item, index) => {
          return(
            <View key={item.id}>
              <ProductItem 
                  item={item}
                  onPress={() => handleCollect({item})}
                  index={index}
                  onPressDelete={() => handleDelete(item)}
                  onPressEdit={() => handleEdit({item})}
              />
            </View>
            )
        })}

        <Modal visible={modalEdit} animationType='slide' transparent={true}>      
          <ProdEdit Close={CloseEdit} onDone={onDone} item={item} Client={Client}/>  
        </Modal>
        
        <Modal visible={modalCollect} animationType='slide' transparent={true} >
          <ProdCollect Close={CloseCollect} onDone={onDone} item={item} Client={Client}/>
        </Modal>

        <Modal visible={modalCloseProd} animationType='slide' transparent={true}>
          <ProdForm Close={Close} onDone={onDone} list={product} Client={Client} register={false}/>        
        </Modal>
      </View>
    </View>
  )   
};

export const RightAction = ({ progress, onPressDelete, onPressEdit }) => {
  return(
    <View style={styles.RightAction}>
      <TouchableOpacity style={styles.iconDelete} onPress={onPressDelete}>
        <Icon 
          name="delete"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconEdit} onPress={onPressEdit}>
        <Icon 
          name="edit"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  )
};

function dateToday(){

  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();

  return new Date(year, month, day);

};

const ProductItem = ({ item, onPress, index , onPressEdit, onPressDelete }) => (
    <Swipeable
      renderRightActions={(progress) => <RightAction progress={progress} onPressDelete={onPressDelete} onPressEdit={onPressEdit}/>}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={styles.item}>
          {  item.datePay == dateToday().toString() ? (
            <View style={styles.BandLeftEqual}>
            </View> 
          ) : (
            <View style={styles.BandLeftNotEqual}>
            </View> 
          )}
          <View style={{flex: 1, flexDirection:'column', start: 10}}>
            <Text style={styles.Title}> Mercadoria:</Text>
            <Text style={styles.Name} > {item.name} </Text>
            <Text style={styles.Title}> Parcelas: <Text style={styles.Subtitle}> {item.numInstallmentsPaid} / {item.numInstallments} </Text>
            </Text>
          </View>
          <View style={styles.BandRight}>
            <Text style={styles.money}> R$ {item.valuePay} </Text>
          </View>
        </View>
      </TouchableOpacity> 
    </Swipeable>
);


const styles = StyleSheet.create({
  BandLeftEqual: {
    backgroundColor: '#dd2c00',
    width: 8,
    height: 90,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,      
  },
  BandLeftNotEqual: {
    backgroundColor: '#084D6E',
    width: 8,
    height: 90,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,      
  },
  modalContent: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: 'red',
    marginLeft: 30,
    marginRight: 30,
    marginVertical: 100,
    borderRadius: 10,
  },
  BandRight: {
    backgroundColor: '#084D6E',
    width: 100,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center'
  },
  BigTitle: {
    color:'white',
    fontSize: 20,
    marginLeft: 10,
    marginVertical: 6,
    paddingVertical: 6,
    fontFamily: 'Nunito-Bold',
},
  Title: {
    color: 'white',
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    marginTop: 3
  },
  Name: {
    color:'#BB86FC',
    fontSize: 17,
    marginBottom: 10,
    fontWeight: 'bold'
},
  money: {
    color: '#BB86FC',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Black'

    },
  Subtitle: {
    color:'#BB86FC',
    fontSize: 15,
    fontWeight: 'bold'
  },
  item: {
    backgroundColor:'#121212', 
    marginLeft: 10, 
    marginRight: 8, 
    marginVertical: 8, 
    borderRadius: 5 ,  
    flexDirection:'row',
  },
  IconClose : {
    marginBottom: 5,
    padding: 10,
    alignSelf: 'flex-start',
    marginLeft: 5
  },
  RightAction : {
    marginVertical: 8,
    marginRight: 10,
    height: 90,
    width: 90,
  },
  iconDelete: {
    flex: 1,
    backgroundColor: '#dd2c00',
    alignItems: 'center',
    justifyContent: 'center', 
    borderRadius: 10,
  },
  iconEdit : {
    flex: 1,
    backgroundColor: '#007c8a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 5
  },

});