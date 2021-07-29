import { createContext } from 'react'

const PreferencesContext = createContext({
    primaryColor:'',
    secondaryColor:'',
    backgroundColor:'',
    textColor:'',
    secondaryBackgroundColor: ''
})

export default PreferencesContext;