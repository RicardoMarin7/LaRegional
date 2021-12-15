import { find } from 'lodash'


const handleProductChange = (code, parameter, value, setAddedProducts, addedProducts) => {
    const addedProductsTemp = []
    for (let i = 0; i < addedProducts.length; i++) {
        if(addedProducts[i].code !== code){
            addedProductsTemp.push({...addedProducts[i]})
        }else{
            addedProductsTemp.push({...addedProducts[i], [parameter]: value})
        }
    }
    setAddedProducts(addedProductsTemp)
}

const searchAdditionalCode = (code, collection) => {        
    const additionalCodeProduct = find( collection, product => {
        const additionalCodes = JSON.parse(product.additionalCodes)
        if(additionalCodes){
            if(Object.keys(additionalCodes).length < 1) return
            for (const additionalCode in additionalCodes) {
                if (additionalCodes.hasOwnProperty(additionalCode)) {
                    if( additionalCodes[additionalCode].additionalCode === code){
                        return product
                    }
                }
            }
        }
    })

    return additionalCodeProduct ? additionalCodeProduct : false
}

export const addProduct = ( code, productsAdded, allProducts, setCodeInput, setAddedProducts) =>{
    if(code === '') return

        let alreadyAdded = find( productsAdded, { code: code.toUpperCase() } )

        if(!alreadyAdded){
            alreadyAdded = searchAdditionalCode( code, productsAdded)
        }

        if(alreadyAdded){
            if(isNaN(alreadyAdded.quantity)){
                return false
            }
            setCodeInput('')
            handleProductChange(alreadyAdded.code, 'quantity', alreadyAdded.quantity + 1, setAddedProducts, productsAdded)
            return true
        }

        let productToAdd = find( allProducts, { code: code.toUpperCase() } )
        if(!productToAdd){
            const hasAdditionalCode = searchAdditionalCode(code, allProducts)
            if(!hasAdditionalCode){
                // ToastAndroid.showWithGravity(`El articulo ${code}, no existe`, ToastAndroid.SHORT, ToastAndroid.CENTER)                
                setCodeInput('')
                return false
            }
            productToAdd = hasAdditionalCode           
        }

        setCodeInput('')
        const productsAddedTemp = [...productsAdded]
        productsAddedTemp.push({...productToAdd, quantity: 1})
        setAddedProducts(productsAddedTemp)
        return true
}