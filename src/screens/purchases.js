import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View, Text} from 'react-native'
import { TextInput, Title, Card, Button, IconButton, Modal, Portal, List } from 'react-native-paper'
import DeviceInfo from 'react-native-device-info'
import usePreferencesContext from '../hooks/usePreferencesContext'
import useCloudContext from '../hooks/useCloudContext'
import { size, map, find, filter} from 'lodash'
import SearchBar from '../components/SearchBar'
import firestore from '../utils/firebase'

const Purchases = () => {
    const date = new Date()
    const { products, providers } = useCloudContext()
    const colors = usePreferencesContext()
    const { user } = usePreferencesContext()

    const [purchaseProducts, setPurchaseProducts] = useState([]);
    const [nextStep, setNextStep] = useState(false)
    const [codeInput, setCodeInput] = useState('')
    const [filtered, setFiltered] = useState(purchaseProducts)
    const [expandedWarehouse, setExpandedWarehouse] = useState(false);
    const [expandedProvider, setExpandedProvider] = useState(null);
    const [purchase, setPurchase] = useState({
        total: 0,
        warehouse: null,
        date: `${date.getDate()}-${date.getMonth()+1}-${date.getUTCFullYear()}`,
        provider: null
    });

    useEffect(() => {
        setFiltered(purchaseProducts)
        calculateNewTotal()
    }, [purchaseProducts]);

    const handleNextStep = () =>{
        if(purchaseProducts.length < 1){
            ToastAndroid.showWithGravity(`La compra no puede estar vacía`, ToastAndroid.SHORT, ToastAndroid.CENTER)
            return
        }

        for (let i = 0; i < purchaseProducts.length; i++) {
            if(purchaseProducts[i].quantity < 1 || purchaseProducts[i].quantity === ''){
                ToastAndroid.showWithGravity(`Verifica la cantidad del articulo ${purchaseProducts[i].code}`, ToastAndroid.LONG, ToastAndroid.CENTER)
                return
            }
        }

        setNextStep(true)
        setPurchase({...purchase, products: purchaseProducts})
    }
    
    const handleFinish = async () =>{
        try {
            if(!purchase.warehouse){
                ToastAndroid.showWithGravity(`Seleccione un almacen`, ToastAndroid.SHORT, ToastAndroid.CENTER)
                return
            }

            if(!purchase.provider){
                ToastAndroid.showWithGravity(`Seleccione un proveedor`, ToastAndroid.SHORT, ToastAndroid.CENTER)
                return
            }

            const response = await firestore.collection('Folios').doc('Compras').get({source:'server'})
            const folio = response.data().folio + 1
            const deviceName = await DeviceInfo.getDeviceName()
            const deviceUniqueID = DeviceInfo.getUniqueId()

            await firestore.collection('Compras').doc(folio.toString()).set({
                ...purchase,
                folio,
                deviceName,
                deviceUniqueID,
                user: user.user,
                server: false
            })

            await firestore.collection('Folios').doc('Compras').set({folio})

            ToastAndroid.showWithGravity(`Compra guardada con éxito folio: ${folio}`, ToastAndroid.SHORT, ToastAndroid.CENTER)

            setPurchase({
                total: 0,
                provider: null,
                warehouse: null,
                date: `${date.getDate()}-${date.getMonth()+1}-${date.getUTCFullYear()}`
            })

            setPurchaseProducts([])
            setNextStep(false)


        } catch (error) {
            ToastAndroid.showWithGravity(error.toString(), ToastAndroid.LONG, ToastAndroid.CENTER)
            console.log(error)
        }
    }

    const handleAddProduct = (code) =>{
        if(code === '') return

        const alreadyAdded = find( purchaseProducts, { code: code.toUpperCase() } )
        if(alreadyAdded){
            if(isNaN(alreadyAdded.quantity)){
                return
            }
            setCodeInput('')
            handleProductChange(code.toUpperCase(), 'quantity', alreadyAdded.quantity + 1)
            return
        }

        const productToAdd = find( products, { code: code.toUpperCase() } )
        if(!productToAdd){
            ToastAndroid.showWithGravity(`El articulo ${code}, no existe`, ToastAndroid.SHORT, ToastAndroid.CENTER)
            setCodeInput('')
            return
        }

        const exitProductsTemp = [...purchaseProducts]
        exitProductsTemp.push({...productToAdd, quantity: 1})
        setPurchaseProducts(exitProductsTemp)
        setCodeInput('')
        ToastAndroid.showWithGravity(`Articulo ${code.toUpperCase()} añadido con éxito`, ToastAndroid.SHORT, ToastAndroid.CENTER)
    }

    const handleProductChange = (code, parameter, value) => {
        const exitProductsTemp = []
        for (let i = 0; i < purchaseProducts.length; i++) {
            if(purchaseProducts[i].code !== code){
                exitProductsTemp.push({...purchaseProducts[i]})
            }else{
                exitProductsTemp.push({...purchaseProducts[i], [parameter]: value})
            }
        }
        setPurchaseProducts(exitProductsTemp)
    }

    const handleQuantityChange = (quantity, code) =>{
        if(isNaN(quantity)){
            ToastAndroid.showWithGravity(`La cantidad debe ser un número, verifique el articulo ${code}`, ToastAndroid.LONG, ToastAndroid.CENTER)
            return
        }
        handleProductChange(code.toUpperCase(), 'quantity', Number(quantity))
    }

    const calculateNewTotal = () =>{
        let totalTemp = 0
        for (let i = 0; i < purchaseProducts.length; i++) {
            totalTemp += (purchaseProducts[i].cost * purchaseProducts[i].quantity)
        }

        setPurchase({...purchase, total: totalTemp})
    }

    const handleDeleteProduct = code => {
        const exitProductsTemp = filter( purchaseProducts , product =>{
            return product.code !== code
        })

        setPurchaseProducts(exitProductsTemp)
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
                        <Title style={paperStyles.title}>Finalizar Compra</Title>
                        <Title>Productos: <Text>{purchaseProducts.length}</Text></Title>
                        <Title style={{marginBottom: 10}}>{`Total: $${new Intl.NumberFormat("en-US").format(purchase.total)}`}</Title>
                        <TextInput 
                            label={'Observaciones'}
                            style={{marginVertical: 10}}
                            value={ purchase.observations }
                            onChange={ e => setEntry({...purchase, observations: e.nativeEvent.text}) }
                        />
                        <List.Accordion
                                title={`Almacen`}
                                expanded={expandedWarehouse}
                                onPress={ () => setExpandedWarehouse(!expandedWarehouse)}
                                description={!purchase.warehouse ? 'Seleccionar almacen' : purchase.warehouse}
                            >
                                <List.Item title="Almacen 1" description='Matriz' onPress={() => {setPurchase({...purchase, warehouse: 1}); setExpandedWarehouse(false);}}/>
                                <List.Item title="Almacen 2" description='Sucursal' onPress={() => {setPurchase({...purchase, warehouse: 2}); setExpandedWarehouse(false);}}/>
                        </List.Accordion>

                        <List.Accordion
                                title={`Proveedor`}
                                expanded={expandedProvider}
                                onPress={ () => setExpandedProvider(!expandedProvider)}
                                description={!purchase.provider ? 'Seleccionar proveedor' : purchase.provider}
                            >
                                {providers.map( provider => (
                                    <List.Item key={provider.provider} title={provider.provider} description={provider.name} onPress={() => {setPurchase({...purchase, provider: provider.provider}); setExpandedProvider(false);}}/>
                                ))}
                        </List.Accordion>
                        
                        <View style={{flexDirection: 'row', marginTop: 20}}>
                            <Button style={{flex:1, marginHorizontal:10}} mode='text' onPress={() => setNextStep(false)}>Atras</Button>
                            <Button style={{flex:1, marginHorizontal:10}} mode='contained' onPress={handleFinish}>Finalizar</Button>
                        </View>
                    </Modal>
                </Portal>
            
                <View>
                    <Title style={paperStyles.title}>Compras</Title>
                    <TextInput 
                        label={'Código'}
                        right={<TextInput.Icon name='plus-thick' style={paperStyles.icon} onPress={ () => handleAddProduct( codeInput.toUpperCase())} />}
                        style={paperStyles.input}
                        value={ codeInput.toUpperCase() }
                        onChange={ e => {setCodeInput(e.nativeEvent.text.trim())}}
                        autoCapitalize='characters'
                        blurOnSubmit={false}
                        onSubmitEditing={ e => handleAddProduct(e.nativeEvent.text.trim())}
                    />

                    <SearchBar array={ purchaseProducts } setArray={ setFiltered } />
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
                                        onPress={ () => handleDeleteProduct(product.code)}
                                    />
                                </Card.Content>
                            </Card>
                        ))
                    )}
                </ScrollView>
                <View style={{flexDirection: 'row', marginHorizontal: 15}}>
                    <Title style={{fontSize: 16, flex: 3}}>{`Total: $${new Intl.NumberFormat("en-US").format(purchase.total)}`}</Title>
                    <Button style={{flex:1}} mode='contained' onPress={handleNextStep}>Siguiente</Button>
                </View>
        </SafeAreaView>
    );
}

export default Purchases;