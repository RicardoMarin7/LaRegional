import { createContext } from 'react'

const CloudContext = createContext({
    lines: [],
    products: [],
    providers: [],
    getProviders: () => null,
    setProviders: () => null,
    getProducts: (isLocalEmpty) => null,
    setProducts: (isLocalEmpty) => null,
    getLines: () => null,
    setLines:() => null,
})

export default CloudContext