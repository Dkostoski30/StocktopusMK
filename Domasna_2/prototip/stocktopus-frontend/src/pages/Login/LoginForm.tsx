import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { InputField } from '../../components/InputField';
// import { Checkbox } from '../../components/Checkbox';
import { AuthLayout } from '../../components/AuthLayout';
import {useNavigate} from "react-router-dom";

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <AuthLayout title="Login to your Account">
            <form onSubmit={handleSubmit} className={styles.form}>
                <InputField
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    type="email"
                    placeholder="mail@abc.com"
                />
                <InputField
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    type="password"
                    placeholder="Enter your password"
                />
                <div className={styles.formOptions}>
                    <button type="button" className={styles.forgotPassword}>
                        Forgot Password?
                    </button>
                </div>
                <button type="submit" className={styles.loginButton}>
                    Login
                </button>
            </form>
            <div className={styles.registerPrompt}>
                <p className={styles.registerText}>Not Registered Yet?</p>
                <button type="button" className={styles.registerLink} onClick={() => handleNavigation("/register")}>
                    Create an account
                </button>
            </div>
        </AuthLayout>
    );
};
