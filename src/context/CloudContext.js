import { createContext } from 'react'

const CloudContext = createContext({
    lines: [],
    products: [],
    getLines: () => null,
    getProducts: (isLocalEmpty) => null,
    setLines:() => null,
    setProducts: (isLocalEmpty) => null
})

export default CloudContext