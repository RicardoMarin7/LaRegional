import React, { useEffect, useState } from 'react'
import { ScrollView, View} from 'react-native'
import { Title, ActivityIndicator, } from 'react-native-paper'
import MainButton from '../components/MainButton'
import useCloudContext from '../hooks/useCloudContext'
import Printer from '../components/Printer'
import firestore from '../utils/firebase'

const Home = ({navigation}) => {
    const { getProducts, getLines, getProviders} = useCloudContext()
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [print, setPrint] = useState(false)
    const [printData, setPrintData] = useState(null);

    const printLastPurchase = async () =>{
        try {            
            const response = await firestore.collection(`Compras`).limit(1).get()
            if(!response.empty) response.forEach( entry => {
                console.log(entry.data())
                setPrintData(entry.data())
                setPrint(true)
            })        
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect( () => {
        (async () =>{
            await getProducts()
            setLoadingProducts(false)
        })()
    }, []);
    
    
    useEffect( () => {
        (async () =>{
            await getLines()
        })()
    }, []);


    useEffect(  () => {
        (async () =>{
            await getProviders()
        })()
    }, []);

    useEffect(() => {
        
    }, [loadingProducts]);

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
            <MainButton title='Actualizar Productos' icon='update' execute={async () => await getProducts()} />
            <MainButton title='Actualizar Proveedores' icon='update' execute={ async () => await getProviders()} />
            <MainButton title='Actualizar Lineas' icon='update' execute={ async () => await getLines()} />
            <MainButton title='Imprimir Última Entrada' icon='printer' execute={ async () => await printLastPurchase()} />

            <Printer setVisible={setPrint} visible={print} data={printData} />
        </ScrollView>
    );
}

export default Home;