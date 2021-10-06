import React from 'react'
import { SafeAreaView } from 'react-native'
import { Title, DataTable } from 'react-native-paper'

const Existence = () => {
    return (
        <SafeAreaView>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Articulo</DataTable.Title>
                    <DataTable.Title>Descripcion</DataTable.Title>
                    <DataTable.Title numeric>Existencia</DataTable.Title>
                </DataTable.Header>

                <DataTable.Row>
                    <DataTable.Cell>ZTE</DataTable.Cell>
                    <DataTable.Cell style={{flex:1}}>ZARZUELA TAITTO ENCHILADA 1/1KG</DataTable.Cell>
                    <DataTable.Cell numeric>6.0</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>SYAL0420</DataTable.Cell>
                    <DataTable.Cell>PRODUCTO ZEBRA DE PRUEBA</DataTable.Cell>
                    <DataTable.Cell numeric>8.0</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Pagination
                    numberOfPages={3}
                    label="1-2 of 6"
                    showFastPagination
                    optionsLabel={'Rows per page'}
                />
            </DataTable>
        </SafeAreaView>
    );
}
 
export default Existence;