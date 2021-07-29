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



const App = () => {
  const [user, setUser] = useState(true);
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
  //     const response = (await firestore.collection('Productos').get()).docs
  //     const products = response.map( line => (
  //         line.data()
  //     ))
  //     setProducts(products)
  //   })()
  // }, []);

  const cloudContext = useMemo(
    () =>({
    lines,
    products,
  }), [lines, products])

  const preferencesContext = useMemo(
    () =>({
    primaryColor,
    secondaryColor,
    backgroundColor,
    textColor,
    secondaryBackgroundColor
  }), [primaryColor, secondaryColor, backgroundColor, secondaryBackgroundColor])

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