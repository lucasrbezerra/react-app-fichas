export default class Schemas {
    
    static ProductSchema = { 
        name: 'Product',
        primaryKey: 'id',
        properties: {
            id: 'int',
            name: 'string',
            qtd: 'string',
            numInstallments: 'string',
            numInstallmentsPaid: 'int',
            valueProd: 'string',
            valueEntered: 'string',
            valuePay: 'string',
            valuePaid: 'string',
            valueRemaining: 'string',
            collected: 'bool',
            dateBuy: {type: 'date', optional: true},
            datePay: {type: 'date', optional: true},
            lastDatePaid: {type: 'date', optional: true},
            owners: {
                type: 'linkingObjects',
                objectType: 'Client',
                property: 'products'
            }
        }
    }
 
    static ClientSchema = {
        name: 'Client',
        primaryKey: 'id',
        properties: {
            id: 'int',
            name: 'string',
            street: 'string',
            num: 'string',
            neighborhood: 'string',
            city: 'string',
            state: 'string',
            phone: 'string',
            dateRegister: {type: 'date', optional: true},
            products: 'Product[]'
            }
        }
};
