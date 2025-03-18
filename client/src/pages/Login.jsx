import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            toast.success('Login successful');
            if (res.data.role === 'admin') navigate('/admin');
            else navigate('/employee');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <h2>Sign In (Admin/General)</h2>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
            />
            <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
            />
            <div className="options">
                <label>
                    <input 
                        type="checkbox" 
                        checked={showPassword} 
                        onChange={() => setShowPassword(!showPassword)} 
                    />
                    Show Password
                </label>
                <label>
                    <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={() => setRememberMe(!rememberMe)} 
                    />
                    Remember Me
                </label>
            </div>
            <button onClick={handleLogin}>Login</button>
            <p>
                <a href="/register">Add New Employee</a> | <a href="/employee-login">Employee Login</a> | 
                <a href="/forgot-password">Forgot Password?</a>
            </p>
        </div>
    );
}

export default Login;