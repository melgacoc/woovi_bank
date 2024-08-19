import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../services/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [createUser, {loading}] = useMutation(CREATE_USER);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createUser({ variables: { name, email, password, cpf } })
        .then(response => {
            if(response.data.createUser) {
            console.log('User created');
            }
        })
        .catch(err => {
            console.error(err);
        });
    };
    
    return (
        <div className="flex items-center justify-center h-screen">
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
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
            <Input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            />
            <Button type="submit" variant="secondary" size="lg">
            {loading ? 'Loading...' : 'Register'}
            </Button>
        </form>
        </div>
    );
};