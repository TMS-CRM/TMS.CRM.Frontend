import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthenticatedLayout from './components/authenticated-layout/authenticated-layout';
import CustomerDetails from './pages/customer-details/customer-details';
import Customers from './pages/customers/customers';
import DealDetails from './pages/deal-details/deal-details';
import Deals from './pages/deals/deals';
import Home from './pages/home/home';
import SignIn from './pages/sign-in/sign-in';
import Tasks from './pages/tasks/tasks';
import UserDetails from './pages/user-details/user-details';
import Users from './pages/users/users';

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
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/users" element={<Users />} />
        <Route path="/user-details/:uuid" element={<UserDetails />} />
      </Route>
    </Routes>
  );
}
