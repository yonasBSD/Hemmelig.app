import { IconAt, IconEye, IconEyeOff, IconLock, IconLogin, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { signUp } from '../../api/authentication';
import ErrorBox from '../../components/error-box';
import SuccessBox from '../../components/success-box';
import useAuthStore from '../../stores/authStore';
import useSettingsStore from '../../stores/settingsStore';

const SignUp = () => {
    const { t } = useTranslation();
    const { setLogin } = useAuthStore();
    const { settings } = useSettingsStore();

    // Show error message if signup is disabled
    if (settings.disable_user_account_creation || settings.disable_users) {
        return (
            <div className="min-h-screen flex items-start justify-center pt-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
                <div className="max-w-md w-full space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-white">{t('signup.title')}</h1>
                    </div>
                    <ErrorBox message="Bummer! User sign-up is currently disabled by the administrator." />
                </div>
            </div>
        );
    }

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [formErrors, setFormErrors] = useState({});

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear errors when user types
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = await signUp(formData.email, formData.username, formData.password);

        if ([400, 403].indexOf(data.statusCode) > -1) {
            setError(data.message);
            setSuccess(false);
            return;
        }

        if (data.type && data.message) {
            setFormErrors({
                username: data.type === 'username' ? data.message : '',
                password: data.type === 'password' ? data.message : '',
                email: data.type === 'email' ? data.message : '',
            });
            setSuccess(false);
            return;
        }

        setLogin(data.username);
        setFormErrors({});
        setSuccess(true);
    };

    return (
        <div className="min-h-screen flex items-start justify-center pt-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
            <div className="max-w-md w-full space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-white">{t('signup.title')}</h1>
                    <p className="text-sm text-gray-400">{t('signup.heading')}</p>
                </div>

                {/* Error Messages */}
                {error && <ErrorBox message={error} />}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <IconAt size={18} />
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder={t('signup.email')}
                                required
                                className={`w-full pl-10 pr-3 py-2 bg-gray-800 border rounded-md 
                                         text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-600 
                                         focus:border-transparent transition-colors
                                         ${formErrors.email ? 'border-red-500' : 'border-gray-700'}`}
                            />
                        </div>
                        {formErrors.email && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                        )}
                    </div>

                    {/* Username Input */}
                    <div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <IconUser size={18} />
                            </span>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder={t('signup.username')}
                                required
                                className={`w-full pl-10 pr-3 py-2 bg-gray-800 border rounded-md 
                                         text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-600 
                                         focus:border-transparent transition-colors
                                         ${formErrors.username ? 'border-red-500' : 'border-gray-700'}`}
                            />
                        </div>
                        {formErrors.username && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <IconLock size={18} />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder={t('signup.password')}
                                required
                                className={`w-full pl-10 pr-10 py-2 bg-gray-800 border rounded-md 
                                         text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-600 
                                         focus:border-transparent transition-colors
                                         ${formErrors.password ? 'border-red-500' : 'border-gray-700'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 
                                         hover:text-gray-300 focus:outline-none"
                            >
                                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                            </button>
                        </div>
                        {formErrors.password && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 px-4 py-2 
                                 bg-gray-600 text-white rounded-md hover:bg-gray-500 
                                 focus:outline-none focus:ring-2 focus:ring-gray-500 
                                 focus:ring-offset-2 focus:ring-offset-gray-800 
                                 transition-colors mt-6"
                    >
                        <IconLogin size={18} />
                        {t('signup.signup')}
                    </button>
                </form>

                {/* Success Message & Redirect */}
                {success && (
                    <>
                        <SuccessBox message={t('signup.redirecting')} />
                        <Navigate replace to="/account" />
                    </>
                )}
            </div>
        </div>
    );
};

export default SignUp;
