import React, { useState, useEffect } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, ToastAndroid } from 'react-native'
import { Title, TextInput, Button, List} from 'react-native-paper'
import firestore from '../utils/firebase'
import { size, map } from 'lodash'
import useCloudContext from '../hooks/useCloudContext'


const FastArticle = () => {
    const [article, setArticle] = useState(defaultValues());
    const [expandedTax, setExpandedTax] = useState(false);
    const [expandedLine, setExpandedLine] = useState(false);
    const [errors, setErrors] = useState(defaultValues());
    const {lines} = useCloudContext()

    const handleTaxChange = tax =>{
        setArticle({...article, tax: tax})
        setExpandedTax(false)
    }

    const handleLineChange = line =>{
        setArticle({...article, line: line})
        setExpandedLine(false)
    }

    const saveArticle = async (article) =>{
        try {
            const doc = firestore.collection('Productos').doc(article.code)
            const response = await doc.set({...article, downloaded: false})
            console.log(response)
        } catch (error) {
            console.log(error)
        }
        
    }

    const handleCreateArticle = () =>{
        let errors = {}
        if(article.code === '' || article.description === '' || article.price === '' || article.cost === '' || article.tax === '' || article.line === ''){
            if(article.code === '') errors.code = true
            if(article.description === '') errors.description = true
            if(article.price === '') errors.price = true
            if(article.cost === '') errors.cost = true
            if(article.tax === '') errors.tax = true
            if(article.line === '') errors.line = true
            setErrors(errors)
            return
        }

        const NO_SPACES = new RegExp('^(\\d|\\w)+$')

        if(!NO_SPACES.test(article.code)){
            errors.code = true
            ToastAndroid.showWithGravity('El código del artículo no debe tener espacios ni caracteres especiales', ToastAndroid.LONG, ToastAndroid.CENTER)
            setErrors(errors)
            return
        }

        if(isNaN(article.price)){
            errors.price = true
            ToastAndroid.showWithGravity('El precio del artículo no debe tener espacios ni caracteres especiales', ToastAndroid.LONG, ToastAndroid.CENTER)
            return
        }

        if(isNaN(article.cost)){
            errors.cost = true
            ToastAndroid.showWithGravity('El costo del artículo no debe tener espacios ni caracteres especiales', ToastAndroid.LONG, ToastAndroid.CENTER)
            return
        }

        setErrors(errors)
        saveArticle(article)
    }

    return ( 
        <SafeAreaView style={nativeStyles.background}>
            <ScrollView>
                <Title style={styles.title}>Alta Rápida</Title>
                <TextInput
                    label='Código'
                    style={styles.input}
                    onChange={ e => setArticle({...article, code: e.nativeEvent.text})}
                    error={errors.code}
                />

                <TextInput
                    label='Descripción'
                    style={styles.input}
                    multiline
                    onChange={ e => setArticle({...article, description: e.nativeEvent.text})}
                    error={errors.description}
                />

                <TextInput
                    label='Costo'
                    style={styles.input}
                    onChange={ e => setArticle({...article, cost: e.nativeEvent.text})}
                    keyboardType='numeric'
                    error={errors.cost}
                />

                <TextInput
                    label='Precio'
                    style={styles.input}
                    onChange={ e => setArticle({...article, price: e.nativeEvent.text})}
                    keyboardType='numeric'
                    error={errors.price}
                />

                

                <List.Section title="Opciones" style={styles.listContainer}>
                    <List.Accordion
                        title={`Impuesto`}
                        style={errors.line && styles.error}
                        expanded={expandedTax}
                        onPress={ () => setExpandedTax(!expandedTax)}
                        description={article.tax === '' ? 'Seleccionar Impuesto' : article.tax}
                        error={errors.tax}
                    >
                        <List.Item title="IVA" description='Valor de impuesto: 16' onPress={() => handleTaxChange('IVA')}/>
                        <List.Item title="IE3" description='Valor de impuesto: 8' onPress={() => handleTaxChange('IE3')}/>
                        <List.Item title="SYS" description='Valor de impuesto: Sin Impuesto' onPress={() => handleTaxChange('SYS')}/>
                    </List.Accordion>

                    <List.Accordion
                        title={`Linea`}
                        style={errors.line && styles.error}
                        expanded={expandedLine}
                        onPress={ () => setExpandedLine(!expandedLine)}
                        description={article.line === '' ? 'Seleccionar Linea' : article.line}
                    >
                        { size(lines) > 0 && (
                            map(lines, line =>(
                                <List.Item title={line.line} description={line.description} onPress={() => handleLineChange(line.line)} key={line.line}/>
                            ))
                        )}
                    </List.Accordion>
                </List.Section>

                <Button mode="contained" style={styles.button} dark onPress={handleCreateArticle}>
                    Crear Artículo
                </Button>
            </ScrollView>

        </SafeAreaView>
     );
}

const styles = {
    title: {
        textAlign : 'center',
        marginVertical: 20,
        fontSize: 30,
        color: '#f04e60'
    },
    input:{
        width: '80%',
        backgroundColor: '#303038',
        marginBottom: 15,
        alignSelf: 'center'
    },
    listContainer:{
        width:'80%',
        alignSelf: 'center'
    },
    button:{
        marginTop: 10,
        width: '80%',
        alignSelf: 'center'
    },
    error:{
        backgroundColor: '#f04e60'
    }
 
}

const nativeStyles = StyleSheet.create({
    background:{
        backgroundColor: '#232429',
        height: '100%',
        flex: 1,
    }
})

const defaultValues = () => ({
    code: '',
    description: '',
    line: '',
    tax: '',
    cost:'',
    price:''
})



export default FastArticle;