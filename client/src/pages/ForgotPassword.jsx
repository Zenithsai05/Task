import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function ForgotPassword() {
    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to retrieve password');
        }
    };

    return (
        <div className="login-container">
            <h2>Forgot Password (Admin/Employee)</h2>
            <p>Enter your registered email to retrieve your password.</p>
            <input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
            />
            <button onClick={handleSubmit}>Submit</button>
            <p>
                <a href="/">Back to Admin/General Login</a> | <a href="/employee-login">Back to Employee Login</a>
            </p>
        </div>
    );
}

export default ForgotPassword;