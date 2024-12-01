import React from 'react';
import styles from '../pages/Login/LoginForm.module.css';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    iconSrc?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
                                                      label,
                                                      checked,
                                                      onChange,
                                                      iconSrc,
                                                  }) => {
    return (
        <label className={styles.checkbox}>
            {iconSrc && (
                <img
                    src={iconSrc}
                    alt="checkbox icon"
                    className={styles.checkboxIcon}
                    loading="lazy"
                />
            )}
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className={styles.visuallyHidden}
            />
            <span className={styles.checkboxLabel}>{label}</span>
        </label>
    );
};
