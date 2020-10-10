import React, {useState, useCallback} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AddButtonProd } from './AddButton';
import { ProdForm } from '../products/Form';
import { deleteProd } from '../../databases/CRUD';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';


export function ListProdRegister({list, onRegister}) {

const [modalCloseProd, setModalCloseProd] = useState(false);
const [product, setProduct] = useState(list.length > 0 ? list : []);

const onDone = useCallback(val => {
  setProduct(val);
  onRegister(product);
}, []);


const Close = () => {
  setModalCloseProd(false);
}

async function handleDelete(item){
  deleteProd(item);
}

    return(
        <View style={{ flexDirection:'column'}}>
          <View style={{justifyContent: 'center', marginTop: 8}}>
            <Text style={styles.BigTitle}>Mercadorias</Text>
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
                    onPress={() => console.log("Apenas Deletar")}
                    index={index}
                    onPressDelete={() => handleDelete(item)}             
                />
            </View>
            )
            })}

            <Modal visible={modalCloseProd} animationType='slide' transparent={true}>      
              <ProdForm Close={Close} onDone={onDone} list={product} register={true}/>  
            </Modal>
          </View>
        </View>
    )   
};

export const RightAction = ({ progress, onPressDelete }) => {
  return(
    <View style={styles.RightAction}>
      <TouchableOpacity style={styles.iconDelete} onPress={onPressDelete}>
        <Icon 
          name="delete"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  )
};

const ProductItem = ({ item, onPress, index , onPressDelete }) => (
    <Swipeable
      renderRightActions={(progress) => <RightAction progress={progress} onPressDelete={onPressDelete} />}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={styles.item}>
          <View style={styles.fitaLeft}>
          </View>
          <View style={{flex: 1, flexDirection:'column', start: 10}}>
            <Text style={styles.Title}> Mercadoria:</Text>
            <Text style={styles.Nome} > {item.name} </Text>
            <Text style={styles.Title}> Parcelas: <Text style={styles.Subtitle}> {item.numInstallmentsPaid} / {item.numInstallments} </Text>
            </Text>
          </View>
          <View style={styles.fitaRight}>
            <Text style={styles.money}> R$ {item.valuePay} </Text>
          </View>
        </View>
      </TouchableOpacity> 
    </Swipeable>
);


const styles = StyleSheet.create({
  fitaLeft: {
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
  fitaRight: {
    backgroundColor: '#084D6E',
    width: 100,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center'
    
  },
  list :{
    flex: 1,
    flexDirection:'column'
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
      marginTop: 3,

  },
  Nome: {
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
  iconDelete: {
    flex: 1,
    backgroundColor: '#dd2c00',
    alignItems: 'center',
    justifyContent: 'center', 
    borderRadius: 10,
  },
  RightAction : {
    marginVertical: 8,
    marginRight: 10,
    height: 90,
    width: 90,
  },
});