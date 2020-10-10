import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Modal, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { Divider , SearchBar, Avatar } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { DetailsScreen } from './DetailsScreen';
import { ClientForm } from '../components/clients/Form';
import { AddButtonClient } from '../components/clients/AddButton';
import { FAB } from 'react-native-paper';
import { deleteClient, deleteAllClient, deleteAllProd } from '../databases/CRUD';
import { showMessage } from 'react-native-flash-message';
import getRealm from '../databases/realm';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import LinearGradient from 'react-native-linear-gradient';
import { hp } from '../components/dimen';

const Stack = createStackNavigator();


export function StackClient(){
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="ClientScreen" component={ClientScreen} />
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
    </Stack.Navigator>
  )
};

 export function ClientScreen({navigation}){

  const [modalOpen, setModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [iconSearch, setIconSearch] = useState(false);

  
  async function loadClient() {

    const realm = await getRealm();

    const data = realm.objects('Client').sorted('name');
    
    //console.log("DATA: ", data[0].products[0].datePay);
    setClients(data);

    setFiltered(data);
  };

  const handleRefresh = () => {
    loadClient();
  };

  function DeleteClient({item}){
    deleteClient({item});
    loadClient();
    showMessage({
      message: "Atenção!",
      description: `${item.name} foi excluido da lista de clientes!`,
      type: 'warning',
      duration: 3500,
      textStyle: {
          fontSize: 15,
      }
    })
  };

  async function handleDelete({item}){
    Alert.alert(
      "Atenção!",
      `Você tem certeza em deletar ${item.name} da lista de clientes?`,
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => DeleteClient({item}) }
      ],
      { cancelable: false }
    )
  };

  const Close = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    loadClient();
  },[]);

  
  useEffect(function handleSearch(){
    if(query != ''){
      let lowerCaseQuery = query.toLowerCase();
      let newClients = clients.filter((client) => client.name.toLowerCase().startsWith(lowerCaseQuery));
      console.log(newClients);
      setFiltered(newClients);
    }else{
      setFiltered(clients);
    }
}, [query]);

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: '#660000', height: hp(60)}}>
      {!iconSearch ? (
          <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
            <View>
              <Text style={{color: 'white', marginStart: 8, fontSize: 25, fontWeight:'bold', marginVertical: -2}}> Clientes</Text>
              <Text style={{color:'white', marginStart: 12, marginTop: 3 , fontSize: 14, fontWeight:'bold', marginVertical: -4}}> {filtered.length} Clientes </Text>
            </View>
            <MaterialIcons style={{color: 'white', marginRight: 8, marginVertical: 8}}
              name="search"
              size={35}
              onPress={() => setIconSearch(true)}
            />
          </View>
          ) : (
          <View style={{flexDirection:'row', backgroundColor:'#273443', flex: 1}}>
            <MaterialIcons style={{color: 'grey', marginStart: 13, marginVertical: 12}}
              name="arrow-back"
              size={28}
              onPress={() => setIconSearch(false)}
            />
            <SearchBar
              placeholder="Buscar Cliente..."
              placeholderTextColor='grey'
              platform='android'
              onChangeText={setQuery}
              value={query}
              searchIcon={false}
              cancelIcon={false}
              containerStyle={{backgroundColor: '#273443', height: 50, flex: 1}}
              inputStyle={{color: 'grey'}}
            />
          </View>
      )}
      </View>

        <FlatList 
          data={filtered}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item, index }) => (
          <UserItem
            onPress={() => navigation.navigate('DetailsScreen',
                          { item: item, 
                            handleRefresh: handleRefresh
                          })}
            index={index}
            item={item}  
            onRightPress={() => handleDelete({item})}
            LetrasAvatar={item.name} 
          />
          )}
          keyExtractor={(item, index) => item.id.toString()}
          ItemSeparatorComponent={() => <Divider style={styles.separator} />}
        />
          <Modal visible={modalOpen} animationType='fade'>
            <LinearGradient colors={['#660000', 'black']} start={{x: 0.0, y: 0.10}} end={{x: 0.0, y: 1.25}} style={styles.linearGradient}>
              <View style={styles.modalContent}>
                <MaterialIcons style = {styles.IconClose}
                  name="close"
                  size={24}
                  color={'white'}
                  onPress={ () => setModalOpen(false)}
                />
                <View style = {styles.Forms}>
                  <ClientForm Close={Close}/>
                </View>
              </View>
            </LinearGradient>
          </Modal>
                          
      <AddButtonClient 
        size={24}
        onPress={() => setModalOpen(true)}
      />
      
    </View>
  )
};

