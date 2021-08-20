import React, { useEffect } from 'react'
import { View} from 'react-native'
import { Button, Text } from 'react-native-paper'
import DeviceInfo from 'react-native-device-info'
import useCloudContext from '../hooks/useCloudContext'
import Sqlite from '../utils/Sqlite'

const Home = ({navigation}) => {
    const { getLines, setLines, getProducts, setProducts, products, lines } = useCloudContext()
    
    useEffect(() => {
        getProducts(false)
        Sqlite.transaction(tx => {
            tx.executeSql(`SELECT * FROM PRODUCTS`,
            [],
            (tx, result) =>{
                let productTemp = []
                for (let i = 0; i < result.rows.length; i++) {
                    productTemp.push(result.rows.item(i))
                }
                setProducts(productTemp)
            },
            error => console.log('Error', error))
        })
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

    return ( 
        <View>
            <Text>Productos: {products.length}</Text>
            <Button onPress={ () => navigation.navigate('fastarticle')} mode='contained'>
                To Fast Articles
            </Button>

        </View>
    );
}

export default Home;