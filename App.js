import React, { useMemo, useState, useEffect} from 'react'
import { 
  NavigationContainer,
  DarkTheme as DarkThemeNavigation,
} from '@react-navigation/native'

import { 
  Provider as PaperProvider,
  DarkTheme as DarkThemePaper,
} from 'react-native-paper'
import Navigation from './src/navigation/Navigation'
import PreferencesContext from './src/context/PreferencesContext'
import CloudContext from './src/context/CloudContext'
import Login from './src/screens/login'
import firestore from './src/utils/firebase'
import Sqlite from './src/utils/Sqlite'
import { ToastAndroid } from 'react-native'
import DeviceInfo from 'react-native-device-info'

const App = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [lines, setLines] = useState([])

  const primaryColor = '#f04e60'
  const secondaryColor = '#d04959'
  const backgroundColor = '#232429'
  const secondaryBackgroundColor = '#303038'
  const textColor = '#FFFFFF'

  DarkThemePaper.colors.primary = '#f04e60'
  DarkThemePaper.colors.accent = '#d04959'
  DarkThemePaper.colors.text = '#FFFFFF'

  DarkThemeNavigation.colors.background = '#232429'
  DarkThemeNavigation.colors.card = '#232429'

  const getLines = async (isLocalEmpty) => {
    try {
      let data
      console.log('Getting Lines')
      const response = await firestore.collection(`Lineas${DeviceInfo.getUniqueId()}`).limit(1).get()
      
      if(response.empty){
        data = await firestore.collection(`Lineas`).get()
      }else{
        data = await firestore.collection(`Lineas${DeviceInfo.getUniqueId()}`).where('app', '==', false).get()
      }

      if(data.empty){
        console.log('No hay lineas por descargar')
        return
      }

      data.forEach( async (lineData) =>{
        const line = lineData.data()
        console.log('line', line)
        Sqlite.transaction( tx => {
          tx.executeSql(`SELECT * FROM lines WHERE line = ?`,
            [line.line],
            (tx, results) =>{
              if(results.rows.length > 0){
                console.log('Update')
                tx.executeSql(`UPDATE lines SET 
                              description = ? 
                              WHERE line = ?`,
                [ line.description,
                  line.line
                ],
                async (tx, result) => {
                  await firestore.collection(`Lineas${DeviceInfo.getUniqueId()}`).doc(line.line).set({
                    ...line,
                    app: true
                  }, {merge: true})
                  console.log('Linea Actualizada con exito', line.line )
                },
                error => console.log('Error', error))
              }else{
                tx.executeSql(`INSERT INTO lines (line, description)
                              VALUES(?,?)`,
                [
                  line.line,
                  line.description
                ],
                async (tx, result) => {
                  await firestore.collection(`Lineas${DeviceInfo.getUniqueId()}`).doc(line.line).set({
                    ...line,
                    app: true
                  }, {merge: true})
                  console.log('Linea Guardada con exito', line.line )
                },
                error => console.log('error'))
              }
            },
            error => console.log(error) //Callback de error
          )
        })
      })
    } catch (error) {
      console.log('Error', error)
      ToastAndroid.showWithGravity(error.toString(), ToastAndroid.LONG, ToastAndroid.CENTER)
    }
  }

  const getProducts = async (isLocalEmpty) => {
    try {
      let data
      console.log('Getting Products')
      const response = await firestore.collection(`Productos${DeviceInfo.getUniqueId()}`).limit(1).get()
      
      if(response.empty || isLocalEmpty){
        data = await firestore.collection(`Productos`).get()
      }else{
        data = await firestore.collection(`Productos${DeviceInfo.getUniqueId()}`).where('app', '==', false).get()
      }

      if(data.empty){
        console.log('No hay productos por descargar')
      }
      
      data.forEach( async (productData) =>{
        const product = productData.data()
        Sqlite.transaction( tx => {
          tx.executeSql(`SELECT * FROM products WHERE code = ?`,
            [product.code],
            (tx, results) =>{
              if(results.rows.length > 0){
                console.log('Update')
                tx.executeSql(`UPDATE products SET 
                              description = ?, 
                              cost = ?, 
                              price = ?, 
                              tax = ?, 
                              line = ? WHERE code = ?`,
                [ product.description,
                  product.cost,
                  product.price,
                  product.tax,
                  product.line,
                  product.code
                ],
                async (tx, result) => {
                  await firestore.collection(`Productos${DeviceInfo.getUniqueId()}`).doc(product.code).set({
                    ...product,
                    app: true
                  }, {merge: true})
                  console.log('Producto Actualizado con exito', product.code )
                },
                error => console.log('Error', error))
              }else{
                tx.executeSql(`INSERT INTO products (code, description, cost, price, tax, line)
                              VALUES(?,?,?,?,?,?)`,
                [
                  product.code,
                  product.description,
                  product.cost,
                  product.price,
                  product.tax,
                  product.line
                ],
                async (tx, result) => {
                  await firestore.collection(`Productos${DeviceInfo.getUniqueId()}`
                  ).doc(product.code).set({
                    ...product,
                    app: true
                  }, {merge: true})
                  console.log('Producto Guardado con exito', product.code )
                },
                error => console.log(error))
              }
            },
            error => console.log(error) //Callback de error
          )
        })
      })
    } catch (error) {
      ToastAndroid.showWithGravity(error.toString(), ToastAndroid.LONG, ToastAndroid.CENTER)
      console.log(error)
    }
  }

  useEffect(() => {
    (async () =>{
        try {
          const deviceName = await DeviceInfo.getDeviceName()
          const uniqueID = DeviceInfo.getUniqueId()
          await firestore.collection('Dispositivos').doc(uniqueID).set({
            id: uniqueID,
            name: deviceName,
            model: DeviceInfo.getModel()
          }, {merge: true})
          console.log(`Dispositivo ${uniqueID} Guardado con éxito ${deviceName}`, )
        } catch (error) {
          console.log('Error', error)
          ToastAndroid.showWithGravity(error.toString(), ToastAndroid.LONG, ToastAndroid.CENTER)
        }
      }
    )()
  }, []);



  // useEffect(() => {
  //   (async () =>{
  //     const response = (await firestore.collection('Lineas').get()).docs
  //     const lines = response.map( line => (
  //         line.data()
  //     ))
  //     setLines(lines)
  //   })()
  // }, []);

  // useEffect(() => {
  //   (async () =>{
  //     const response = (await firestore.collection('Usuarios').get()).docs
  //     const users = response.map( user => (
  //         user.data()
  //     ))
  //     setUsers(users)
  //   })()
  // }, []);


  const cloudContext = useMemo(
    () =>({
    lines: lines,
    products: products,
    getLines,
    getProducts,
    setLines,
    setProducts
  }), [lines, products])

  const preferencesContext = useMemo(
    () =>({
    primaryColor,
    secondaryColor,
    backgroundColor,
    textColor,
    secondaryBackgroundColor,
    user
  }), [primaryColor, secondaryColor, backgroundColor, secondaryBackgroundColor, textColor, user])

  return (
    <CloudContext.Provider value={cloudContext}>
      <PreferencesContext.Provider value={preferencesContext}>
        <PaperProvider theme={DarkThemePaper}>
          { user ? (
            <NavigationContainer theme={DarkThemeNavigation}>
              <Navigation />
            </NavigationContainer>
          ) : <Login setUser={setUser} />}    
        </PaperProvider>
      </PreferencesContext.Provider>
    </CloudContext.Provider>
  );
}

export default App;