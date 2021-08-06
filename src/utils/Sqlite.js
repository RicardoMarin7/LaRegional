import SQLite from 'react-native-sqlite-storage'

const Sqlite = SQLite.openDatabase({
    name:'LaRegional',
    location:'default'
}, () => console.log('Successful connection'), error => console.log('Error', error))

Sqlite.transaction(tx => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT, supervisor INTEGER, user TEXT)`,
    [],
    (tx, result) => null,
    error => console.log('Error', error))
})


export default Sqlite