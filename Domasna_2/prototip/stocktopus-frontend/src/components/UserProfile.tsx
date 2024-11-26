import React from 'react';
import styles from './Dashboard.module.css';
import { UserProfileProps } from './types';

export const UserProfile: React.FC<UserProfileProps> = ({ name, role, imageUrl }) => {
    return (
        <div className={styles.userProfile}>
            <img src={imageUrl} alt={`${name}'s profile`} className={styles.userAvatar} />
            <div className={styles.userInfo}>
                <div className={styles.userName}>
                    <span>{name}</span>
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d27ac42881b882eb353b5386ea4f80da68b89911b380287fcd8e2e556923143e?placeholderIfAbsent=true&apiKey=daff80472fc549e0971c12890da5e078" alt="" className={styles.userDropdown} />
                </div>
                <span className={styles.userRole}>{role}</span>
            </div>
        </div>
    );
};