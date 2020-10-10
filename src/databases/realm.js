import Realm from 'realm';
import Schema from './schemas'

export default function getRealm(){
    return Realm.open( {
        schema: [Schema.ClientSchema, Schema.ProductSchema],
        schemaVersion: 106,
    });
}