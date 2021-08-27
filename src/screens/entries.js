import React, { useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View, Text} from 'react-native'
import { TextInput, Title, Card, Button, IconButton, Modal, Portal, List } from 'react-native-paper'
import DeviceInfo from 'react-native-device-info'
import usePreferencesContext from '../hooks/usePreferencesContext'
import useCloudContext from '../hooks/useCloudContext'
import { size, map, find } from 'lodash'
import SearchBar from '../components/SearchBar'
import firestore from '../utils/firebase'

const Entries = () => {
    const date = new Date()
    const { products } = useCloudContext()
    const colors = usePreferencesContext()
    const { user } = usePreferencesContext()

    const [entryProducts, setEntryProducts] = useState([]);
    const [nextStep, setNextStep] = useState(false)
    const [codeInput, setCodeInput] = useState('')
    const [filtered, setFiltered] = useState(entryProducts)
    const [expandedWarehouse, setExpandedWarehouse] = useState(false);
    const [entry, setEntry] = useState({
        total: 0,
        warehouse: null,
        date: `${date.getDate()}-${date.getMonth()+1}-${date.getUTCFullYear()}`
    });

    useEffect(() => {
        setFiltered(entryProducts)
        calculateNewTotal()
    }, [entryProducts]);

    const handleNextStep = () =>{
        if(entryProducts.length < 1){
            ToastAndroid.showWithGravity(`La entrada no puede estar vacía`, ToastAndroid.SHORT, ToastAndroid.CENTER)
            return
        }

        for (let i = 0; i < entryProducts.length; i++) {
            if(entryProducts[i].quantity < 1 || entryProducts[i].quantity === ''){
                ToastAndroid.showWithGravity(`Verifica la cantidad del articulo ${entryProducts[i].code}`, ToastAndroid.LONG, ToastAndroid.CENTER)
                return
            }
        }

        setNextStep(true)
        setEntry({...entry, products: entryProducts})
    }
    
    const handleFinish = async () =>{
        try {

            if(!entry.warehouse){
                ToastAndroid.showWithGravity(`Seleccione un almacen`, ToastAndroid.SHORT, ToastAndroid.CENTER)
                return
            }

            const response = await firestore.collection('Folios').doc('Entradas').get({source:'server'})
            const folio = response.data().folio + 1
            const deviceName = await DeviceInfo.getDeviceName()
            const deviceUniqueID = DeviceInfo.getUniqueId()

            await firestore.collection('Entradas').doc(folio.toString()).set({
                ...entry,
                deviceName,
                deviceUniqueID,
                user: user.user
            })

            await firestore.collection('Folios').doc('Entradas').set({folio})

            ToastAndroid.showWithGravity(`Entrada guardada con éxito folio: ${folio}`, ToastAndroid.SHORT, ToastAndroid.CENTER)

            setEntry({
                total: 0,
                warehouse: null,
                date: `${date.getDate()}-${date.getMonth()+1}-${date.getUTCFullYear()}`
            })

            setEntryProducts([])
            setNextStep(false)

            //print Ticket


        } catch (error) {
            ToastAndroid.showWithGravity(error.toString(), ToastAndroid.LONG, ToastAndroid.CENTER)
            console.log(error)
        }
    }

    const handleAddProduct = (code) =>{
        if(code === '') return

        const alreadyAdded = find( entryProducts, { code: code.toUpperCase() } )
        if(alreadyAdded){
            if(isNaN(alreadyAdded.quantity)){
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

        setEntry({...entry, total: totalTemp})
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
                <Portal>
                    <Modal visible={nextStep} dismissable={false} style={{backgroundColor: colors.backgroundColor, height:'90%', margin: 10}} contentContainerStyle={{margin:10}}>
                        <Title style={paperStyles.title}>Finalizar Entrada</Title>
                        <Title>Productos: <Text>{entryProducts.length}</Text></Title>
                        <Title style={{marginBottom: 10}}>{`Total: $${new Intl.NumberFormat("en-US").format(entry.total)}`}</Title>
                        <List.Accordion
                                title={`Almacen`}
                                expanded={expandedWarehouse}
                                onPress={ () => setExpandedWarehouse(!expandedWarehouse)}
                                description={!entry.warehouse ? 'Seleccionar almacen' : entry.warehouse}
                            >
                                <List.Item title="Almacen 1" description='Matriz' onPress={() => {setEntry({...entry, warehouse: 1}); setExpandedWarehouse(false);}}/>
                                <List.Item title="Almacen 2" description='Sucursal' onPress={() => {setEntry({...entry, warehouse: 2}); setExpandedWarehouse(false);}}/>
                        </List.Accordion>
                        
                        <View style={{flexDirection: 'row', marginTop: 20}}>
                            
                            <Button style={{flex:1, marginHorizontal:10}} mode='text' onPress={() => setNextStep(false)}>Atras</Button>
                            <Button style={{flex:1, marginHorizontal:10}} mode='contained' onPress={handleFinish}>Finalizar</Button>
                        </View>
                    </Modal>
                </Portal>
            
                <View>
                    <Title style={paperStyles.title}>Entradas</Title>
                    <TextInput 
                        label={'Código'}
                        right={<TextInput.Icon name='plus-thick' style={paperStyles.icon} onPress={() => console.log('click en icono')} />}
                        style={paperStyles.input}
                        value={ codeInput }
                        onChange={ e => {setCodeInput(e.nativeEvent.text.trim())}}
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
                                    
                                    <IconButton icon='delete' size={24} color={colors.primaryColor} style={{flex: 1}} 
                                        onPress={ () => null }
                                    />
                                </Card.Content>
                            </Card>
                        ))
                    )}
                </ScrollView>
                <View style={{flexDirection: 'row', marginHorizontal: 15}}>
                    <Title style={{fontSize: 16, flex: 3}}>{`Total: $${new Intl.NumberFormat("en-US").format(entry.total)}`}</Title>
                    <Button style={{flex:1}} mode='contained' onPress={handleNextStep}>Siguiente</Button>
                </View>
        </SafeAreaView>
    );
}





export default Entries;