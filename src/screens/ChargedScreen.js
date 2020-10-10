import React,{ useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Divider, SearchBar, Avatar } from 'react-native-elements';
import { DetailsScreen } from './DetailsScreen';
import getRealm from '../databases/realm';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { hp } from '../components/dimen';


const Stack = createStackNavigator();


export function StackCharged(){

  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChargedScreen" component={ChargedScreen} />
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
    </Stack.Navigator>
  )
};

export function ChargedScreen({navigation}) {

  const [refreshing, setRefreshing] = useState(false);
  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [iconSearch, setIconSearch] = useState(false);
  const [received, setReceived] = useState(0);

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

  function totalToday(){
    var count = 0;

    for(let p in received){
      count += parseFloat(received[p].valuePaid);
    }

    return count;
  };

  async function loadClient() {

    const realm = await getRealm();

    const data = realm.objects('Client').filtered(`products.lastDatePaid = ${dateToday()}`).sorted('name');
    
    const prod = realm.objects('Product').filtered(`lastDatePaid = ${dateToday()}`);
   

    setReceived(prod);

    setClients(data);
    setFiltered(data);
  };

  const handleRefresh = () => {
    loadClient();
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
    <View style={{flex: 1, backgroundColor:'#121212'}}>
     <View style={{backgroundColor: '#660000', height: hp(60)}}>
      {!iconSearch ? (
          <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
            <View>
              <Text style={{color: 'white', marginStart: 12, fontSize: 25, fontWeight:'bold', marginVertical: -2}}>Já Cobrados</Text>
              <Text style={{color:'white', marginStart: 12, marginTop: 3 , fontSize: 14, fontWeight:'bold', marginVertical: -4}}> Valor Recebidos: R$ {totalToday()} </Text>
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
            CharAvatar={item.name} 
          />
            )}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={() => <Divider style={styles.separator}/>}
        />
      </View>
    </View>
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

const UserItem = ({ CharAvatar ,item, index, onPress }) => (

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
);


const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent : {
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
    backgroundColor:'#dd2c00',
    justifyContent: 'center',
    alignItems:'flex-end',
    flex: 1,
  },
  actionText: {
    color:'#fff',
    fontWeight: '600',
    padding: 20,
    marginRight: 30,
    fontSize: 5,
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
