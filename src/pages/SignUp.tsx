import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/sign-in');
  }, [navigate]);

  return null;
};

export default SignUp;
