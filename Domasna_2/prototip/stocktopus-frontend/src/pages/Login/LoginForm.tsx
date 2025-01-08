import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { InputField } from '../../components/InputField/InputField.tsx';
import { AuthLayout } from '../../components/AuthLayout/AuthLayout.tsx';
import { useNavigate } from "react-router-dom";
import { Footer } from "../../components/footer/Footer.tsx";
import { login } from '../../service/userService.ts';
import { UserLoginDTO } from '../../model/dto/UserLoginDTO.ts';

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userLoginDTO: UserLoginDTO = {
            email: email,
            password: password
        };
        try {
            await login(userLoginDTO);
            handleNavigation("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <AuthLayout title="Login to your Account">
            <form onSubmit={handleSubmit} className={styles.form}>
                <InputField
                    label="Username"
                    value={email}
                    onChange={setEmail}
                    type="text"
                    required
                    placeholder="Enter your username"
                />
                <InputField
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    type="password"
                    required
                    placeholder="Enter your password"
                />
                <div className={styles.formOptions}>
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
            <Footer />
        </AuthLayout>
    );
};