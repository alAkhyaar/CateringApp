import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Income from './pages/finance/Income';
import Expense from './pages/finance/Expense';
import FinanceRecap from './pages/finance/FinanceRecap';
import OrdersIn from './pages/orders/OrdersIn';
import OrdersOut from './pages/orders/OrdersOut';
import OrdersRecap from './pages/orders/OrdersRecap';
import Menus from './pages/menu/Menus';
import Ingredients from './pages/menu/Ingredients';
import IngredientsRecap from './pages/menu/IngredientsRecap';
import Employees from './pages/hr/Employees';
import Activities from './pages/Activities';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f8fafc',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f8fafc',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            
            {/* User Management - Super Admin Only */}
            <Route path="users" element={<Users />} />
            
            {/* Finance */}
            <Route path="finance/income" element={<Income />} />
            <Route path="finance/expense" element={<Expense />} />
            <Route path="finance/recap" element={<FinanceRecap />} />
            
            {/* Orders */}
            <Route path="orders/in" element={<OrdersIn />} />
            <Route path="orders/out" element={<OrdersOut />} />
            <Route path="orders/recap" element={<OrdersRecap />} />
            
            {/* Menu & Ingredients */}
            <Route path="menu/list" element={<Menus />} />
            <Route path="menu/ingredients" element={<Ingredients />} />
            <Route path="menu/recap" element={<IngredientsRecap />} />
            
            {/* HR */}
            <Route path="hr/employees" element={<Employees />} />
            
            {/* Activity Logs */}
            <Route path="activities" element={<Activities />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

