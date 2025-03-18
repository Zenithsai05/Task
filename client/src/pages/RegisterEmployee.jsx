import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function RegisterEmployee() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            toast.error('All fields are required');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error('Invalid email format');
            return;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            toast.success('Employee registered successfully');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="register-container">
            <h2>Add New Employee</h2>
            <input 
                placeholder="Name" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
            />
            <input 
                placeholder="Email" 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={e => setFormData({ ...formData, password: e.target.value })} 
            />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default RegisterEmployee;