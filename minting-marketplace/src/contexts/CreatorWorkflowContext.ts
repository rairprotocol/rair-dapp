import { createContext } from 'react';

import { TWorkflowContextType } from './../components/creatorStudio/creatorStudio.types';

const Context = createContext<TWorkflowContextType | null>(null);

export default Context;
