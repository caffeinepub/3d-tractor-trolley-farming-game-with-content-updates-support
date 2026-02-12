import { useGetGameConfig } from '../../hooks/useQueries';
import { DEFAULT_CONFIG } from './defaults';

export function useGameConfig() {
  const query = useGetGameConfig();

  return {
    ...query,
    data: query.data || DEFAULT_CONFIG,
  };
}
