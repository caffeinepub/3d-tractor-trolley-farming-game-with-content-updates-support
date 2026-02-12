import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GameConfig, UserProfile, PersistentFarmData } from '../backend';

export function useGetGameConfig() {
  const { actor, isFetching } = useActor();

  return useQuery<GameConfig>({
    queryKey: ['gameConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getGameConfig();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateGameConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newConfig: GameConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGameConfig(newConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameConfig'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePersistentFarmData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      farmId: string;
      cropType: string;
      cropYield: bigint;
      growthRate: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.savePersistentFarmData(
        data.farmId,
        data.cropType,
        data.cropYield,
        data.growthRate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persistentFarmData'] });
    },
  });
}

export function useGetPersistentFarmData(typeFilter?: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PersistentFarmData[]>({
    queryKey: ['persistentFarmData', typeFilter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPersistentFarmDataV2(typeFilter ?? null);
    },
    enabled: !!actor && !isFetching,
  });
}
