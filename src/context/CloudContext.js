import { createContext } from 'react'

const CloudContext = createContext({
    lines: [],
    products: [],
    providers: [],
    loadingProducts: null,
    getProviders: () => null,
    setProviders: () => null,
    getProducts: (isLocalEmpty) => null,
    setProducts: (isLocalEmpty) => null,
    getLines: () => null,
    setLines:() => null,
    setProductsToState:() => null,
    setLoadingProducts: () => null,
})

export default CloudContext