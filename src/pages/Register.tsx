import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { register } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!username.trim()) errs.username = "Le nom d'utilisateur est requis.";
        else if (username.length < 3) errs.username = 'Minimum 3 caractères.';
        if (!email.trim()) errs.email = "L'email est requis.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email invalide.';
        if (!password) errs.password = 'Le mot de passe est requis.';
        else if (password.length < 4) errs.password = 'Minimum 4 caractères.';
        if (password !== confirmPassword) errs.confirmPassword = 'Les mots de passe ne correspondent pas.';
        return errs;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        const result = register(username, email, password);
        if (result.success) {
            navigate('/');
        } else {
            setErrors({ general: result.error || 'Erreur lors de l\'inscription.' });
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Créer un compte</h1>
                    <p>Rejoignez HD-MOVIES dès maintenant</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {errors.general && <div className="form-error-banner">{errors.general}</div>}

                    <div className="form-group">
                        <label htmlFor="register-username">
                            <FiUser /> Nom d'utilisateur
                        </label>
                        <input
                            id="register-username"
                            type="text"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setErrors((p) => { const n = { ...p }; delete n.username; return n; }); }}
                            placeholder="MonPseudo"
                            className={errors.username ? 'input-error' : ''}
                        />
                        {errors.username && <span className="field-error">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-email">
                            <FiMail /> Email
                        </label>
                        <input
                            id="register-email"
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors((p) => { const n = { ...p }; delete n.email; return n; }); }}
                            placeholder="votre@email.com"
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-password">
                            <FiLock /> Mot de passe
                        </label>
                        <input
                            id="register-password"
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors((p) => { const n = { ...p }; delete n.password; return n; }); }}
                            placeholder="••••••••"
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-confirm">
                            <FiLock /> Confirmer le mot de passe
                        </label>
                        <input
                            id="register-confirm"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => { const n = { ...p }; delete n.confirmPassword; return n; }); }}
                            placeholder="••••••••"
                            className={errors.confirmPassword ? 'input-error' : ''}
                        />
                        {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                    </div>

                    <button type="submit" className="auth-submit-btn" id="register-submit">
                        <FiUserPlus /> S'inscrire
                    </button>
                </form>

                <p className="auth-switch">
                    Déjà un compte ? <Link to="/login">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}
