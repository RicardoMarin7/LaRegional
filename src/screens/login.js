import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, ToastAndroid, LogBox} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import firestore from '../utils/firebase'

LogBox.ignoreLogs(['Setting a timer','AsyncStorage'])

const Login = ({setUser}) => {
    
    const [loginData, setLoginData] = useState(defaultValues());
    const [formError, setformError] = useState({
        user: false,
        password: false
    });
    const [secureText, setSecureText] = useState(true);
    const [loading, setLoading] = useState(false);

    const login = async () =>{

        setLoading(true)
        let errors = {}
        if(!loginData.user || !loginData.password){
            if(!loginData.user) errors.user = true
            if(!loginData.password) errors.password = true
        }
        setformError(errors)
        setLoading(false)
        if(formError.user || formError.password) return

        try {
            const data = firestore.collection('Usuarios').doc(loginData.user.toUpperCase())
            const response = await data.get({source:'server'})
            console.log(response.exists)

            if(!response.exists){
                ToastAndroid.showWithGravity('El usuario no existe', ToastAndroid.SHORT, ToastAndroid.CENTER)
                return
            }

            let auth = false
                if(loginData.password.toUpperCase() === decryptUserPassword(response.data().password).toUpperCase()){
                    auth = true
                }

                if(!auth){
                    ToastAndroid.showWithGravity('La contraseña no es correcta', ToastAndroid.SHORT, ToastAndroid.CENTER)
                    return  
                }       

                setUser({
                    user: response.data().user,
                    supervisor: response.data().supervisor
                })

            
        } catch (error) {
            ToastAndroid.show(error.toString(), ToastAndroid.LONG)
        }

    }

    const decryptUserPassword = password => {
        console.log('Before', password);
        // password = password.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        console.log('After', password);
        const KEY = (777 / 256) * 4
        let decryptedPassword = ""
        for(let i = 0; i < password.length ; i++){
            let char = password.charCodeAt(i) - KEY
            decryptedPassword += String.fromCharCode(Math.round(char)).toString()
            
        }
        return decryptedPassword
    }

    return (
        <SafeAreaView style={styles.background}>
            <TextInput 
                label='Usuario'
                error={formError.user}
                style={paperStyles.text}
                value={loginData.user}
                onChange={e => setLoginData({...loginData, user: e.nativeEvent.text})}
            />

            <TextInput 
                label='Contraseña'
                secureTextEntry={secureText}
                right={<TextInput.Icon name='eye' onPress={() => setSecureText(!secureText)} />}
                style={paperStyles.text}
                value={loginData.password}
                error={formError.password}
                onChange={e => setLoginData({...loginData, password: e.nativeEvent.text})}
            />

            <Button mode="contained" loading={loading} style={paperStyles.button} dark onPress={() => login()}>
                Iniciar Sesión
            </Button>
            
        </SafeAreaView>
    );
}
export default Login;

const defaultValues = () => ({
        user:'',
        password:'',
})

const styles = StyleSheet.create({
    background:{
        backgroundColor: '#232429',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const paperStyles = {
    text:{
        width: '80%',
        backgroundColor: '#303038'
    },
    button:{
        marginTop: 16,
    }
}
