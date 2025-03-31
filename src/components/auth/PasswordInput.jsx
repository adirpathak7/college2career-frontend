import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ value, onChange, error, label, name, ref }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePassword = () => {
        setPasswordVisible(prevState => !prevState);
    };

    return (
        <div className="mb-4 relative">
            <label className="block mb-1">
                {label} <span className="text-red-600">*</span>
            </label>
            <input
                value={value}
                onChange={onChange}
                type={passwordVisible ? 'text' : 'password'}
                name={name}
                ref={ref}
                className="w-full p-2 border border-gray-700 bg-gray-800 rounded focus:outline-none focus:border-white"
            />
            {value && (
                <span
                    onClick={togglePassword}
                    className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer text-white"
                >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
            )}
            {error && <span className="text-red-600">{error}</span>}
        </div>
    );
};

export default PasswordInput;
