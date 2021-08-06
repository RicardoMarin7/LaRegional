import React, { useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View} from 'react-native'
import { TextInput, Title, Card, Button, IconButton } from 'react-native-paper'
import usePreferencesContext from '../hooks/usePreferencesContext'
import useCloudContext from '../hooks/useCloudContext'
import { size, map, find } from 'lodash'
import SearchBar from '../components/SearchBar'

const Entries = () => {

    const { products } = useCloudContext()
    const colors = usePreferencesContext()
    const [entryProducts, setEntryProducts] = useState([{
        code: '.024142004054',
        cost: 22.490739847039,
        description: 'PALETA CLASICA 1/40PZAS.',
        line:'SYS',
        price: 32.4074061196528,
        tax: 'IE3',
        quantity: 1
    }]);
    const [codeInput, setCodeInput] = useState('')
    const [filtered, setFiltered] = useState(entryProducts);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setFiltered(entryProducts)
        calculateNewTotal()
    }, [entryProducts]);

    const handleAddProduct = (code) =>{
        const alreadyAdded = find( entryProducts, { code: code.toUpperCase() } )
        if(alreadyAdded){
            if(isNaN(alreadyAdded.quantity)){
                ToastAndroid.showWithGravity(`La cantidad debe ser un número, verifique el articulo ${code}`, ToastAndroid.LONG, ToastAndroid.CENTER)
                return
            }
            setCodeInput('')
            handleProductChange(code, 'quantity', alreadyAdded.quantity + 1)
            return
        }

        const productToAdd = find( products, { code: code.toUpperCase() } )
        if(!productToAdd){
            ToastAndroid.showWithGravity(`El articulo ${code}, no existe`, ToastAndroid.LONG, ToastAndroid.CENTER)
            
            return
        }

        const entryProductsTemp = [...entryProducts]
        entryProductsTemp.push({...productToAdd, quantity: 1})
        setEntryProducts(entryProductsTemp)
        setCodeInput('')
        ToastAndroid.showWithGravity(`Articulo ${code.toUpperCase()} añadido con éxito`, ToastAndroid.SHORT, ToastAndroid.CENTER)
    }

    const handleProductChange = (code, parameter, value) => {
        const entryProductsTemp = []
        for (let i = 0; i < entryProducts.length; i++) {
            if(entryProducts[i].code !== code){
                entryProductsTemp.push({...entryProducts[i]})
            }else{
                entryProductsTemp.push({...entryProducts[i], [parameter]: value})
            }
        }
        setEntryProducts(entryProductsTemp)
    }

    const handleQuantityChange = (quantity, code) =>{
        if(isNaN(quantity)){
            ToastAndroid.showWithGravity(`La cantidad debe ser un número, verifique el articulo ${code}`, ToastAndroid.LONG, ToastAndroid.CENTER)
            return
        }
        handleProductChange(code, 'quantity', Number(quantity))
    }

    const calculateNewTotal = () =>{
        let totalTemp = 0
        for (let i = 0; i < entryProducts.length; i++) {
            totalTemp += (entryProducts[i].cost * entryProducts[i].quantity)
        }

        setTotal(totalTemp)
    }

    const nativeStyles = StyleSheet.create({
        background:{
            backgroundColor: colors.backgroundColor,
            height: '100%',
            flex: 1,
        }
    })

    const paperStyles = {
        title: {
            textAlign : 'center',
            marginVertical: 20,
            fontSize: 30,
            color: colors.primaryColor
        },
        input:{
            width: '80%',
            backgroundColor: colors.secondaryBackgroundColor,
            marginBottom: 15,
            alignSelf: 'center'
        },
        button:{
            marginTop: 10,
            width: '80%',
            alignSelf: 'center'
        },
        error:{
            backgroundColor: colors.primaryColor
        },
        icon:{
            backgroundColor:colors.primaryColor,
            borderRadius: 5,
        },
        card:{
            backgroundColor: colors.secondaryBackgroundColor,
            width: '90%',
            alignSelf: 'center',
            marginBottom: 10
        },
        cardTitle:{
            fontSize: 16
        },
        cardSubtitle:{
            fontSize: 14
        },
        cardInput:{
            height: 50,
            flex: 4
        },
        cardContent:{
            flexDirection:'row',
            alignContent: 'flex-end',
        }
        
    }

    return ( 
        <SafeAreaView style={nativeStyles.background}>
            <View>
                <Title style={paperStyles.title}>Entradas</Title>
                <TextInput 
                    label={'Código'}
                    right={<TextInput.Icon name='plus-thick' style={paperStyles.icon} onPress={() => console.log('click en icono')} />}
                    style={paperStyles.input}
                    value={ codeInput }
                    onChange={ text => setCodeInput(text)}
                    autoCapitalize='characters'
                    blurOnSubmit={false}
                    onSubmitEditing={ e => handleAddProduct(e.nativeEvent.text.trim())}
                />

                <SearchBar array={ entryProducts } setArray={ setFiltered } />
            </View>
            <ScrollView>
                

                {size(filtered) > 0 && (
                    map(filtered, product =>(
                        <Card key={product.code} style={paperStyles.card}>
                            <Card.Title subtitle={product.code} title={product.description} subtitleStyle={paperStyles.cardSubtitle} titleNumberOfLines={3} titleStyle={paperStyles.cardTitle}/>
                            <Card.Content style={paperStyles.cardContent}>
                                <TextInput
                                    style={paperStyles.cardInput}
                                    keyboardType='numeric'
                                    label='Cantidad'
                                    selectTextOnFocus
                                    onChangeText={ quantity => handleQuantityChange(quantity, product.code)}
                                    value={`${product.quantity}`}
                                /> 
                                
                                <IconButton icon='delete' size={24} color={colors.primaryColor} style={{flex: 1}} />
                            </Card.Content>
                        </Card>
                    ))
                )}
            </ScrollView>
            <View style={{flexDirection: 'row', marginHorizontal: 15}}>
                <Title style={{fontSize: 16, flex: 3}}>{`Total: $${new Intl.NumberFormat("en-US").format(total)}`}</Title>
                <Button style={{flex:1}} mode='contained'>Confirmar</Button>
            </View>
        </SafeAreaView>
    );
}





export default Entries;