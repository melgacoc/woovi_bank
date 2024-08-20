import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../services/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, {loading}] = useMutation(LOGIN);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ variables: { email, password } })
      .then(response => {
        if(response.data.login) {
          console.log('Logged in');
          localStorage.setItem('authToken', JSON.stringify({
            token: response.data.login.token,
            id: response.data.login.id,
            email: response.data.login.email,
            name: response.data.login.name,
            accountId: response.data.login.accountId
          }));
          window.location.href = '/dashboard';
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleRedirect = () => {
    window.location.href = '/register';
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" size="lg" className="bg-[#113463] hover:text-[#0f2f52] mr-2">
          {loading ? 'Loading...' : 'Login'}
        </Button>
        <Button type="button" size="lg" onClick={handleRedirect} className="bg-[#113463] hover:text-[#0f2f52]">
            Create an account
        </Button>
      </form>
    </div>
  );
}