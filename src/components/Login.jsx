import { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash,
  ToggleLeft,
  ToggleRight,
  LogOut,
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router';

export default function AdminDashboard() {
  // Authentication states
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  // Dashboard states
  const [activeTab, setActiveTab] = useState('coupons');
  const [coupons, setCoupons] = useState([]);
  const [history, setHistory] = useState([]);

  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    isActive: true,
    isClame: false,
  });
  const [editingCoupon, setEditingCoupon] = useState(null);
  console.log(coupons);
  // Fetch coupons on component mount
  useEffect(() => {
    const fetchAllCoupons = async () => {
      try {
        const res = await axios.get(
          'https://job-task-server-ec8s.onrender.com/admin/coupons'
        );
        setCoupons(res.data);
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
        setMessage('Failed to fetch coupons');
      }
    };

    if (adminLoggedIn && activeTab === 'coupons') {
      fetchAllCoupons();
    }
  }, [activeTab]);

  // Login function
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        'https://job-task-server-ec8s.onrender.com/admin/login',
        {
          username,
          password,
        }
      );
      console.log(res.data.token, 'success');
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setAdminLoggedIn(true);
      setMessage('Login successful!');
    } catch (err) {
      setMessage('Login failed. ' + (err.response?.data?.message || ''));
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      setAdminLoggedIn(true);
    }
  }, [token]);
  const handleLogout = () => {
    setAdminLoggedIn(false);
    localStorage.removeItem('token');
    setToken('');
    setUsername('');
    setPassword('');
    setMessage('');
  };
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          'https://job-task-server-ec8s.onrender.com/admin/history'
        );
        setHistory(res.data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
        setMessage('Failed to fetch history');
      }
    };

    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);
  console.log(history, 'history');
  // Coupon management functions
  const toggleCouponActive = async (id) => {
    try {
      const coupon = coupons.find((c) => c._id === id);
      console.log(coupon, id, 45);
      await axios.patch(
        `https://job-task-server-ec8s.onrender.com/admin/coupons/${coupon._id}`,
        {
          isActive: !coupon.isActive,
        }
      );

      setCoupons(
        coupons.map((coupon) =>
          coupon._id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
        )
      );

      setMessage(
        `Coupon ${!coupon.isActive ? 'activated' : 'deactivated'} successfully!`
      );
    } catch (err) {
      setMessage('Failed to update coupon status');
    }
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.code) {
      setMessage('Please enter a coupon code');
      return;
    }

    try {
      const res = await axios.post(
        'https://job-task-server-ec8s.onrender.com/admin/coupons',
        newCoupon
      );

      const fetchAllCoupons = async () => {
        try {
          const res = await axios.get(
            'https://job-task-server-ec8s.onrender.com/admin/coupons'
          );
          setCoupons(res.data);
        } catch (error) {
          console.error('Failed to fetch coupons:', error);
          setMessage('Failed to fetch coupons');
        }
      };

      fetchAllCoupons();

      console.log(res);
      setNewCoupon({ code: '', isActive: true, isClame: false });
      setIsAddingCoupon(false);
      setMessage('Coupon added successfully!');
    } catch (err) {
      setMessage(
        'Failed to add coupon: ' + (err.response?.data?.message || '')
      );
    }
  };

  const handleUpdateCoupon = async () => {
    if (!editingCoupon) return;

    try {
      console.log(editingCoupon, 12);
      await axios.put(
        `https://job-task-server-ec8s.onrender.com/admin/coupons/${editingCoupon._id}`,
        editingCoupon
      );

      setCoupons(
        coupons.map((coupon) =>
          coupon._id === editingCoupon._id ? editingCoupon : coupon
        )
      );

      setEditingCoupon(null);
      setMessage('Coupon updated successfully!');
    } catch (err) {
      setMessage(
        'Failed to update coupon: ' + (err.response?.data?.message || '')
      );
    }
  };

  // Login screen
  if (!adminLoggedIn) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
          <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>
            Admin Login
          </h1>
          <div className='mb-4'>
            <input
              type='text'
              placeholder='Username'
              className='w-full p-3 mb-4 border rounded-lg'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type='password'
              placeholder='Password'
              className='w-full p-3 mb-4 border rounded-lg'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <button
            onClick={handleLogin}
            className='w-full py-3 cursor-pointer px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300'
          >
            Login
          </button>
          {message && (
            <p
              className={`mt-4 text-center p-3 rounded-md ${
                message.includes('successful')
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}
            >
              {message}
            </p>
          )}
          <p className='mt-4 text-center'>
            Want to claim a coupon?{' '}
            <Link to='/' className='text-blue-500 hover:underline'>
              Home
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-white shadow-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-gray-800'>
            Coupon Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className='flex items-center cursor-pointer gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition'
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Tabs */}
        <div className='flex border-b mb-6'>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'coupons'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('coupons')}
          >
            Coupons
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'history'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Claim History
          </button>
        </div>

        {/* Notification */}
        {message && (
          <div
            className={`mb-6 p-3 rounded-md ${
              message.includes('successfully')
                ? 'bg-green-200 text-green-800'
                : 'bg-red-200 text-red-800'
            }`}
          >
            {message}
            <button
              className='float-right text-sm'
              onClick={() => setMessage('')}
            >
              ✕
            </button>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div>
            <div className='flex justify-between items-center mb-6'>
              <button
                onClick={() => setIsAddingCoupon(true)}
                className='flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
              >
                <Plus size={18} />
                <span>Add Coupon</span>
              </button>
            </div>

            {/* Add/Edit Coupon Form */}
            {(isAddingCoupon || editingCoupon) && (
              <div className='mb-6 p-4 bg-white rounded-lg shadow-md'>
                <h2 className='text-xl font-semibold mb-4'>
                  {isAddingCoupon ? 'Add New Coupon' : 'Edit Coupon'}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Coupon Code
                    </label>
                    <input
                      type='text'
                      className='w-full p-2 border rounded-lg'
                      placeholder='e.g. SUMMER25'
                      value={
                        isAddingCoupon ? newCoupon.code : editingCoupon?.code
                      }
                      onChange={(e) =>
                        isAddingCoupon
                          ? setNewCoupon({ ...newCoupon, code: e.target.value })
                          : setEditingCoupon({
                              ...editingCoupon,
                              code: e.target.value,
                            })
                      }
                    />
                  </div>

                  <div className='flex items-center'>
                    <label className='inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        checked={
                          isAddingCoupon
                            ? newCoupon.isActive
                            : editingCoupon?.isActive
                        }
                        onChange={() =>
                          isAddingCoupon
                            ? setNewCoupon({
                                ...newCoupon,
                                isActive: !newCoupon.isActive,
                              })
                            : setEditingCoupon({
                                ...editingCoupon,
                                isActive: !editingCoupon.isActive,
                              })
                        }
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className='ms-3 text-sm font-medium text-gray-700'>
                        {(
                          isAddingCoupon
                            ? newCoupon.isActive
                            : editingCoupon?.isActive
                        )
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </label>
                  </div>

                  <div className='flex items-center'>
                    <label className='inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='sr-only peer'
                        checked={
                          isAddingCoupon
                            ? newCoupon.isClame
                            : editingCoupon?.isClame
                        }
                        onChange={() =>
                          isAddingCoupon
                            ? setNewCoupon({
                                ...newCoupon,
                                isClame: !newCoupon.isClame,
                              })
                            : setEditingCoupon({
                                ...editingCoupon,
                                isClame: !editingCoupon.isClame,
                              })
                        }
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className='ms-3 text-sm font-medium text-gray-700'>
                        {(
                          isAddingCoupon
                            ? newCoupon.isClame
                            : editingCoupon?.isClame
                        )
                          ? 'Claimed'
                          : 'Unclaimed'}
                      </span>
                    </label>
                  </div>
                </div>
                <div className='flex justify-end gap-2'>
                  <button
                    onClick={() => {
                      setIsAddingCoupon(false);
                      setEditingCoupon(null);
                    }}
                    className='px-4 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      isAddingCoupon ? handleAddCoupon : handleUpdateCoupon
                    }
                    className='px-4 cursor-pointer py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
                  >
                    {isAddingCoupon ? 'Add Coupon' : 'Update Coupon'}
                  </button>
                </div>
              </div>
            )}

            {/* Coupons Table */}
            <div className='bg-white rounded-lg shadow-md overflow-hidden'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Code
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Active Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Claim Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {coupons.length > 0 ? (
                    coupons.map((coupon) => (
                      <tr key={coupon.id}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {coupon.code}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <button
                            onClick={() => toggleCouponActive(coupon._id)}
                            className={`inline-flex cursor-pointer items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              coupon.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {coupon.isActive ? (
                              <>
                                <ToggleRight size={16} className='mr-1' />
                                Active
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={16} className='mr-1' />
                                Inactive
                              </>
                            )}
                          </button>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              coupon.isClame
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {coupon.isClame ? (
                              <>
                                <ToggleRight size={16} className='mr-1' />
                                Claimed
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={16} className='mr-1' />
                                Unclaimed
                              </>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <div className='flex space-x-2'>
                            <button
                              onClick={() => setEditingCoupon(coupon)}
                              className='text-blue-600 hover:text-blue-900'
                            >
                              <Edit size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className='px-6 py-4 text-center text-sm text-gray-500'
                      >
                        No coupons found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Claim History Tab */}
        {activeTab === 'history' && (
          <div className='bg-white rounded-lg shadow-md overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Coupon Code
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    User IP
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Claimed Date
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {history.length > 0 &&
                  history.map((user) =>
                    user.coupons.map((coupon) => (
                      <tr key={coupon._id}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {coupon.code}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-900'>
                            {user._id}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-900'>
                            {coupon.isClame
                              ? new Date(coupon.claimTime).toLocaleString()
                              : 'Not Claimed'}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
