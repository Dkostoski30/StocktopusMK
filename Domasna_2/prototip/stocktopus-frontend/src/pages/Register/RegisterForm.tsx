import React, { useState } from 'react';
import styles from './Auth.module.css';
import { InputField } from './InputField';
import { AuthLayout } from './AuthLayout';

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

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} className={styles.registerForm}>
                <h1 className={styles.formTitle}>Register to your Account</h1>

                <div className={styles.formFields}>
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
                        placeholder="*****************"
                        onChange={handleInputChange('password')}
                    />

                    <InputField
                        label="Repeat Password"
                        value={formData.repeatPassword}
                        type="password"
                        placeholder="*****************"
                        onChange={handleInputChange('repeatPassword')}
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    Register
                </button>

                <footer className={styles.formFooter}>
                    <p className={styles.loginPrompt}>
                        Already have an account?
                        <button className={styles.loginLink} type="button">
                            Login
                        </button>
                    </p>
                </footer>
            </form>
        </AuthLayout>
    );
};