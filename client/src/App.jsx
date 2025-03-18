import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import EmployeeLogin from './pages/EmployeeLogin';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import RegisterEmployee from './pages/RegisterEmployee';
import ForgotPassword from './pages/ForgotPassword'; // New import

function App() {
    return (
        <Router>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/employee-login" element={<EmployeeLogin />} />
                <Route path="/register" element={<RegisterEmployee />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/employee" element={<EmployeeDashboard />} />
                <Route path="/forgot-password" element={<ForgotPassword />} /> {/* New route */}
            </Routes>
        </Router>
    );
}

export default App;