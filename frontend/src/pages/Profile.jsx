import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [emailRequest, setEmailRequest] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/auth/me-jwt', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('session'))?.token}`,
      }
    }).then(res => {
      setUser(res.data.user);
      setUsername(res.data.user.username);
    }).catch(err => {
      toast.error("Failed to load profile");
    });
  }, []);

  const handleUsernameUpdate = async () => {
    try {
      await axios.patch('http://localhost:8000/users/update-username', { username }, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('session'))?.token}`,
        }
      });
      toast.success("Username updated!");
    } catch (err) {
      toast.error("Error updating username");
    }
  };

  const handleEmailRequest = async () => {
    try {
      await axios.post('http://localhost:8000/users/request-email-update', { email: emailRequest }, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('session'))?.token}`,
        }
      });
      toast.success("Confirmation link sent to your new email!");
    } catch (err) {
      toast.error("Failed to request email update");
    }
  };

  if (!user) return <p className='text-center mt-10'>Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-600">Profile Settings</h2>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleUsernameUpdate}
            className="mt-3 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 w-full"
          >
            Update Username
          </button>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Request New Email</label>
          <input
            type="email"
            value={emailRequest}
            onChange={e => setEmailRequest(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="yournewemail@example.com"
          />
          <button
            onClick={handleEmailRequest}
            className="mt-3 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 w-full"
          >
            Request Email Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
