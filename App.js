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
  const [providers, setProviders] = useState([]);

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
      
      if(response.empty || isLocalEmpty){
        data = await firestore.collection(`Lineas`).get()
      }else{
        data = await firestore.collection(`Lineas${DeviceInfo.getUniqueId()}`).where('app', '==', false).get()
      }

      if(data.empty){
        console.log('No hay lineas por descargar')
        return
      }

      const linesTemp = []

      data.forEach( async (lineData) =>{
        const line = lineData.data()
        linesTemp.push(line)
      })

      for( const line of linesTemp ){
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
      }
      
      await setLinesToState()


      return true
    } catch (error) {
      console.log('Error', error)
      ToastAndroid.showWithGravity(error.toString(), ToastAndroid.LONG, ToastAndroid.CENTER)
    }
  }

  const getProducts = async (isLocalEmpty) => {
    try {
      console.log('Products LocalEmpty', isLocalEmpty)
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

      const productsTemp = []
      
      data.forEach( async (productData) =>{
        const product = productData.data()
        productsTemp.push(product)
      })

      for( const product of productsTemp ){
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
                              line = ?, warehouse1 = ?, warehouse2 = ? WHERE code = ?`,
                [ product.description,
                  product.cost,
                  product.price,
                  product.tax,
                  product.line,
                  product.warehouse1,
                  product.warehouse2,
                  product.code,
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
                tx.executeSql(`INSERT INTO products (code, description, cost, price, tax, line, warehouse1, warehouse2)
                              VALUES(?,?,?,?,?,?,?,?)`,
                [
                  product.code,
                  product.description,
                  product.cost,
                  product.price,
                  product.tax,
                  product.line,
                  product.warehouse1,
                  product.warehouse2
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
      }

      await setProductsToState()

      return true
    } catch (error) {
      ToastAndroid.showWithGravity(error.toString(), ToastAndroid.LONG, ToastAndroid.CENTER)
      console.log(error)
    }
  }

  const getProviders = async (isLocalEmpty) =>{
    try {
      let data
      console.log('Getting Providers')
      const response = await firestore.collection(`Proveedores${DeviceInfo.getUniqueId()}`).limit(1).get()
      if(response.empty || isLocalEmpty){
        data = await firestore.collection(`Proveedores`).get()
      }else{
        data = await firestore.collection(`Proveedores${DeviceInfo.getUniqueId()}`).where('app', '==', false).get()
      }

      if(data.empty){
        console.log('No hay Proveedores por descargar')
        return
      }

      const providersTemp = []

      data.forEach( async (providerData) =>{
        const provider = providerData.data()
        providersTemp.push(provider)
      })

      for( const provider of providersTemp ){
        Sqlite.transaction( tx => {
          tx.executeSql(`SELECT * FROM providers WHERE provider = ?`,
            [provider.provider],
            (tx, results) =>{
              if(results.rows.length > 0){
                console.log('Update')
                tx.executeSql(`UPDATE providers SET 
                              name = ? 
                              WHERE provider = ?`,
                [ provider.name,
                  provider.provider
                ],
                async (tx, result) => {
                  await firestore.collection(`Proveedores${DeviceInfo.getUniqueId()}`).doc(provider.provider).set({
                    ...provider,
                    app: true
                  }, {merge: true})
                  console.log('Proveedor actualizado con exito', provider.provider )
                },
                error => console.log('Error', error))
              }else{
                tx.executeSql(`INSERT INTO providers (provider, name)
                              VALUES(?,?)`,
                [
                  provider.provider,
                  provider.name
                ],
                async (tx, result) => {
                  await firestore.collection(`Proveedores${DeviceInfo.getUniqueId()}`).doc(provider.provider).set({
                    ...provider,
                    app: true
                  }, {merge: true})
                  console.log('Proveedor guardado con exito', provider.provider )
                },
                error => console.log(error))
              }
            },
            error => console.log(error) //Callback de error
          )
        })
      }
      
      await setProvidersToState()


      return true
    } catch (error) {
      console.log('Error', error)
      ToastAndroid.showWithGravity(error.toString(), ToastAndroid.LONG, ToastAndroid.CENTER)
    }
  }

  const setProvidersToState = async () =>{
    await Sqlite.transaction(tx => {
      tx.executeSql(`SELECT * FROM PROVIDERS`,
      [],
      (tx, result) =>{
          let providersTemp = []
          for (let i = 0; i < result.rows.length; i++) {
              providersTemp.push(result.rows.item(i))
          }
          setProviders(providersTemp)
      },
      error => console.log('Error', error))
    })
  }

  const setLinesToState = async () =>{
    await Sqlite.transaction(tx => {
      tx.executeSql(`SELECT * FROM LINES`,
      [],
      (tx, result) =>{
          let linesTemp = []
          for (let i = 0; i < result.rows.length; i++) {
              linesTemp.push(result.rows.item(i))
          }
          setLines(linesTemp)
      },
      error => console.log('Error', error))
    })
  }

  const setProductsToState = () =>{
      Sqlite.transaction( tx => {
        tx.executeSql(`SELECT * FROM PRODUCTS`,
        [],
        (tx, result) =>{
            let productTemp = []
            setProductsLength(result.rows.length)
            for (let i = 0; i < result.rows.length; i++) {
                productTemp.push(result.rows.item(i))
            }
            setProducts(productTemp)
        },
        error => console.log('Error', error))
      })    
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




  const cloudContext = useMemo(
    () =>({
    lines: lines,
    products: products,
    providers: providers,
    getLines,
    getProviders,
    setProviders,
    getProducts: (isLocalEmpty) => getProducts(isLocalEmpty),
    setLines,
    setProducts,
    setProductsToState
  }), [lines, products, providers])

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