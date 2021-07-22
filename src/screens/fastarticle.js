import React, { useState } from 'react'
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { Title, TextInput, Button, List} from 'react-native-paper'

const FastArticle = () => {
    const [article, setArticle] = useState(defaultValues());

    return ( 
        <SafeAreaView style={nativeStyles.background}>
            <ScrollView>
                <Title style={styles.title}>Alta Rápida</Title>
                <TextInput
                    label='Código'
                    style={styles.input}
                />

                <TextInput
                    label='Descripción'
                    style={styles.input}
                    multiline
                />

                <List.Section title="Opciones" style={styles.listContainer}>
                    <List.Accordion
                        title="Impuesto"
                        style={styles.list}
                    >
                        <List.Item title="First item" description='loiqweqwuoieuwqeiwqioquioe' onPress={e => console.log(e.nativeEvent)}/>
                        <List.Item title="Second item" />
                        <List.Item title="Second item" />
                        <List.Item title="Second item" />
                        <List.Item title="Second item" />
                        <List.Item title="Second item" />
                        <List.Item title="Second item" />
                        <List.Item title="Second item" />
                        <List.Item title="Second item" />
                        <List.Item title="Second item" />
                        <List.Item title="Second item" />
                        <List.Item title="Second item" />
                        <List.Item title="Second item" />
                        <List.Item title="Second item" />
                        <List.Item title="10 item" />
                    </List.Accordion>
                </List.Section>
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
    }
}

const nativeStyles = StyleSheet.create({
    background:{
        backgroundColor: '#232429',
        height: '100%',
        flex: 1,
        // alignItems: 'center',
    }
})

const defaultValues = () => ({
    code: '',
    description: '',
    line: '',
    impuesto: '',
    cost:'',
    price:''
})



export default FastArticle;