import React, { useState } from 'react';
import styles from './RegisterForm.module.css';
import { InputField } from '../../components/InputField/InputField.tsx';
import { AuthLayout } from '../../components/AuthLayout/AuthLayout.tsx';
import { useNavigate } from "react-router-dom";
import { Footer } from "../../components/footer/Footer.tsx";
import { register } from '../../service/userService.ts';
import { UserDTO } from '../../model/dto/UserDTO.ts';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userDTO: UserDTO = {
            email: formData.email,
            username: formData.username,
            password: formData.password,
            repeatedPassword: formData.repeatPassword
        };
        try {
            await register(userDTO);
            handleNavigation("/login");
        } catch (error) {
            console.error("Registration failed:", error);
        }
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
                    required
                />
                <InputField
                    label="Password"
                    value={formData.password}
                    type="password"
                    placeholder="Enter your password"
                    onChange={handleInputChange('password')}
                    required
                />
                <InputField
                    label="Repeat Password"
                    value={formData.repeatPassword}
                    type="password"
                    placeholder="Repeat your password"
                    required
                    onChange={handleInputChange('repeatPassword')}
                />
                <button type="submit" className={styles.submitButton}>
                    Register
                </button>
            </form>
            <div className={styles.loginPrompt}>
                <p className={styles.promptText}>Already have an account?</p>
                <button type="button" className={styles.loginLink} onClick={() => handleNavigation("/login")}>
                    Login
                </button>
            </div>
            <Footer />
        </AuthLayout>
    );
};