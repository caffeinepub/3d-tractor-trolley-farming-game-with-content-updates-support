import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Tractor, Sprout, Heart } from 'lucide-react';
import AdminConfigPanel from '../../admin/AdminConfigPanel';
import { useQueryClient } from '@tanstack/react-query';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const { login, clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    await saveProfile.mutateAsync({
      name: name.trim(),
      farmName: farmName.trim() || undefined,
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[oklch(0.85_0.08_120)] via-[oklch(0.75_0.12_110)] to-[oklch(0.65_0.15_100)]">
      {/* Logo and Title */}
      <div className="flex flex-col items-center gap-6 mb-12">
        <div className="relative">
          <img
            src="/assets/generated/logo-badge.dim_512x512.png"
            alt="Farm Logo"
            className="w-32 h-32 rounded-full shadow-2xl border-4 border-white/30"
          />
          <div className="absolute -bottom-2 -right-2 bg-[oklch(0.95_0.15_110)] rounded-full p-3 shadow-lg">
            <Tractor className="w-8 h-8 text-[oklch(0.45_0.15_100)]" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">
            खेती ट्रैक्टर
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium">3D Farming Adventure</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md px-6">
        {/* Welcome Message */}
        {isAuthenticated && userProfile && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 w-full text-center border border-white/30">
            <p className="text-white text-lg">
              स्वागत है, <span className="font-bold">{userProfile.name}</span>!
            </p>
            {userProfile.farmName && (
              <p className="text-white/80 text-sm mt-1">🌾 {userProfile.farmName}</p>
            )}
          </div>
        )}

        {/* Play Button */}
        <Button
          onClick={onStart}
          size="lg"
          className="w-full h-16 text-2xl font-bold bg-[oklch(0.55_0.20_110)] hover:bg-[oklch(0.50_0.22_110)] text-white shadow-2xl rounded-2xl transition-all transform hover:scale-105"
        >
          <Sprout className="w-8 h-8 mr-3" />
          खेल शुरू करें
        </Button>

        {/* Auth Button */}
        <Button
          onClick={handleAuth}
          variant="outline"
          size="lg"
          className="w-full h-14 text-lg font-semibold bg-white/90 hover:bg-white text-[oklch(0.45_0.15_100)] border-2 border-white/50 rounded-xl"
        >
          {isAuthenticated ? 'लॉगआउट' : 'लॉगिन करें'}
        </Button>

        {/* Admin Panel Toggle */}
        {isAuthenticated && (
          <Button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Admin Settings
          </Button>
        )}
      </div>

      {/* Admin Panel */}
      {showAdminPanel && <AdminConfigPanel onClose={() => setShowAdminPanel(false)} />}

      {/* Profile Setup Dialog */}
      <Dialog open={showProfileSetup} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>अपना प्रोफाइल बनाएं</DialogTitle>
            <DialogDescription>कृपया अपना नाम और खेत का नाम दर्ज करें</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">आपका नाम *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="अपना नाम दर्ज करें"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmName">खेत का नाम (वैकल्पिक)</Label>
              <Input
                id="farmName"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="जैसे: हरित खेत"
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={!name.trim() || saveProfile.isPending}
              className="w-full"
            >
              {saveProfile.isPending ? 'सहेजा जा रहा है...' : 'प्रोफाइल सहेजें'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-white/60 text-sm">
        <p>
          Built with <Heart className="inline w-4 h-4 text-red-400" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            caffeine.ai
          </a>
        </p>
        <p className="mt-1">© {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
