import React from 'react';
import styles from './UserProfile.module.css';
import { getRolesFromToken, getUsernameFromToken } from '../../config/jwtToken.ts';

export const UserProfile: React.FC = () => {
    const username = getUsernameFromToken();
    const role = getRolesFromToken()[0];
    const roleClass = role === 'ROLE_ADMIN' ? styles.admin : styles.user;

    return (
        <div className={styles.userProfile}>
            <div className={styles.userInfo}>
                <div className={styles.userName}>Hello, {username}</div>
                <span className={`${styles.userRole} ${roleClass}`}>
                    Role: {role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                </span>
            </div>
        </div>
    );
};
