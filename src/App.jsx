import { createBrowserRouter, RouterProvider } from 'react-router';
import './App.css';
import CouponClaim from './components/CouponClaim';
import Login from './components/Login';
const router = createBrowserRouter([
  {
    path: '/',
    element: <CouponClaim />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
