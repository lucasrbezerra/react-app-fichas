import getRealm from './realm'
import { Alert } from 'react-native';

//Funções do Cliente

export async function insertClient(newClient) {

        const realm = await getRealm();

        realm.write(() => {
            realm.create('Client', newClient);
        });
        
};

export async function deleteClient({item}){
  
    try{
        const realm = await getRealm();

        const deletingClient = realm.objects('Client').filtered(`id = "${item.id}"`);
        
        realm.write(() => {
            if(deletingClient.length > 0){
                if(deletingClient[0].products.length > 0){
                    for(let p in deletingClient[0].products){
                        deleteProd(deletingClient[0].products[p]);
                    }
                }
                realm.delete(deletingClient);
            }
        });
    
    }catch(e){
        Alert.alert(`${e}`);
    }
};

export async function updateClient(ClientOld, ClientUp){
        
        const realm = await getRealm();

        realm.write(() => {
            let updatingClient = realm.objectForPrimaryKey('Client', ClientOld.id);
            updatingClient.name = ClientUp.name;
            updatingClient.street = ClientUp.street;
            updatingClient.num = ClientUp.num;
            updatingClient.neighborhood = ClientUp.neighborhood;
            updatingClient.city = ClientUp.city;
            updatingClient.state = ClientUp.state;
            updatingClient.phone = ClientUp.phone;
            updatingClient.dateRegister = ClientUp.dateRegister;
            updatingClient.products = ClientUp.products;
        });
};

export async function deleteAllClient(){
    try{
        const realm = await getRealm();

        const client = realm.objects('Client');

        realm.write(() => {
            if(client.length > 0){
                realm.delete(client);
            }
        })
    }catch(e){
        Alert.alert(`${e}`);
    }
};

//Funções dos Produtos

export async function insertProd(Client, data){

    const realm = await getRealm();

    realm.write(() => {
        Client.products.push(data);
    });

};

export async function deleteProd(item){

    try{
        const realm = await getRealm();

        const prod = realm.objects('Product').filtered(`id = "${item.id}"`);

        realm.write(() => {
            if(prod.length > 0){
                realm.delete(prod);
            }
        });
        
        }catch(e){
            Alert.alert(`${e}`);
        }
    
};

export async function deleteAllProd(){
    try{
        const realm = await getRealm();

        const prod = realm.objects('Product');

        realm.write(() => {
            if(prod.length > 0){
                realm.delete(prod);
            }
        })
    }catch(e){
        Alert.alert(`${e}`);
    }
};

export async function updateProd(OldProduct, NewProduct){
        
    const realm = await getRealm();

    let updatingProd = realm.objects('Product').filtered(`id = "${OldProduct.id}"`);

    try{
        realm.write(() => {
            updatingProd[0].name = NewProduct.name;
            updatingProd[0].qtd = NewProduct.qtd;
            updatingProd[0].valueProd = NewProduct.valueProd;
            updatingProd[0].numInstallments = NewProduct.numInstallments;
            updatingProd[0].valueEntered = NewProduct.valueEntered;
            updatingProd[0].dateBuy = NewProduct.dateBuy;
            updatingProd[0].valuePay = NewProduct.valuePay;
            updatingProd[0].datePay = NewProduct.datePay;
            updatingProd[0].valuePaid =  NewProduct.valuePaid;
            updatingProd[0].numInstallmentsPaid = NewProduct.numInstallmentsPaid;
            updatingProd[0].valueRemaining = NewProduct.valueRemaining;
        });
    }catch(e){
        Alert.alert(`${e}`);
    }
};

export async function collectProd(OldValue, NewValue){

    const realm = await getRealm();

    let updatingCollect = realm.objects('Product').filtered(`id = "${OldValue.id}"`);

    try{
        realm.write(() => {
            updatingCollect[0].valuePay = NewValue.valuePay;
            updatingCollect[0].datePay = NewValue.datePay;
            updatingCollect[0].valuePaid =  NewValue.valuePaid;
            updatingCollect[0].valueRemaining = NewValue.valueRemaining;
            updatingCollect[0].numInstallmentsPaid = NewValue.numInstallmentsPaid;
            updatingCollect[0].collected = NewValue.collected;
            updatingCollect[0].lastDatePaid = NewValue.lastDatePaid;
        })
    }catch(e){
        Alert.alert(`${e}`);
    }
};

