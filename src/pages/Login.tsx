import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const errs: typeof errors = {};
        if (!email.trim()) errs.email = "L'email est requis.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email invalide.";
        if (!password) errs.password = 'Le mot de passe est requis.';
        else if (password.length < 4) errs.password = 'Minimum 4 caractères.';
        return errs;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        const result = login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setErrors({ general: result.error });
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Connexion</h1>
                    <p>Accédez à votre compte HD-MOVIES</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {errors.general && <div className="form-error-banner">{errors.general}</div>}

                    <div className="form-group">
                        <label htmlFor="login-email">
                            <FiMail /> Email
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                            placeholder="votre@email.com"
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">
                            <FiLock /> Mot de passe
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                            placeholder="••••••••"
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    <button type="submit" className="auth-submit-btn" id="login-submit">
                        <FiLogIn /> Se connecter
                    </button>
                </form>

                <p className="auth-switch">
                    Pas encore de compte ? <Link to="/register">Créer un compte</Link>
                </p>
            </div>
        </div>
    );
}
