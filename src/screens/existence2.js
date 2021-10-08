import React from 'react'
import { ScrollView } from 'react-native'
import { default as ExistenceComponent } from '../components/Existence'

const Existence2 = () => {
    return (
        <ScrollView>
            <ExistenceComponent warehouse={2} />
        </ScrollView>
    );
}
 
export default Existence2;