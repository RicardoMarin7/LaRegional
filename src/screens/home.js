import React, { useEffect, useState } from 'react'
import { View} from 'react-native'
import { Button, Title, ActivityIndicator} from 'react-native-paper'
import useCloudContext from '../hooks/useCloudContext'
import Sqlite from '../utils/Sqlite'

const Home = ({navigation}) => {
    const { getLines, setLines, getProducts, setProducts, products, lines } = useCloudContext()
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(async () => {
        await getProducts(false)
        Sqlite.transaction(tx => {
            tx.executeSql(`SELECT * FROM PRODUCTS`,
            [],
            (tx, result) =>{
                console.log('Result products local', result.rows.length)
                let productTemp = []
                for (let i = 0; i < result.rows.length; i++) {
                    productTemp.push(result.rows.item(i))
                }
                setProducts(productTemp)
            },
            error => console.log('Error', error))
        })
        setLoadingProducts(false)
    }, []);
    
    useEffect(() => {
        console.log('Products', products);
    }, [products]);



    useEffect(() => {
        getLines(false)
        Sqlite.transaction(tx => {
                tx.executeSql(`SELECT * FROM LINES`,
                [],
                (tx, result) =>{
                    let linesTemp = []
                    if(result.rows.length < 1) getProducts(true)
                    for (let i = 0; i < result.rows.length; i++) {
                        linesTemp.push(result.rows.item(i))
                    }
                    setLines(linesTemp)
                },
                error => console.log('Error', error))
            })
    }, []);

    
    useEffect(() => {
        console.log('Lines', lines);
    }, [lines]);


    if(loadingProducts){
        return(
            <View style={{flex:1, alignContent:"center", justifyContent:'center'}}> 
                <ActivityIndicator animating={true} size={72} />
                <Title style={{textAlign:'center'}}>Cargando Productos</Title>
                <Title style={{textAlign:'center'}}>No cierres la aplicación</Title>
            </View>
        )
    }

    return ( 
        <View>
            <Button onPress={() => 'Log'} mode='contained'>
                Print
            </Button>
        </View>
    );
}

export default Home;