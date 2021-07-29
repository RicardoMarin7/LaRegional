import React from 'react'
import { View} from 'react-native'
import { Button, Text } from 'react-native-paper'

const Home = ({navigation}) => {
    return ( 
        <View>
            <Text>Home</Text>
            <Button onPress={ () => navigation.navigate('fastarticle')} mode='contained'>
                To Fast Articles
            </Button>
        </View>
    );
}

export default Home;