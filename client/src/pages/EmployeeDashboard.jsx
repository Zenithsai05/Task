import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function EmployeeDashboard() {
    const [tasks, setTasks] = useState([]);
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please log in');
                navigate('/employee-login');
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/api/tasks/employee', { headers: { Authorization: token } });
                setTasks(res.data);
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setName(decoded.name || 'Employee');
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to load tasks');
            }
        };
        fetchTasks();
    }, [navigate]);

    const updateStatus = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/tasks/update/${id}`, { status }, { headers: { Authorization: token } });
            const res = await axios.get('http://localhost:5000/api/tasks/employee', { headers: { Authorization: token } });
            setTasks(res.data);
            toast.success('Task status updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update task');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/employee-login');
    };

    return (
        <div className="dashboard">
            <div className="header">
                <h2>Welcome, {name}</h2>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Task Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>{name}</td>
                            <td>{task.task_name}</td>
                            <td>{task.description}</td>
                            <td>{task.status}</td>
                            <td>{new Date(task.created_at).toLocaleString()}</td>
                            <td>{task.updated_at ? new Date(task.updated_at).toLocaleString() : '-'}</td>
                            <td>
                                <button onClick={() => updateStatus(task.id, 'completed')}>Complete</button>
                                <button onClick={() => updateStatus(task.id, 'failed')}>Fail</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeDashboard;