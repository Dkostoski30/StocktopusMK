import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';

// TODO integrate the logo
// import logo from '../../assets/logo.png';

interface SidebarItem {
    icon: string;
    label: string;
    path: string;
    isActive: boolean;
}

interface SidebarProps {
    items: SidebarItem[];
}

const Navigation: React.FC<SidebarProps> = ({ items}) => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <nav className={styles.sidebar}>


            <div className={styles.navItems}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={item.isActive ? styles.navItemActive : styles.navItem}
                        onClick={() => handleNavigation(item.path)}
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
