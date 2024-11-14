import Store from './Store.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import ProfileButtons from './components/ProfileButtons.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import RoleRoute from './components/RoleRoute.jsx';
import App from './App.jsx';

// Lazy load screens for better performance
const HomeScreen = lazy(() => import('./screens/home.jsx'));
const LoginScreen = lazy(() => import('./screens/login.jsx'));
const RegisterScreen = lazy(() => import('./screens/register.jsx'));
const ProfileScreen = lazy(() => import('./screens/profile.jsx'));
const AboutScreen = lazy(() => import('./screens/about.jsx'));
const ServicesScreen = lazy(() => import('./screens/services.jsx'));
const HowItWorksScreen = lazy(() => import('./screens/howItWorks.jsx'));
const ProductsScreen = lazy(() => import('./screens/products.jsx'));
const PortfolioScreen = lazy(() => import('./screens/portfolio.jsx'));
const OrdersScreen = lazy(() => import('./screens/orders.jsx'));
const CollectionScreen = lazy(() => import('./screens/collections.jsx'));
const ContactScreen = lazy(() => import('./screens/contact.jsx'));
const SettingsScreen = lazy(() => import('./screens/settings.jsx'));
const PolicyAndTermsScreen = lazy(() => import('./screens/policyAndTerms.jsx'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
        <Route index element={<Suspense fallback={<div><h4>Loading...</h4></div>}><HomeScreen /></Suspense>} />
        <Route path='/login' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><LoginScreen /></Suspense>} />
        <Route path='/register' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><RegisterScreen /></Suspense>} />
        <Route path='/about' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><AboutScreen /></Suspense>} />
        <Route path='/services' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><ServicesScreen /></Suspense>} />
        <Route path='/how_it_works' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><HowItWorksScreen /></Suspense>} />
        <Route path='/products' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><ProductsScreen /></Suspense>} />
        <Route path='/terms-and-policy' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><PolicyAndTermsScreen /></Suspense>} />
        <Route path='/vendor-profile' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><PolicyAndTermsScreen /></Suspense>} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute allowedRoles={[1, 2, 3]} />}>
            <Route path='/profile' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><ProfileButtons /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[1, 2, 3]} />}>
            <Route path='/setting' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><SettingsScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[1, 2, 3]} />}>
            <Route path='/update' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><ProfileScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[1, 2, 3]} />}>
            <Route path='/orders' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><OrdersScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[2, 3]} />}>
            <Route path='/collections' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><CollectionScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[2, 3]} />}>
            <Route path='/contact' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><ContactScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[3]} />}>
            <Route path='/portfolio' element={<Suspense fallback={<div><h4>Loading...</h4></div>}><PortfolioScreen /></Suspense>} />
          </Route>
        </Route>
        <Route path="*" element={<div className="not-found-page">404 - Page Not Found</div>} />
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
