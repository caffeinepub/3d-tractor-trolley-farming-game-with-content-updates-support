import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function useAdminStatus() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  return {
    isAdmin: !!isAdmin,
    isLoading,
    isAuthenticated: !!identity,
  };
}
