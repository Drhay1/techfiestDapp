import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { theme } from './utils/theme';
import store from './store/store';
import { loadUser } from './store/slices/userSlice';
import {
  getHackathonListings,
  getSponsors,
} from './store/slices/hackathonSlice';

store.dispatch(loadUser());
store.dispatch(getHackathonListings());
store.dispatch(getSponsors());

const rootElement: HTMLElement | any = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
