import React from 'react'
import { ScrollView } from 'react-native'
import { default as ExistenceComponent } from '../components/Existence'

const Existence = () => {
    

    return (
        <ScrollView>
            <ExistenceComponent warehouse={1} />
        </ScrollView>
    );
}
 
export default Existence;