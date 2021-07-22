import React, { useState } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, ToastAndroid } from 'react-native'
import { Title, TextInput, Button, List} from 'react-native-paper'

const FastArticle = () => {
    const [article, setArticle] = useState(defaultValues());
    const [expandedTax, setExpandedTax] = useState(false);
    const [expandedLine, setExpandedLine] = useState(false);

    const handleTaxChange = tax =>{
        setArticle({...article, tax: tax})
        setExpandedTax(false)
    }

    const handleLineChange = line =>{
        setArticle({...article, line: line})
        setExpandedLine(false)
    }

    const handleCreateArticle = () =>{
        
    }

    return ( 
        <SafeAreaView style={nativeStyles.background}>
            <ScrollView>
                <Title style={styles.title}>Alta Rápida</Title>
                <TextInput
                    label='Código'
                    style={styles.input}
                    onChange={ e => setArticle({...article, code: e.nativeEvent.text})}
                />

                <TextInput
                    label='Descripción'
                    style={styles.input}
                    multiline
                    onChange={ e => setArticle({...article, description: e.nativeEvent.text})}
                />

                <TextInput
                    label='Costo'
                    style={styles.input}
                    onChange={ e => setArticle({...article, cost: e.nativeEvent.text})}
                    keyboardType='numeric'
                />

                <TextInput
                    label='Precio'
                    style={styles.input}
                    onChange={ e => setArticle({...article, price: e.nativeEvent.text})}
                    keyboardType='numeric'
                />

                

                <List.Section title="Opciones" style={styles.listContainer}>
                    <List.Accordion
                        title={`Impuesto`}
                        style={styles.list}
                        expanded={expandedTax}
                        onPress={ () => setExpandedTax(!expandedTax)}
                        description={article.tax === '' ? 'Seleccionar Impuesto' : article.tax}
                    >
                        <List.Item title="IVA" description='Valor de impuesto: 16' onPress={() => handleTaxChange('IVA')}/>
                        <List.Item title="IE3" description='Valor de impuesto: 8' onPress={() => handleTaxChange('IE3')}/>
                    </List.Accordion>

                    <List.Accordion
                        title={`Linea`}
                        style={styles.list}
                        expanded={expandedLine}
                        onPress={ () => setExpandedLine(!expandedLine)}
                        description={article.line === '' ? 'Seleccionar Linea' : article.line}
                    >
                        <List.Item title="Bebidas" description='JUGOS REFRESCOS AGUAS' onPress={() => handleLineChange('BEBIDAS')}/>
                        <List.Item title="Botanas" description='FRITURAS PAPAS SEMILLAS' onPress={() => handleLineChange('BOTANAS')}/>
                    </List.Accordion>
                </List.Section>

                <Button mode="contained" style={styles.button} dark onPress={() => console.log('pressed')}>
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