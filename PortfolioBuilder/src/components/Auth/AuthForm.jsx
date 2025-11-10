import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '../../services/auth.service';
import { validateEmail, validatePassword } from '../../utils/validators';
import '../../styles/auth.css';

const AuthForm = () => {
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setAuthError('');

    // Validate form
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    const newErrors = {};
    if (!emailValidation.valid) newErrors.email = emailValidation.error;
    if (!passwordValidation.valid) newErrors.password = passwordValidation.error;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    let result;
    if (authMode === 'signin') {
      result = await signInWithEmail(email, password);
    } else {
      result = await signUpWithEmail(email, password);
    }

    setLoading(false);

    if (result.error) {
      setAuthError(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setLoading(true);

    const result = await signInWithGoogle();

    setLoading(false);

    if (result.error) {
      setAuthError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Portfolio Builder</h1>
        <p className="auth-subtitle">Create your stunning portfolio in minutes</p>

        {authError && <div className="error-message">{authError}</div>}

        <div className="auth-tabs">
          <button
            className={authMode === 'signin' ? 'active' : ''}
            onClick={() => setAuthMode('signin')}
            disabled={loading}
          >
            Sign In
          </button>
          <button
            className={authMode === 'signup' ? 'active' : ''}
            onClick={() => setAuthMode('signup')}
            disabled={loading}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Loading...' : authMode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="divider">OR</div>

        <button onClick={handleGoogleSignIn} className="btn-google" disabled={loading}>
          <Globe size={20} />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default AuthForm;