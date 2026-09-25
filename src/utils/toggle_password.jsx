import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// PasswordField Wrapper
export default function PasswordField({ children }) {
    
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = (e) => {
        // e.currentTarget always aims at the element where the onClick attribute is defined as oppose to -
        // e.target which gets the sub-element the cursor clicked on
        const wrapper_div = e.currentTarget.parentNode;
        const password_input = wrapper_div.querySelector('.adm-password-input');

        setShowPassword(!showPassword);

        if (showPassword) {
            password_input.type = "password"
        } else {
            password_input.type = "text"
        }
    }
    
    return (
        <div className='adm-password-wrapper'>
            {children}
            <button className="adm-password-suffix" type='button' onClick={handleTogglePassword}>
            {showPassword ? <Eye /> : <EyeOff />}
            </button>
        </div>
    );

}