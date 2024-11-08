import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {createBrowserRouter,createRoutesFromElements,Route,RouterProvider,} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import Store from './Store.jsx';
import './index.css';
import HomeScreen from './screens/home.jsx';
import LoginScreen from './screens/login.jsx';
import RegisterScreen from './screens/register.jsx';
import ProfileScreen from './screens/Profile.jsx';
import AboutScreen from './screens/about.jsx';
import ServicesScreen from './screens/services.jsx';
import HowItWorksScreen from './screens/howItWorks.jsx';
import ProcessScreen from './screens/process.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
        <Route index={true} path='/' element={<HomeScreen />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/register' element={<RegisterScreen />} />
        <Route path='/about' element={<AboutScreen />} />
        <Route path='/services' element={<ServicesScreen />} />
        <Route path='/how_it_works' element={<HowItWorksScreen />} />
        <Route path='/process' element={<ProcessScreen />} />
        <Route path='' element={<PrivateRoute />}>
          <Route path='/profile' element={<ProfileScreen />} />
        </Route>
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);