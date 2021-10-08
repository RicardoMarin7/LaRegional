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

Sqlite.transaction(tx => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS PRODUCTS (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    code TEXT UNIQUE,
                    cost REAL,
                    description TEXT,
                    price REAL,
                    tax TEXT,
                    line TEXT,
                    warehouse1 NUMERIC,
                    warehouse2 NUMERIC)`,
    [],
    (tx, result) => null,
    error => console.log('Error', error))
})

Sqlite.transaction(tx => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS LINES (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    line TEXT UNIQUE,
                    description TEXT)`,
    [],
    (tx, result) => null,
    error => console.log('Error', error))
})

Sqlite.transaction(tx => {
    tx.executeSql(`CREATE TABLE IF NOT EXISTS PROVIDERS (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    provider TEXT UNIQUE,
                    name TEXT)`,
    [],
    (tx, result) => null,
    error => console.log('Error', error))
})




export default Sqlite