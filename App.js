import React, { useMemo, useState} from 'react'
import { 
  NavigationContainer,
  DarkTheme as DarkThemeNavigation,
  DefaultTheme as DefaultThemeNavigation
} from '@react-navigation/native'

import { 
  Provider as PaperProvider,
  DarkTheme as DarkThemePaper,
  DefaultTheme as DefaultThemePaper
} from 'react-native-paper'
import Navigation from './src/navigation/Navigation'
import PreferencesContext from './src/context/PreferencesContext'
import Login from './src/screens/login'



const App = () => {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(true);

  DarkThemePaper.colors.primary = '#f04e60'
  DarkThemePaper.colors.accent = '#d04959'
  DarkThemePaper.colors.text = '#FFFFFF'

  DarkThemeNavigation.colors.background = '#232429'
  DarkThemeNavigation.colors.card = '#232429'

  const toggleTheme = () =>{
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const preferences = useMemo( () =>({
    toggleTheme,
    theme,
  }), [theme])

  return (
    <PreferencesContext.Provider value={preferences} >
      <PaperProvider theme={DarkThemePaper}>
        { user ? (
          <NavigationContainer theme={DarkThemeNavigation}>
            <Navigation />
          </NavigationContainer>
        ) : <Login setUser={setUser} />}
        
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}
 
export default App;