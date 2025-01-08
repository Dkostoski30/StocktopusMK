import React from 'react';
import styles from '../../pages/Login/LoginForm.module.css';
import logo from '../../assets/logo.png';
interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <main className={styles.authContainer}>
            <div className={styles.contentWrapper}>
                <section className={styles.imageSection}>
                    <img
                        src={logo}
                        alt="Auth illustration"
                        className={styles.authImage}
                    />
                </section>

                <section className={styles.formSection}>
                    <div className={styles.formWrapper}>
                        <h1 className={styles.formTitle}>{title}</h1>
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
};
