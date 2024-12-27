import React from 'react';
import styles from '../pages/Index/Dashboard.module.css';
import {getRolesFromToken, getUsernameFromToken} from "../config/jwtToken.ts";

export const UserProfile: React.FC = () => {
    return (
        <div className={styles.userProfile}>
            <div className={styles.userInfo}>
                <div className={styles.userName}>
                    <span>{getUsernameFromToken()}</span>
                </div>
                <span className={styles.userRole}>{getRolesFromToken()[0]}</span>
            </div>
        </div>
    );
};