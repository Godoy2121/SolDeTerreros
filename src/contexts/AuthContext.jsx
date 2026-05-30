import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithPopup, GoogleAuthProvider,
  signOut, setPersistence, browserSessionPersistence,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // Sesión de solo navegador: se cierra al cerrar el navegador/pestaña
    setPersistence(auth, browserSessionPersistence).catch(() => {});
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  const loginWithGoogle = () =>
    setPersistence(auth, browserSessionPersistence)
      .then(() => signInWithPopup(auth, googleProvider));

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading: user === undefined }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
