import { createContext } from 'react'

const PreferencesContext = createContext({
    primaryColor:'',
    secondaryColor:'',
    backgroundColor:'',
    textColor:'',
    secondaryBackgroundColor: '',
    user: null,
})

export default PreferencesContext;