export const RightAction = ({ progress, onPress }) => {
  return(
    <TouchableOpacity onPress={onPress}>
      <View style={styles.rightAction}>
        <Icon 
          name='delete'
          size={24}
          color='#fff'
          style={{padding: 30}}
        />
      </View>
    </TouchableOpacity>
  )
};

var AvatarColor = function(i){
      let color;
      if(i % 2 === 0){
        color = "#660000"
      }else{
        color = "#000000"
      }
      return color;
};

const UserItem = ({ LetrasAvatar ,item, index, onRightPress, onPress }) => (
  <Swipeable
    renderRightActions={(progress) => <RightAction progress={progress} onPress={onRightPress}/>}
  >
    <TouchableOpacity onPress={onPress}>
    <View style={{flex: 1, backgroundColor:'#121212', paddingHorizontal: 10, paddingVertical: 15, flexDirection:'row'}}>
      <View>
        <Avatar rounded title={LetrasAvatar[0]} size='medium' overlayContainerStyle={{backgroundColor: AvatarColor(index), borderWidth: 1, borderColor: '#121212'}} />
      </View>
      <View style={{flexDirection:'column', start: 10}}>
        <Text style={styles.Title} > {item.name} </Text>
        <Text style={styles.Subtitle} > {item.street} </Text>
      </View>
    </View>
    </TouchableOpacity>
  </Swipeable>
);


const styles = StyleSheet.create({
    container : {
      flex: 1,
      backgroundColor:'#121212'
    },
    modalContent: {
      flex: 1,
      flexDirection:'column',
    },
    IconClose : {
      marginBottom: 5,
      padding: 10,
      alignSelf: 'center',
    },
    Forms: {
      flex: 1,
    },

  icon: {
      marginHorizontal: 5,
      backgroundColor: "#660000",
      alignItems: 'center',
      justifyContent: 'center',
      width: 72,
      height: 72,
      borderRadius: 36,
      shadowColor: 'white',
      shadowRadius: 5,
      shadowOffset: { height: 10 },
      shadowOpacity: 0.3,
      borderWidth: 6,
      borderColor: "#FFF"
    },

    textIcon: {
        color:'white'
    },
    Title: {
      color:'white',
      fontSize: 17,
  },
    Subtitle: {
    color:'grey',
    fontSize: 15,
  },
    separator: {
      backgroundColor:'grey',
      marginLeft: 75,
      marginRight: 10,
    },
    button: {
      backgroundColor:'#660000', 
      marginLeft: 50,
      marginRight:50, 
      borderRadius:10,
      marginVertical: 20,
  },
  leftAction : {
    backgroundColor:'#388e3c',
    justifyContent: 'center',
    alignItems:'flex-start',
    flex: 1,
  },
  actionText: {
    color:'#fff',
    fontWeight: '600',
    padding: 20,
    start: 25,
    fontSize: 5,
  },
  rightAction: {
    backgroundColor: '#dd2c00',
    alignItems:'center',
    justifyContent: 'center',
  },
  HeaderStyle : {
    marginHorizontal: -1,
    elevation: 1,
    height: 60,
    borderWidth: 1,
    borderColor: 'black',
  },
  linearGradient: {
    flex: 1,
  },
  fab: {
    backgroundColor: "#660000",
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});