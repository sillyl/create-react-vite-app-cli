import React from 'react';
import {Provider} from 'mobx-react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {initLocale} from '@src/utils/initLocale';
import Counter from '@src/routes/index';
import App from './App';
import NotFound from './components/NotFound';
import stores from './stores';
import './index.less';

initLocale();

ReactDOM.render(
  <Provider {...stores}>
    <BrowserRouter basename='/demo'>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/main' element={<Counter />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
