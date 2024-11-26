import React from 'react';
import styles from './Auth.module.css';
import { CheckboxProps } from './types';

export const Checkbox: React.FC<CheckboxProps> = ({
                                                      label,
                                                      checked,
                                                      onChange,
                                                      iconSrc
                                                  }) => {
    return (
        <label className={styles.checkbox}>
            <img
                src={iconSrc}
                alt=""
                className={styles.checkboxIcon}
                loading="lazy"
            />
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