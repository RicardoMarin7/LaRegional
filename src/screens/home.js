import React, { useEffect, useState } from 'react'
import { ScrollView, View} from 'react-native'
import Printer from '../components/Printer'
import { Title, ActivityIndicator, } from 'react-native-paper'
import { printSomething } from '../utils/print'
import MainButton from '../components/MainButton'
import useCloudContext from '../hooks/useCloudContext'
import Sqlite from '../utils/Sqlite'

const Home = ({navigation}) => {
    const { getLines, setLines, getProducts, setProducts, getProviders, setProviders, providers, loadingProducts, setLoadingProducts} = useCloudContext()
    const [productsLength, setProductsLength] = useState(null);
    const [linesLength, setLinesLength] = useState(null);
    const [providersLength, setProvidersLength] = useState(null);
    const [print, setPrint] = useState(false);

    useEffect(async () => {
        await updateProducts()
        setLoadingProducts(false)
    }, []);

    useEffect(async () => {
        if(productsLength === null) return
        if(productsLength < 1){
            console.log('Products Local Empty')
            await getProducts(true)
        }
    }, [productsLength]);
    
    useEffect( async () => {
        await updateLines()
    }, []);

    useEffect( async () => {
        if(linesLength === null) return
        if(linesLength < 1){
            await getLines(true)
        }
    }, [linesLength]);

    useEffect( async () => {
        await updateProviders()
    }, []);

    useEffect( async () => {
        if(providersLength === null) return
        if(providersLength < 1){
            await getProviders(true)
        }
    }, [providersLength]);

    useEffect(() => {
        console.log(providers)
    }, [providers]);

    useEffect(() => {
        
    }, [loadingProducts]);

    const updateProducts = async () =>{
        await getProducts(false)
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

    const updateProviders = async () =>{
        await getProviders(false)
        Sqlite.transaction(tx => {
                tx.executeSql(`SELECT * FROM PROVIDERS`,
                [],
                (tx, result) =>{
                    const providersTemp = []
                    setProvidersLength(result.rows.length)
                    for (let i = 0; i < result.rows.length; i++) {
                        providersTemp.push(result.rows.item(i))
                    }
                    setProviders(providersTemp)
                },
                error => console.log('Error', error))
            })
    }

    const updateLines = async () => {
        await getLines(false)
        Sqlite.transaction(tx => {
                tx.executeSql(`SELECT * FROM LINES`,
                [],
                (tx, result) =>{
                    const linesTemp = []
                    setLinesLength(result.rows.length)
                    for (let i = 0; i < result.rows.length; i++) {
                        linesTemp.push(result.rows.item(i))
                    }
                    setLines(linesTemp)
                },
                error => console.log('Error', error))
            })
    }

    if(loadingProducts){
        return(
            <View style={{alignContent:"center", justifyContent:'center'}}> 
                <ActivityIndicator animating={true} size={72} />
                <Title style={{textAlign:'center'}}>Cargando Productos</Title>
                <Title style={{textAlign:'center'}}>No cierres la aplicación</Title>
            </View>
        )
    }

    return ( 
        <ScrollView contentContainerStyle={{justifyContent: 'center', flexWrap: 'wrap', flexDirection:'row'}}>
            <MainButton title='Existencia Almacen 1' icon='package' execute={() => navigation.navigate('existence')} />
            <MainButton title='Existencia Almacen 2' icon='package' execute={() => navigation.navigate('existence2')} />
            <MainButton title='Actualizar Productos' icon='update' execute={() => updateProducts()} />
            <MainButton title='Actualizar Proveedores' icon='update' execute={() => updateProviders()} />
            <MainButton title='Actualizar Lineas' icon='update' execute={() => updateLines()} />
        </ScrollView>
    );
}

export default Home;