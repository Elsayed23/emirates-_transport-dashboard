'use client';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OfficerTasks({ params: { id } }) {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            const res = await fetch(`/api/safety_officer/${id}/analytics`);
            const data = await res.json();
            setTasks(data.tasks);
            setFilteredTasks(data.tasks);
        };

        fetchTasks();
    }, [id]);

    const handleMonthChange = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);

        if (month) {
            const filtered = tasks.filter(task => {
                const taskDate = new Date(task.createdAt);
                return taskDate.getMonth() + 1 === parseInt(month);
            });
            setFilteredTasks(filtered);
        } else {
            setFilteredTasks(tasks);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-5">
            <div className="max-w-4xl mx-auto bg-white p-5 rounded-md shadow-md">
                <h1 className="text-2xl font-semibold text-gray-800 mb-5">Officer Tasks</h1>

                <div className="mb-5">
                    <label htmlFor="month" className="block text-gray-700 mb-2">Filter by Month:</label>
                    <select
                        id="month"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">All Months</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>

                <div className="space-y-8">
                    {filteredTasks.map((task) => {
                        const chartData = {
                            labels: ['Completed', 'Remaining'],
                            datasets: [
                                {
                                    label: task.name,
                                    data: [
                                        task.completedCount,
                                        task.taskCount - task.completedCount,
                                    ],
                                    backgroundColor: [
                                        'rgba(54, 162, 235, 0.5)',
                                        'rgba(255, 99, 132, 0.5)',
                                    ],
                                    borderColor: [
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 99, 132, 1)',
                                    ],
                                    borderWidth: 1,
                                },
                            ],
                        };

                        return (
                            <div key={task.id} className="bg-gray-50 p-4 rounded-md shadow-md">
                                <h2 className="text-xl font-medium text-gray-800 mb-4">{task.name}</h2>
                                <div className="mb-4">
                                    <Pie data={chartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
                                </div>
                                <p className="text-gray-700"><strong>Completed:</strong> {task.completedCount}/{task.taskCount}</p>
                                <p className="text-gray-700"><strong>Date:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
                                {task.deadline && (
                                    <>
                                        <p className="text-gray-700"><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                                        <p className="text-gray-700"><strong>Remaining Days:</strong> {task.remainingDays}</p>
                                        <p className="text-gray-700"><strong>Completion Percentage:</strong> {task.completionPercentage.toFixed(2)}%</p>
                                    </>
                                )}
                                <p className="text-gray-700"><strong>Note:</strong> {task.note}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
