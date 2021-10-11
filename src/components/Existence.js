import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { DataTable } from 'react-native-paper'
import { size, map} from 'lodash'
import useCloudContext from '../hooks/useCloudContext'
import SearchBar from './SearchBar'

const Existence = (props) => {
    const {warehouse = 1} = props
    const { products } = useCloudContext()
    const [numberOfPages, setNumberOfPages] = useState(null);
    const [actualPage, setActualPage] = useState(0);
    const [paginatedItems, setPaginatedItems] = useState(null);
    const [filtered, setFiltered] = useState(null);

    const itemsPerPage = 10
    let from = actualPage * itemsPerPage;
    let to = Math.min((actualPage + 1) * itemsPerPage, products.length);


    useEffect(() => {
        setNumberOfPages(Math.ceil(products.length / itemsPerPage))
    }, [products])

    useEffect(() => {
        getPaginatedItems()
    }, [actualPage]);

    useEffect(() => {
        setFiltered(paginatedItems)
    }, [paginatedItems]);

    const getPaginatedItems = () => {
        let offset = (actualPage - 1) * itemsPerPage
        const paginatedItems = products.slice(offset).slice(0, itemsPerPage)
        setPaginatedItems(paginatedItems)
    }


    return (
        <View>
            <SearchBar array={ products } setArray={setFiltered} onSubmit/>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Articulo</DataTable.Title>
                    <DataTable.Title >Descripcion</DataTable.Title>
                    <DataTable.Title numeric>Existencia</DataTable.Title>
                </DataTable.Header>

                {size(filtered) > 0 && (
                        map(filtered, product =>(
                            <DataTable.Row key={product.code}>
                                <DataTable.Cell style={{flex: 2}}>{product.code}</DataTable.Cell>
                                <DataTable.Cell style={{flex: 3}}>{product.description}</DataTable.Cell>
                                <DataTable.Cell numeric style={{flex: 1}}>{warehouse === 1 ? product.warehouse1 : product.warehouse2}</DataTable.Cell>
                            </DataTable.Row>
                        ))
                    )}

                <DataTable.Pagination
                    numberOfPages={numberOfPages}
                    showFastPagination
                    page={actualPage}
                    itemsPerPage={ itemsPerPage }
                    showFastPaginationControls
                    label={`${from + 1}-${to} of ${products.length}`}
                    onPageChange={page => setActualPage(page)}
                />
            </DataTable>
        </View>
    );
}
 
export default Existence;