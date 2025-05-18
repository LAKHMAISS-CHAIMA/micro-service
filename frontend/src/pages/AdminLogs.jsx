import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem('session'))?.token;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:8000/users/admin/logs', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLogs(res.data.logs);
      } catch (err) {
        toast.error("Access denied or failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token]);

  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-gray-100'>
        <p className='text-lg text-cyan-600'>Loading admin logs...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <h2 className='text-2xl font-bold text-cyan-700 mb-4'>User Update Logs</h2>

      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white shadow-md rounded border'>
          <thead className='bg-cyan-600 text-white'>
            <tr>
              <th className='px-4 py-2 text-left'>User ID</th>
              <th className='px-4 py-2 text-left'>Field</th>
              <th className='px-4 py-2 text-left'>Old Value</th>
              <th className='px-4 py-2 text-left'>New Value</th>
              <th className='px-4 py-2 text-left'>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id} className='border-t'>
                <td className='px-4 py-2'>{log.userId}</td>
                <td className='px-4 py-2'>{log.field}</td>
                <td className='px-4 py-2'>{log.oldValue}</td>
                <td className='px-4 py-2'>{log.newValue}</td>
                <td className='px-4 py-2'>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan='5' className='text-center text-gray-500 py-4'>
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLogs;
