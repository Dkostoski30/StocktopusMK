import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import { InputField } from '../../components/InputField';
import { AuthLayout } from '../../components/AuthLayout';
import {useNavigate} from "react-router-dom";

export const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        repeatPassword: ''
    });

    const handleInputChange = (field: string) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <AuthLayout title="Register to your Account">
            <form onSubmit={handleSubmit} className={styles.form}>
                <InputField
                    label="Email"
                    value={formData.email}
                    type="email"
                    placeholder="mail@abc.com"
                    onChange={handleInputChange('email')}
                />
                <InputField
                    label="Username"
                    value={formData.username}
                    placeholder="Username"
                    onChange={handleInputChange('username')}
                />
                <InputField
                    label="Password"
                    value={formData.password}
                    type="password"
                    placeholder="Enter your password"
                    onChange={handleInputChange('password')}
                />
                <InputField
                    label="Repeat Password"
                    value={formData.repeatPassword}
                    type="password"
                    placeholder="Repeat your password"
                    onChange={handleInputChange('repeatPassword')}
                />
                <button type="submit" onClick={() => handleNavigation("/")} className={styles.submitButton}>
                    Register
                </button>
            </form>
            <div className={styles.loginPrompt}>
                <p className={styles.promptText}>Already have an account?</p>
                <button type="button" className={styles.loginLink} onClick={() => handleNavigation("/login")}>
                    Login
                </button>
            </div>
        </AuthLayout>
    );
};
