import { BrowserRouter as Router, Routes as ReactRoutes, Route } from 'react-router-dom';
import Login from '@/pages/login';
import Register from '@/pages/register';

const Routes = () => {
    return (
        <Router>
            <ReactRoutes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </ReactRoutes>
        </Router>
    );
};

export default Routes;