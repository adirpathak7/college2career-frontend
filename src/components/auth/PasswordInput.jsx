import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ value, onChange, error, label, name, ref }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePassword = () => {
        setPasswordVisible(prev => !prev);
    };

    return (
        <div className="mb-4 relative">
            <label className="block text-sm font-medium text-blue-700 mb-1">
                {label} <span className="text-red-600">*</span>
            </label>
            <input
                value={value}
                onChange={onChange}
                type={passwordVisible ? 'text' : 'password'}
                name={name}
                ref={ref}
                className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
            />
            {value && (
                <span
                    onClick={togglePassword}
                    className="absolute right-3 mt-[5.5%] transform -translate-y-1/2 cursor-pointer text-blue-600"
                >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
            )}
            {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>
    );
};

export default PasswordInput;
