import React from 'react'
import { View } from 'react-native'
import { Button, Text} from 'react-native-paper'

const Purchases = ({navigation}) => {
    return ( 
        <View>
            <Button icon='arrow-right' mode='contained' onPress={ () => navigation.navigate('entries')}>
                Navigate to Entries
            </Button>
        </View>
    );
}

export default Purchases;