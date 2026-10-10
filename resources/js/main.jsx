import { createRoot } from 'react-dom/client'
import MainRouter from './app';
import AuthProvider from './context/authContext';

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <MainRouter />
    </AuthProvider>
);
