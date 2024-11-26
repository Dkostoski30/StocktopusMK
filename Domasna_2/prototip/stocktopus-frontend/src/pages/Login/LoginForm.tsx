import React, { useState } from 'react';
import styles from './Auth.module.css';
import { InputField } from './InputField';
import { Checkbox } from './Checkbox';

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <main className={styles.loginContainer}>
            <div className={styles.contentWrapper}>
                <section className={styles.imageSection}>
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/90e2588cc8a9a8475569b9da00e3e855719018574ae089479f884e07c035450e?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"
                        alt="Login illustration"
                        className={styles.loginImage}
                    />
                </section>

                <section className={styles.formSection}>
                    <div className={styles.formWrapper}>
                        <h1 className={styles.formTitle}>Login to your Account</h1>

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
                                <Checkbox
                                    label="Remember Me"
                                    checked={rememberMe}
                                    onChange={setRememberMe}
                                    iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/90e2588cc8a9a8475569b9da00e3e855719018574ae089479f884e07c035450e?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078"
                                />
                                <button
                                    type="button"
                                    className={styles.forgotPassword}
                                    onClick={() => {}}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <button type="submit" className={styles.loginButton}>
                                Login
                            </button>
                        </form>

                        <div className={styles.registerPrompt}>
                            <p className={styles.registerText}>Not Registered Yet?</p>
                            <button
                                type="button"
                                className={styles.registerLink}
                                onClick={() => {}}
                            >
                                Create an account
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};