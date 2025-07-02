import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthenticatedLayout from './components/authenticated-layout/authenticated-layout';
import CustomerDetails from './pages/customer-details/customer-details';
import Customers from './pages/customers/customers';
import DealDetails from './pages/deal-details/deal-details';
import Deals from './pages/deals/deals';
import Home from './pages/home/home';
import SignIn from './pages/sign-in/sign-in';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />

      <Route element={<AuthenticatedLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/deal-details/:uuid" element={<DealDetails />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customer-details/:uuid" element={<CustomerDetails />} />

        {/* <Route path="/task" element={<Task />} /> */}
        {/* <Route path="/user" element={<User />} /> */}
      </Route>
    </Routes>
  );
}
