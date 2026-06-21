import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/store';
import Logo from '../components/Logo';
import Mascot from '../components/Mascot';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, mode === 'signup' ? name : undefined);
    navigate('/');
  };

  return (
    <div className="relative grid min-h-[calc(100vh-4rem)] place-items-center overflow-hidden px-4 py-12">
      {/* bg blobs */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-teal-300/40 blur-3xl" />

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="w-full max-w-md rounded-[32px] bg-white/90 p-8 shadow-float backdrop-blur sm:p-10"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Mascot pose="confiance" size={84} className="mb-1" />
          <Logo size={58} />
          <h1 className="mt-5 text-2xl font-extrabold text-ink">
            {mode === 'login' ? 'Content de te revoir !' : 'Rejoins la communauté'}
          </h1>
          <p className="text-violet-700/60">
            {mode === 'login' ? 'Connecte-toi pour retrouver tes favoris.' : 'Crée ton compte en quelques secondes.'}
          </p>
        </div>

        {/* tabs */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-violet-100 p-1 font-bold">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full py-2.5 transition-colors ${mode === m ? 'bg-white text-violet-600 shadow' : 'text-violet-400'}`}
            >
              {m === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <InputRow icon={<User size={18} />}>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ton prénom" className="login-inp" />
            </InputRow>
          )}
          <InputRow icon={<Mail size={18} />}>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Adresse email" className="login-inp" />
          </InputRow>
          <InputRow icon={<Lock size={18} />}>
            <input required type={show ? 'text' : 'password'} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Mot de passe" className="login-inp" />
            <button type="button" onClick={() => setShow((s) => !s)} className="text-violet-300 hover:text-violet-500">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </InputRow>

          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setResetSent(true)}
                className="text-sm font-semibold text-violet-400 hover:text-violet-600"
              >
                Mot de passe oublié ?
              </button>
              {resetSent && (
                <p className="mt-1 animate-pop rounded-xl bg-teal-50 px-3 py-2 text-left text-xs font-semibold text-teal-600">
                  📬 Si un compte existe pour {email || 'ton adresse'}, un lien de
                  réinitialisation vient d'être envoyé (simulation).
                </p>
              )}
            </div>
          )}

          <button className="w-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400 py-3.5 font-extrabold uppercase tracking-wide text-white shadow-card transition-transform hover:scale-[1.02] active:scale-95">
            {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-sm text-violet-300">
          <span className="h-px flex-1 bg-violet-100" /> ou <span className="h-px flex-1 bg-violet-100" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {['Google', 'Apple'].map((p) => (
            <button
              key={p}
              onClick={() => { login(`demo@${p.toLowerCase()}.com`, p === 'Google' ? 'Alex' : 'Sam'); navigate('/'); }}
              className="rounded-full border border-violet-200 bg-white py-3 font-bold text-violet-600 transition-colors hover:bg-violet-50"
            >
              {p}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-violet-300">
          Démo — l'authentification est simulée et stockée localement.
        </p>
      </motion.div>

      <style>{`.login-inp{width:100%;background:transparent;outline:none;font-weight:500}.login-inp::placeholder{color:#c4b6e0}`}</style>
    </div>
  );
}

function InputRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border-[1.5px] border-violet-100 bg-violet-50/60 px-4 py-3.5 transition-colors focus-within:border-violet-400 focus-within:bg-white">
      <span className="text-violet-400">{icon}</span>
      {children}
    </div>
  );
}
