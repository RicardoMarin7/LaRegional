import React, { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { TextInput, Title, Card, Button, Paragraph} from 'react-native-paper'
import usePreferencesContext from '../hooks/usePreferencesContext'
import { size, map } from 'lodash'

const Entries = () => {
    const colors = usePreferencesContext()
    const [entryProducts, setEntryProducts] = useState([{
        code: '.024142004054',
        cost: 22.490739847039,
        description: 'PALETA CLASICA 1/40PZAS.',
        line:'SYS',
        price: 32.4074061196528,
        tax: 'IE3'
    }]);

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
            backgroundColor: colors.backgroundColor,
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
        },
        cardSubtitle:{
            fontSize: 16
        },
        cardInput:{
            width: '30%',
            height: 50
        },

        cardActions:{
            alignSelf: 'flex-end'
        }
    }

    return ( 
        <SafeAreaView style={nativeStyles.background}>
            <ScrollView>
                <Title style={paperStyles.title}>Entradas</Title>
                <TextInput 
                    label={'Código'}
                    right={<TextInput.Icon name='plus-thick' style={paperStyles.icon} />}
                    style={paperStyles.input}
                />

                {size(entryProducts) > 0 && (
                    map(entryProducts, product =>(
                        <Card key={product.code} style={paperStyles.card}>
                            <Card.Title title={product.code} subtitle={product.description} subtitleStyle={paperStyles.cardSubtitle}/>
                            <Card.Content style={paperStyles.cardContent}>
                                <TextInput
                                    style={paperStyles.cardInput}
                                    keyboardType='numeric'
                                    label='Cantidad'
                                    selectTextOnFocus
                                />
                            </Card.Content>
                            <Card.Actions style={paperStyles.cardActions}>
                                <Button>Eliminar</Button>
                            </Card.Actions>
                        </Card>
                    ))
                )}
            </ScrollView>    
        </SafeAreaView>
    );
}





export default Entries;