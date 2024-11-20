import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/Index.scss';
import { AuthProvider } from './components/Authenticate/AuthContext';
import { ReferenceProvider } from './components/API/ReferenceContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <ReferenceProvider>
          <App />
      </ReferenceProvider>
    </AuthProvider>
  </BrowserRouter>
);
