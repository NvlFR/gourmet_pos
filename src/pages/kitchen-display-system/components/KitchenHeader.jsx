import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KitchenHeader = ({ 
  totalOrders, 
  activeOrders, 
  onRefresh, 
  onEmergencyContact,
  soundEnabled,
  onSoundToggle 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-card border-b-2 border-border shadow-elevation-1 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Branding */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
            <Icon name="ChefHat" size={24} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Kitchen Display</h1>
            <p className="text-sm text-muted-foreground">Sistem Tampilan Dapur</p>
          </div>
        </div>

        {/* Center Section - Time and Date */}
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground font-mono">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Right Section - Stats and Controls */}
        <div className="flex items-center space-x-6">
          {/* Order Statistics */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {activeOrders}
              </div>
              <div className="text-xs text-muted-foreground">
                Pesanan Aktif
              </div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {totalOrders}
              </div>
              <div className="text-xs text-muted-foreground">
                Total Hari Ini
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            {/* Sound Toggle */}
            <Button
              variant={soundEnabled ? 'default' : 'outline'}
              size="icon"
              onClick={onSoundToggle}
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              <Icon name={soundEnabled ? 'Volume2' : 'VolumeX'} size={20} />
            </Button>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              loading={isRefreshing}
              title="Refresh Pesanan"
            >
              <Icon name="RefreshCw" size={20} />
            </Button>

            {/* Emergency Contact */}
            <Button
              variant="destructive"
              onClick={onEmergencyContact}
              iconName="Phone"
              iconPosition="left"
            >
              Darurat
            </Button>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Sistem Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">POS Terhubung</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-sm text-muted-foreground">Printer Siap</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Terakhir diperbarui: {currentTime.toLocaleTimeString('id-ID')}
        </div>
      </div>
    </header>
  );
};

export default KitchenHeader;