import { createContext } from 'react'

const CloudContext = createContext({
    lines: [],
    products: [],
    getLines: () => null,
    getProducts: () => null
})

export default CloudContext