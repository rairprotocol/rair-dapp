import { TWorkflowContextType } from './../components/creatorStudio/creatorStudio.types';
import { createContext } from 'react';

const Context = createContext<TWorkflowContextType | null>(null);

export default Context;
