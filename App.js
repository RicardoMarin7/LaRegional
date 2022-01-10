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
  const [loadingProducts, setLoadingProducts] = useState(true);

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

  const isLinesEmpty = async () =>{
    return new Promise((resolve, reject)=>{    
      try {
        let isLocalEmpty = false
        Sqlite.transaction( tx => {
          tx.executeSql(`SELECT * FROM LINES`,
          [],
          (tx, result) =>{
              if( result.rows.length < 1) isLocalEmpty = true
              resolve(isLocalEmpty)
          },
          error => console.log('Error', error))
        })
      } catch (error) {
        reject(false)
      }
    })
  }

  const isProductsEmpty = async () =>{
    return new Promise((resolve, reject)=>{    
      try {
        let isLocalEmpty = false
        Sqlite.transaction( tx => {
          tx.executeSql(`SELECT * FROM PRODUCTS`,
          [],
          (tx, result) =>{
              if( result.rows.length < 1) isLocalEmpty = true
              resolve(isLocalEmpty)
          },
          error => console.log('Error', error))
        })
      } catch (error) {
        reject(false)
      }
    })
  }

  const isProvidersEmpty = async () =>{
    return new Promise((resolve, reject)=>{    
      try {
        let isLocalEmpty = false
        Sqlite.transaction( tx => {
          tx.executeSql(`SELECT * FROM PROVIDERS`,
          [],
          (tx, result) =>{
              if( result.rows.length < 1) isLocalEmpty = true
              resolve(isLocalEmpty)
          },
          error => console.log('Error', error))
        })
      } catch (error) {
        reject(false)
      }
    })
  }

  const getLines = async (forceSyncAll) => {
    try {
      let data
      const isLocalEmpty = await isLinesEmpty()
      const response = await firestore.collection(`Lineas${DeviceInfo.getUniqueId()}`).limit(1).get()
      
      if(response.empty || isLocalEmpty){
        data = await firestore.collection(`Lineas`).get()
        console.log('Sync All Lines')
      }else{
        data = await firestore.collection(`Lineas${DeviceInfo.getUniqueId()}`).where('app', '==', false).get()
      }

      if(data.empty){
        console.log('No hay lineas por descargar')
        await setLinesToState()
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

  const getProducts = async (forceSyncAll) => {
    return new Promise( async (resolve, reject) =>{
      try {
        const isLocalEmpty = await isProductsEmpty()
        let data
        const response = await firestore.collection(`Productos${DeviceInfo.getUniqueId()}`).limit(1).get()
        
        if(response.empty || isLocalEmpty){
          data = await firestore.collection(`Productos`).get()
          console.log('Sync All Products')
        }else{
          data = await firestore.collection(`Productos${DeviceInfo.getUniqueId()}`).where('app', '==', false).get()
        }
  
        if(data.empty){
          console.log('No hay productos por descargar')
          await setProductsToState()
          resolve(true)
          return
        }
  
        const productsTemp = []
        
        data.forEach( async (productData) =>{
          const product = productData.data()
          productsTemp.push(product)
          
        })
  
        for await ( const product of productsTemp ){

          console.log(`Stringify de codigos adicionales de : ${product.code}`, JSON.stringify(product.additionalCodes))
          Sqlite.transaction( tx => {
            tx.executeSql(`SELECT * FROM products WHERE code = ?`,
              [product.code],
              (tx, results) =>{
                if(results.rows.length > 0){
                  tx.executeSql(`UPDATE products SET 
                                description = ?, 
                                  cost = ?, 
                                price = ?, 
                                tax = ?, 
                                line = ?, warehouse1 = ?, warehouse2 = ?, additionalCodes = ? WHERE code = ?`,
                  [ product.description,
                    product.cost,
                    product.price,
                    product.tax,
                    product.line,
                    product.warehouse1,
                    product.warehouse2,
                    JSON.stringify(product.additionalCodes),
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
                }
                else{
                  tx.executeSql(`INSERT INTO products (code, description, cost, price, tax, line, warehouse1, warehouse2, additionalCodes)
                                VALUES(?,?,?,?,?,?,?,?,?)`,
                  [
                    product.code,
                    product.description,
                    product.cost,
                    product.price,
                    product.tax,
                    product.line,
                    product.warehouse1,
                    product.warehouse2,
                    JSON.stringify(product.additionalCodes)
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
        resolve(true)
  
      } catch (error) {
        ToastAndroid.showWithGravity(error.toString(), ToastAndroid.LONG, ToastAndroid.CENTER)
        console.log(error)
      }
    })  
  }

  const getProviders = async (isLocalEmpty) =>{
    try {
      const isLocalEmpty = await isProvidersEmpty()
      let data
      const response = await firestore.collection(`Proveedores${DeviceInfo.getUniqueId()}`).limit(1).get()
      if(response.empty || isLocalEmpty){
        data = await firestore.collection(`Proveedores`).get()
        console.log('Sync All Providers')
      }else{
        data = await firestore.collection(`Proveedores${DeviceInfo.getUniqueId()}`).where('app', '==', false).get()
      }

      if(data.empty){
        console.log('No hay Proveedores por descargar')
        await setProvidersToState()
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
    return new Promise((resolve, reject) => {
      Sqlite.transaction(tx => {
        tx.executeSql(`SELECT * FROM PROVIDERS`,
        [],
        (tx, result) =>{
            let providersTemp = []
            for (let i = 0; i < result.rows.length; i++) {
                providersTemp.push(result.rows.item(i))
            }
            setProviders(providersTemp)
            resolve(true)
        },
        error => console.log('Error', error))
      })
    })
  }

  const setLinesToState = async () =>{
    return new Promise((resolve, reject) =>{
      Sqlite.transaction(tx => {
        tx.executeSql(`SELECT * FROM LINES`,
        [],
        (tx, result) =>{
            let linesTemp = []
            for (let i = 0; i < result.rows.length; i++) {
                linesTemp.push(result.rows.item(i))
                
            }
            setLines(linesTemp)
            resolve(true)
        },
        error => console.log('Error', error))
      })
    })    
  }

  const setProductsToState = async () =>{    
    return new Promise ((resolve,reject)=>{      
      Sqlite.transaction( tx => {
        tx.executeSql(`SELECT * FROM PRODUCTS`,
        [],
        (tx, result) =>{
            let productTemp = []
            for (let i = 0; i < result.rows.length; i++) {
                productTemp.push(result.rows.item(i))
            }
            setProducts(productTemp)
            resolve(true)
        },
        error => console.log('Error', error))
      }) 
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
    loadingProducts: loadingProducts,
    getLines,
    getProviders,
    setProviders,
    getProducts: (isLocalEmpty) => getProducts(isLocalEmpty),
    setLines,
    setProducts,
    setProductsToState,
    setLoadingProducts
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