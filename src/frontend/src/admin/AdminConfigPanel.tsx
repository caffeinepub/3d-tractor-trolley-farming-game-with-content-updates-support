import { useState, useEffect } from 'react';
import { useAdminStatus } from './useAdminStatus';
import { useGameConfig } from '../game/config/useGameConfig';
import { useUpdateGameConfig } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { X, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { GameConfig } from '../backend';

interface AdminConfigPanelProps {
  onClose: () => void;
}

export default function AdminConfigPanel({ onClose }: AdminConfigPanelProps) {
  const { isAdmin, isLoading: adminLoading } = useAdminStatus();
  const { data: currentConfig, refetch } = useGameConfig();
  const updateConfig = useUpdateGameConfig();

  const [activityDuration, setActivityDuration] = useState('60');
  const [growthRate, setGrowthRate] = useState('1.0');
  const [yieldRate, setYieldRate] = useState('0.3');
  const [ambientX, setAmbientX] = useState('0.6');
  const [ambientY, setAmbientY] = useState('0.6');
  const [ambientZ, setAmbientZ] = useState('0.7');

  useEffect(() => {
    if (currentConfig) {
      setActivityDuration(currentConfig.farmSettings.activityDuration.toString());
      setGrowthRate(currentConfig.farmSettings.growthRate.toString());
      setYieldRate(currentConfig.farmSettings.yieldRate.toString());
      setAmbientX(currentConfig.ambientLight.x.toString());
      setAmbientY(currentConfig.ambientLight.y.toString());
      setAmbientZ(currentConfig.ambientLight.z.toString());
    }
  }, [currentConfig]);

  const handleSave = async () => {
    if (!isAdmin) {
      toast.error('Unauthorized: Admin access required');
      return;
    }

    const newConfig: GameConfig = {
      farmSettings: {
        activityDuration: BigInt(parseInt(activityDuration) || 60),
        growthRate: parseFloat(growthRate) || 1.0,
        yieldRate: parseFloat(yieldRate) || 0.3,
      },
      sceneConfig: currentConfig?.sceneConfig || 'Default',
      gravity: currentConfig?.gravity || { x: 0, y: -9.81, z: 0 },
      ambientLight: {
        x: parseFloat(ambientX) || 0.6,
        y: parseFloat(ambientY) || 0.6,
        z: parseFloat(ambientZ) || 0.7,
      },
    };

    try {
      await updateConfig.mutateAsync(newConfig);
      toast.success('Configuration updated successfully!');
    } catch (error) {
      toast.error('Failed to update configuration');
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    await refetch();
    toast.success('Configuration refreshed!');
  };

  if (adminLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <p>Loading admin panel...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You do not have admin permissions to access this panel.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Admin Configuration Panel</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Farm Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Farm Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activityDuration">Activity Duration (seconds)</Label>
                <Input
                  id="activityDuration"
                  type="number"
                  value={activityDuration}
                  onChange={(e) => setActivityDuration(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="growthRate">Growth Rate</Label>
                <Input
                  id="growthRate"
                  type="number"
                  step="0.1"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yieldRate">Yield Rate</Label>
                <Input
                  id="yieldRate"
                  type="number"
                  step="0.1"
                  value={yieldRate}
                  onChange={(e) => setYieldRate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Ambient Light */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ambient Light (RGB)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ambientX">Red (X)</Label>
                <Input
                  id="ambientX"
                  type="number"
                  step="0.1"
                  value={ambientX}
                  onChange={(e) => setAmbientX(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ambientY">Green (Y)</Label>
                <Input
                  id="ambientY"
                  type="number"
                  step="0.1"
                  value={ambientY}
                  onChange={(e) => setAmbientY(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ambientZ">Blue (Z)</Label>
                <Input
                  id="ambientZ"
                  type="number"
                  step="0.1"
                  value={ambientZ}
                  onChange={(e) => setAmbientZ(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button onClick={handleSave} disabled={updateConfig.isPending} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            {updateConfig.isPending ? 'Saving...' : 'Save Configuration'}
          </Button>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
