import { createContext } from 'react'

const CloudContext = createContext({
    lines: [],
    products: [],
    getLines: () => null,
    getProducts: () => null,
    setLines:() => null,
    setProducts: () => null
})

export default CloudContext