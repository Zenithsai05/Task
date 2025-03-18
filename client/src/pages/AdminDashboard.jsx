import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminDashboard() {
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState({ employee_id: '', task_name: '', description: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const [empRes, taskRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/tasks/employees', { headers: { Authorization: token } }),
                    axios.get('http://localhost:5000/api/tasks/all', { headers: { Authorization: token } }) // Fetch all tasks
                ]);
                setEmployees(empRes.data);
                setTasks(taskRes.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to load data');
            }
        };
        fetchData();
    }, []);

    const handleAddTask = async () => {
        if (!taskData.employee_id || !taskData.task_name || !taskData.description) {
            toast.error('All fields are required');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/tasks/add', taskData, { headers: { Authorization: token } });
            toast.success('Task added successfully');
            setTaskData({ employee_id: '', task_name: '', description: '' });
            const res = await axios.get('http://localhost:5000/api/tasks/all', { headers: { Authorization: token } });
            setTasks(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add task');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/');
    };

    return (
        <div className="dashboard">
            <div className="header">
                <h2>Admin Dashboard</h2>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            <div className="task-form">
                <select value={taskData.employee_id} onChange={e => setTaskData({ ...taskData, employee_id: e.target.value })}>
                    <option value="">Select Employee</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
                <input 
                    placeholder="Task Name" 
                    value={taskData.task_name} 
                    onChange={e => setTaskData({ ...taskData, task_name: e.target.value })} 
                />
                <textarea 
                    placeholder="Description" 
                    value={taskData.description} 
                    onChange={e => setTaskData({ ...taskData, description: e.target.value })} 
                />
                <button onClick={handleAddTask}>Add Task</button>
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
                            <td>{task.employee_name}</td>
                            <td>{task.task_name}</td>
                            <td>{task.description}</td>
                            <td>{task.status}</td>
                            <td>{new Date(task.created_at).toLocaleString()}</td>
                            <td>{task.updated_at ? new Date(task.updated_at).toLocaleString() : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;