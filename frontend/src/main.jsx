import Store from './Store.jsx';
import './index.css';

import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
const ServiceScreen = lazy(() => import('./screens/service.jsx'));
const HowItWorksScreen = lazy(() => import('./screens/howItWorks.jsx'));
const ProductsScreen = lazy(() => import('./screens/products.jsx'));
const ProductScreen = lazy(() => import('./screens/product.jsx'));
const VideosScreen = lazy(() => import('./screens/videos.jsx'));
const VideoScreen = lazy(() => import('./screens/video.jsx'));
const AudiosScreen = lazy(() => import('./screens/audio.jsx'));
const PortfolioScreen = lazy(() => import('./screens/portfolio.jsx'));
const WorkScreen = lazy(() => import('./screens/work.jsx'));
const OrdersScreen = lazy(() => import('./screens/orders.jsx'));
const CartScreen = lazy(() => import('./screens/cart.jsx'));
const MyProductsScreen = lazy(() => import('./screens/myProducts.jsx'));
const MyVideosScreen = lazy(() => import('./screens/myVideos.jsx'));
const MyAudiosScreen = lazy(() => import('./screens/myAudios.jsx'));
const DashboardScreen = lazy(() => import('./screens/dashboard.jsx'));
const SettingsScreen = lazy(() => import('./screens/settings.jsx'));
const PolicyAndTermsScreen = lazy(() => import('./screens/policyAndTerms.jsx'));
const SuccessScreen = lazy(() => import('./screens/success.jsx'));
const RequestPaymentScreen = lazy(() => import('./screens/requestPaymentScreen.jsx'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
        <Route index element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><HomeScreen /></Suspense>} />
        <Route path='/login' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><LoginScreen /></Suspense>} />
        <Route path='/register' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><RegisterScreen /></Suspense>} />
        <Route path='/about' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><AboutScreen /></Suspense>} />
        <Route path='/services/:search?/:type?' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><ServicesScreen /></Suspense>} />
        <Route path='/how_it_works' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><HowItWorksScreen /></Suspense>} />
        <Route path='/images/:search?/:type?' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><ProductsScreen /></Suspense>} />
        <Route path='/product/:id' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><ProductScreen /></Suspense>} />
        <Route path='/videos/:search?/:type?' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><VideosScreen /></Suspense>} />
        <Route path='/video/:id' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><VideoScreen /></Suspense>} />
        <Route path='/audios/:search?/:type?' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><AudiosScreen /></Suspense>} />
        <Route path='/terms-and-policy' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><PolicyAndTermsScreen /></Suspense>} />
        <Route path='/vendor-profile' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><PolicyAndTermsScreen /></Suspense>} />
        <Route path='/service/:id/:vendor' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><ServiceScreen /></Suspense>} />
        <Route path='/service/work/:id' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><WorkScreen /></Suspense>} />
        <Route path='/work/:id' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><WorkScreen /></Suspense>} />
        <Route path='/success' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><SuccessScreen /></Suspense>} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute allowedRoles={[0, 1, 2, 3]} />}>
            <Route path='/profile' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><ProfileScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[0, 2, 3]} />}>
            <Route path='/dashboard' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><DashboardScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[0, 1, 2, 3]} />}>
            <Route path='/setting' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><SettingsScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[1]} />}>
            <Route path='/orders' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><OrdersScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[1]} />}>
            <Route path='/cart' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><CartScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[2]} />}>
            <Route path='/myProducts' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><MyProductsScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[2]} />}>
            <Route path='/myVideos' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><MyVideosScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[2]} />}>
            <Route path='/myAudios' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><MyAudiosScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[3]} />}>
            <Route path='/portfolio' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><PortfolioScreen /></Suspense>} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[2]} />}>
            <Route path='/request-payout' element={<Suspense fallback={<div><h4>Route Loading...</h4></div>}><RequestPaymentScreen /></Suspense>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </>
  ),
  {
    future: {
      v7_startTransition: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
