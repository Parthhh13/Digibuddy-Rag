// Stub file - authentication has been removed
// This file exists to prevent build errors from cached references

export const useAuth = () => {
  return {
    user: null,
    session: null,
    loading: false,
    signOut: async () => {},
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

