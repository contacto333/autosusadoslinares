import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';

import PublishPage from './pages/PublishPage';

import CarDetails from './pages/CarDetails';

import Admin from './pages/Admin';
import Login from './pages/Login';
import EditListing from './pages/EditListing';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/publicar" element={<PublishPage />} />
                    <Route path="/auto/:id" element={<CarDetails />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/editar/:id" element={<EditListing />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
