//@ts-nocheck
import {createContext} from 'react';

const defaultValue = {
	contractAddress: undefined,
	collectionIndex: undefined,
	steps: []
}

const Context = createContext(defaultValue);

export default Context;