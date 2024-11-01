import { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';

export function useAuth() {
    return useContext(AuthContext);
  }
