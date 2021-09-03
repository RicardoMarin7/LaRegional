import React, { useEffect, useState } from 'react'
import { View} from 'react-native'
import { Button, Title, ActivityIndicator} from 'react-native-paper'
import useCloudContext from '../hooks/useCloudContext'
import Sqlite from '../utils/Sqlite'

const Home = ({navigation}) => {
    const { getLines, setLines, getProducts, setProducts, products, lines } = useCloudContext()
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productsLength, setProductsLength] = useState(null);
    const [linesLength, setLinesLength] = useState(null);

    useEffect(async () => {
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
    }, []);

    useEffect( async () => {
        if(linesLength === null) return
        if(linesLength < 1){
            await getLines(true)
        }
    }, [linesLength]);

    useEffect(() => {
        console.log(products);
    }, [products]);

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