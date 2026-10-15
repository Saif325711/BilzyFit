import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="page-container flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">Page not found</h2>
      <p className="mt-2 text-sm text-gray-500">The page you are looking for does not exist.</p>
      <Button onClick={() => navigate('/')} className="mt-6">
        Go to Dashboard
      </Button>
    </div>
  );
}
