import React from 'react';
import { Searchbar } from 'react-native-paper'
import usePreferencesContext from '../hooks/usePreferencesContext'

const SearchBar = ({ array, setArray }) => {
    const  colors  = usePreferencesContext()
    const handleQueryChange = query =>{
        const filtered = array.filter( element =>{
            return element.description.toUpperCase().includes(query.toUpperCase()) || element.code.toUpperCase().includes(query.toUpperCase())
        })

        setArray({...filtered})
    }

    const searchBarStyle = {
        width: '90%',
        alignSelf: 'center',
        marginBottom: 10,
        backgroundColor: colors.secondaryBackgroundColor
    }

    return (
        <Searchbar
            placeholder='Buscar'
            onChangeText={ text => handleQueryChange(text)}
            style={searchBarStyle}
        />
    );
}


 
export default SearchBar;