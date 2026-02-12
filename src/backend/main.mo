import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile System
  public type UserProfile = {
    name : Text;
    farmName : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Game Config
  public type Vector3 = {
    x : Float;
    y : Float;
    z : Float;
  };

  public type FarmSettings = {
    activityDuration : Nat;
    growthRate : Float;
    yieldRate : Float;
  };

  public type GameConfig = {
    farmSettings : FarmSettings;
    sceneConfig : Text;
    gravity : Vector3;
    ambientLight : Vector3;
  };

  // Default Game Config
  var currentConfig : GameConfig = {
    farmSettings = {
      activityDuration = 10;
      growthRate = 1.0;
      yieldRate = 0.3;
    };
    sceneConfig = "Farmhouse.2_2_4.5.45";
    gravity = { x = 0.0; y = -981.0; z = 0.0 };
    ambientLight = { x = 0.6; y = 0.6; z = 0.7 };
  };

  public type PersistentFarmData = {
    farmId : Text;
    cropType : Text;
    cropYield : Nat;
    growthRate : Float;
    lastUpdateTimestamp : ?Int;
  };

  module PersistentFarmData {
    public func compareByType(a : PersistentFarmData, b : PersistentFarmData) : Order.Order {
      switch (Text.compare(a.cropType, b.cropType)) {
        case (#equal) { Nat.compare(a.cropYield, b.cropYield) };
        case (order) { order };
      };
    };
  };

  let persistentFarmData = Map.empty<Text, PersistentFarmData>();

  // Admin Functions
  public shared ({ caller }) func updateGameConfig(newConfig : GameConfig) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update config");
    };
    currentConfig := newConfig;
  };

  // Public Query - No auth needed, anyone can view game config
  public query ({ caller }) func getGameConfig() : async GameConfig {
    currentConfig;
  };

  // Public Query - No auth needed, anyone can view farm data
  public query ({ caller }) func getPersistentFarmData(typeFilter : ?Text) : async [PersistentFarmData] {
    let filtered = switch (typeFilter) {
      case (?filter) {
        persistentFarmData.values().filter(
          func(farm) {
            farm.cropType == filter;
          }
        );
      };
      case (null) { persistentFarmData.values() };
    };
    filtered.toArray().sort(PersistentFarmData.compareByType);
  };

  // Internal Helper Functions
  func internalUpdateFarmData(farmId : Text, cropType : Text, cropYield : Nat, growthRate : Float) {
    let newFarmData : PersistentFarmData = {
      farmId;
      cropType;
      cropYield;
      growthRate;
      lastUpdateTimestamp = null;
    };
    persistentFarmData.add(farmId, newFarmData);
  };

  // Public Query - No auth needed, anyone can view farms
  public query ({ caller }) func getFarms(filterCropType : ?Text) : async [PersistentFarmData] {
    let filtered = switch (filterCropType) {
      case (?filter) {
        persistentFarmData.values().filter(
          func(farm) {
            farm.cropType == filter;
          }
        );
      };
      case (null) { persistentFarmData.values() };
    };
    filtered.toArray();
  };

  // Public Query - No auth needed, anyone can view a specific farm
  public query ({ caller }) func getFarm(farmId : Text) : async PersistentFarmData {
    switch (persistentFarmData.get(farmId)) {
      case (null) { Runtime.trap("Farm not found") };
      case (?farm) { farm };
    };
  };

  // Admin-only function to update farm data
  public shared ({ caller }) func updateFarmData(farmId : Text, cropType : Text, cropYield : Nat, growthRate : Float) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update farm data");
    };
    internalUpdateFarmData(farmId, cropType, cropYield, growthRate);
  };

  // Persistent Data
  let persistentGameData = Map.empty<Text, PersistentFarmData>();

  // User function - requires user permission to save farm data
  public shared ({ caller }) func savePersistentFarmData(farmId : Text, cropType : Text, cropYield : Nat, growthRate : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save farm data");
    };
    let newFarmData : PersistentFarmData = {
      farmId;
      cropType;
      cropYield;
      growthRate;
      lastUpdateTimestamp = null;
    };
    persistentGameData.add(farmId, newFarmData);
  };

  // Public Query - No auth needed, anyone can view persistent farm data
  public query ({ caller }) func getPersistentFarmDataV2(typeFilter : ?Text) : async [PersistentFarmData] {
    let filtered = switch (typeFilter) {
      case (?filter) {
        persistentGameData.values().filter(
          func(farm) {
            farm.cropType == filter;
          }
        );
      };
      case (null) { persistentGameData.values() };
    };
    filtered.toArray().sort(PersistentFarmData.compareByType);
  };

  // Public Query - No auth needed, anyone can view persistent game data
  public query ({ caller }) func getPersistentGameDataV2(farmId : Text) : async ?PersistentFarmData {
    persistentGameData.get(farmId);
  };

  // Admin-only function to initialize/migrate backend data
  public shared ({ caller }) func initializeBackend() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can initialize backend");
    };
    let persistentFarmsIter = persistentFarmData.entries();
    persistentFarmsIter.forEach(
      func(entry) {
        persistentGameData.add(entry.0, entry.1);
      }
    );
  };
};
