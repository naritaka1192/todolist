import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './auth/Home';
import Signup from './auth/Signup';
import Signin from './auth/Signin';


import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Appbar3 from './auth/Appbar3';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(

  <BrowserRouter>
    {/* <Appbar3 /> */}
    <Routes>
    {/* <App /> */}
    <Route path="/" element={<Home />}/>
    <Route path="/Signup" element={<Signup />} />
    <Route path="/Signin" element={<Signin />} />
    <Route path="/App" element={<App />} />

    </Routes>
    </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
