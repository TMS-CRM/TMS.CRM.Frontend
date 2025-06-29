import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthenticatedLayout from './components/authenticated-layout/authenticated-layout';
import Home from './pages/home/home';
import SignIn from './pages/sign-in/sign-in';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />

      <Route element={<AuthenticatedLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}
