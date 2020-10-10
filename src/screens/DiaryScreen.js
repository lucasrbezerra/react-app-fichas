import React,{ useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, Text, Animated, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Divider ,SearchBar, Avatar } from 'react-native-elements';
import { DetailsScreen } from './DetailsScreen'
import { deleteAllClient, deleteAllProd } from '../databases/CRUD';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import getRealm from '../databases/realm';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { showMessage } from 'react-native-flash-message';
import { hp } from '../components/dimen';


const Stack = createStackNavigator();


export function StackDiary(){
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiaryScreen" component={DiaryScreen} />
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
    </Stack.Navigator>
  )
};

export function DiaryScreen ({navigation}) {

  const [refreshing, setRefreshing] = useState(false);
  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [iconSearch, setIconSearch] = useState(false);


  function date(){

    var dateFormated;

    var date = new Date();

    var dia = date.getDate();
    var mes = date.getMonth() + 1;
    var ano = date.getFullYear();

    if(dia >= 10 && mes >= 10){
      dateFormated =  dia + '/' + mes + '/' + ano;
    }
    else if(dia < 10 && mes >= 10){
      dateFormated = '0' + dia + '/' + mes + '/' + ano;
    }
    else if(dia >= 10 && mes < 10){
      dateFormated = dia + '/' + '0' + mes + '/' + ano;
    }else{
      dateFormated = '0' + dia + '/' + '0' + mes + '/' + ano;
    }
    return dateFormated;
  };

  function dateToday(){

    var date = new Date();
    var TimeZone = date.getTimezoneOffset() / 60;

    var dateFormated;

    var dia = date.getDate();
    var mes = (date.getMonth() + 1);
    var ano = date.getFullYear();

    if(dia >= 10 && mes >= 10){
      dateFormated =  ano + '-' + mes + '-' + dia + `@${TimeZone}:0:0:0`;
    }
    else if(dia < 10 && mes >= 10){
      dateFormated = ano + '-' + mes + '-' + '0' + dia + `@${TimeZone}:0:0:0`;
    }
    else if(dia >= 10 && mes < 10){
      dateFormated = ano  + '-' + '0' + mes + '-' + dia + `@${TimeZone}:0:0:0`;
    }else{
      dateFormated =  ano + '-' + '0' + mes + '-' + '0' + dia + `@${TimeZone}:0:0:0`;
    }
    
    return dateFormated;
  };

  async function loadClient() {

    const realm = await getRealm();

    const prod = realm.objects('Product').filtered(`datePay = ${dateToday()} AND lastDatePaid != ${dateToday()} AND valueRemaining != "0"`);

  
    var data = [];

    if(prod.length > 0){
      var aux = [];

      for(let i in prod){
        aux[i] = prod[i].owners[0];
      }

      data = aux;

    }else{
      data = prod;
    }
      
    setClients(data);
    setFiltered(data);
    
  };

  const handleRefresh = () => {
    loadClient();
  };

  const handleCollected = (item) => {
    loadClient();
    if(filtered.length > 0){
      showMessage({
        message: 'Informação',
        description: `o Cliente ${item.name} ainda tem mercadoria para ser cobrada!`,
        type: 'info',
        duration: 4000,
        textStyle: {
          fontSize: 15,
        }
      })
    }
  };

  useEffect(() => {
    loadClient();
}, []);


  useEffect(function handleSearch(){
  if(query != ''){
    let lowerCaseQuery = query.toLowerCase();
    let newClients = clients.filter((client) => client.nome.toLowerCase().startsWith(lowerCaseQuery));
    setFiltered(newClients);
  }else{
    setFiltered(clients);
  }
}, [query]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor:'#121212'}}>
    <View style={{backgroundColor: '#660000', height: hp(60)}}>
      {!iconSearch ? (
          <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
            <View>
              <Text style={{color: 'white', marginStart: 12, fontSize: 25, fontWeight:'bold', marginVertical: -2}}>Diária</Text>
      <Text style={{color:'white', marginStart: 12, marginTop: 3 , fontSize: 14, fontWeight:'bold', marginVertical: -4}}>{date()} - {filtered.length} Cliente</Text>
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
    <View style={{flex: 1}}>
      <FlatList 
        data={filtered}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item, index }) => (
          <UserItem
            onPress={() => navigation.navigate('DetailsScreen',
                          { item: item, 
                            handleRefresh: handleRefresh})}
            index={index}
            item={item}
            onSwipeableLeftOpen={() => handleCollected(item)}   
            CharAvatar={item.name} 
          />
            )}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={() => <Divider style={styles.separator}/>}
        />
        </View>
    </SafeAreaView>
  );
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

const LeftAction = (progress, dragX) => {
  const scale = dragX.interpolate({
    inputRange:[0,100],
    outputRange:[0, 1],
  })
  return (
    <View style={styles.leftAction}>
      <Animated.Text style={[styles.actionText, {transform: [{scale}]}]}> Cobrado! </Animated.Text>
    </View>
  )
};

const UserItem = ({ CharAvatar ,item, index, onSwipeableLeftOpen, onPress }) => (
  <Swipeable
    renderLeftActions={LeftAction}
    onSwipeableLeftOpen={onSwipeableLeftOpen}
  >
    <TouchableOpacity onPress={onPress}>
      <View style={{flex: 1, backgroundColor:'#121212', paddingHorizontal: 10, paddingVertical: 15, flexDirection:'row'}}>
        <View>
          <Avatar rounded title={CharAvatar[0]} size='medium' overlayContainerStyle={{backgroundColor: AvatarColor(index), borderWidth: 1, borderColor: '#121212'}} />
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
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 5,
    marginLeft: 18,
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
});
