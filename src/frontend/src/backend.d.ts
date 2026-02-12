import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Vector3 {
    x: number;
    y: number;
    z: number;
}
export interface FarmSettings {
    yieldRate: number;
    activityDuration: bigint;
    growthRate: number;
}
export interface GameConfig {
    sceneConfig: string;
    gravity: Vector3;
    ambientLight: Vector3;
    farmSettings: FarmSettings;
}
export interface UserProfile {
    farmName?: string;
    name: string;
}
export interface PersistentFarmData {
    cropYield: bigint;
    lastUpdateTimestamp?: bigint;
    cropType: string;
    growthRate: number;
    farmId: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFarm(farmId: string): Promise<PersistentFarmData>;
    getFarms(filterCropType: string | null): Promise<Array<PersistentFarmData>>;
    getGameConfig(): Promise<GameConfig>;
    getPersistentFarmData(typeFilter: string | null): Promise<Array<PersistentFarmData>>;
    getPersistentFarmDataV2(typeFilter: string | null): Promise<Array<PersistentFarmData>>;
    getPersistentGameDataV2(farmId: string): Promise<PersistentFarmData | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeBackend(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    savePersistentFarmData(farmId: string, cropType: string, cropYield: bigint, growthRate: number): Promise<void>;
    updateFarmData(farmId: string, cropType: string, cropYield: bigint, growthRate: number): Promise<void>;
    updateGameConfig(newConfig: GameConfig): Promise<void>;
}
