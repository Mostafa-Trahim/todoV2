import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Authentication.css';
import { UseUser } from '../context/UseUser';

export const AuthenticationMode = Object.freeze({
    Login: 'Login',
    Register: 'Register'
});


export default function Authentication({authenticationMode}) {

    const { user, setUser, signUp, signIn } = UseUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (authenticationMode === AuthenticationMode.Register) {
                await signUp();
                navigate('/signin');
            } else {
                await signIn();
                navigate('/'); // Redirect only if signIn is successful
            }
        } catch(error) {
            console.error("Error details:", error); // Log full error for debugging
        const message = error.response && error.response.data && error.response.data.message 
                        ? error.response.data.message 
                        : error.message || "An error occurred";
        alert(message);
        }
    };
    

  return (
    <div>
        <h3>{ authenticationMode === AuthenticationMode.Login ? 'Sign In' : 'Sign Up'}</h3>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email</label>
                <input 
                type="email" 
                name="email"
                value={user.email}
                onChange={e => setUser({...user, email: e.target.value})}
                 />
            </div>
            <div>
                <label>Password</label>
                <input 
                type="password" 
                name="password" 
                value={user.password}
                onChange={e => setUser({...user, password: e.target.value})}
                />
            </div>
            <div>
                <button>{authenticationMode === AuthenticationMode.Login ? 'Login' : 'Submit'}</button>
            </div>
            <div>
                <Link to={authenticationMode === AuthenticationMode.Login ? '../signup' : '../signin'}>
                    {authenticationMode === AuthenticationMode.Login ? 'No account? Sign Up' : 'Already Signed Up? Sign In'}
                </Link>
            </div>
        </form>

    </div>
  )
}
