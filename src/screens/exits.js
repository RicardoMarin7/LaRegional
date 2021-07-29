import React, { useEffect, useState } from 'react'
import { ScrollView, SafeAreaView} from 'react-native'
import { DataTable } from 'react-native-paper'
import { size, map } from 'lodash'
import useCloudContext from '../hooks/useCloudContext'

const Exits = () => {
    const { products } = useCloudContext()
    const [page, setPage] = useState(0);
    const optionsPerPage = [10,100,200]
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
    let numberOfPages = 1

    useEffect(() => {
        numberOfPages = Math.ceil(size(products) / itemsPerPage)
    }, [products]);

    return (
        <SafeAreaView>
            <ScrollView>
                {/* <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Products</DataTable.Title>
                    </DataTable.Header>

                        {size(products) > 0 && (
                            map(products, product =>(
                                <DataTable.Row key={product.code}>
                                    <DataTable.Cell>{product.code}</DataTable.Cell>
                                </DataTable.Row>
                            ))
                            )
                        }
                    <DataTable.Pagination
                        page={page}
                        numberOfPages={numberOfPages}
                        onPageChange={ (page) => setPage(page)}
                        optionsPerPage={ optionsPerPage}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        showFastPagination
                        optionsLabel={'Productos por página'}
                    />
                </DataTable> */}
            </ScrollView>
        </SafeAreaView>
    );
}

export default Exits;