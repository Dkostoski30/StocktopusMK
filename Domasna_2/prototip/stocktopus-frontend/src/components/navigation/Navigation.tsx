import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';
import {logout} from "../../service/userService.ts";

interface SidebarItem {
    icon: string;
    label: string;
    path: string;
    isActive: boolean;
}

interface SidebarProps {
    items: SidebarItem[];
}

const Navigation: React.FC<SidebarProps> = ({ items }) => {
    const navigate = useNavigate();


    const handleNavigation = (path: string, label: string) => {
        if (label === 'Sign out') {
            logout();
            navigate('/login');
        } else {
            navigate(path);
        }
    };

    return (
        <nav className={styles.sidebar}>
            <div className={styles.navItems}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={item.isActive ? styles.navItemActive : styles.navItem}
                        onClick={() => handleNavigation(item.path, item.label)}
                    >
                        <img
                            src={item.icon}
                            alt=""
                            className={styles.navIcon}
                        />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default Navigation;