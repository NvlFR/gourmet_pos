import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const POSHeader = ({ cashierName, onOpenDrawer, onPrintLastReceipt, onViewReports }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [shiftStartTime] = useState(new Date(Date.now() - 4 * 60 * 60 * 1000)); // 4 hours ago

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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

  const getShiftDuration = () => {
    const diff = currentTime - shiftStartTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m`;
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Business Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon name="ChefHat" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Gourmet POS</h1>
              <p className="text-sm text-muted-foreground">Point of Sale System</p>
            </div>
          </div>
        </div>

        {/* Center Section - Date & Time */}
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground font-mono">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Right Section - Cashier Info & Actions */}
        <div className="flex items-center space-x-4">
          {/* Cashier Info */}
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{cashierName}</p>
                <p className="text-xs text-muted-foreground">Kasir Aktif</p>
              </div>
            </div>
          </div>

          {/* Shift Timer */}
          <div className="bg-success/10 text-success px-3 py-2 rounded-lg text-center">
            <div className="text-sm font-medium">Shift: {getShiftDuration()}</div>
            <div className="text-xs opacity-80">Mulai: {formatTime(shiftStartTime)}</div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenDrawer}
              title="Buka Laci Kasir"
            >
              <Icon name="DollarSign" size={18} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={onPrintLastReceipt}
              title="Cetak Ulang Struk Terakhir"
            >
              <Icon name="Printer" size={18} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={onViewReports}
              title="Lihat Laporan"
            >
              <Icon name="BarChart3" size={18} />
            </Button>

            {/* System Status */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-success/10 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-success font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default POSHeader;