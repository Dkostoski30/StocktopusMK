import React from 'react';
import styles from '../pages/Login/LoginForm.module.css';
import { InputFieldProps } from './types';

export const InputField: React.FC<InputFieldProps> = ({
                                                          label,
                                                          value,
                                                          type = "text",
                                                          onChange,
                                                          placeholder
                                                      }) => {
    const inputId = `${label.toLowerCase()}-input`;

    return (
        <div className={styles.inputContainer}>
            <label htmlFor={inputId} className={styles.inputLabel}>
                {label}
            </label>
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={styles.inputField}
                aria-label={label}
            />
        </div>
    );
};