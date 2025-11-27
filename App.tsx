import React, { useState, useEffect, useCallback } from 'react';
import { Droplets, Settings, Trash2, Bell, BellOff } from 'lucide-react';
import { ProgressCircle } from './components/ProgressCircle';
import { Controls } from './components/Controls';
import { AICoach } from './components/AICoach';
import { HistoryChart } from './components/HistoryChart';
import { WaterLog, DailyStats, UserSettings } from './types';

function App() {
  // State
  const [intake, setIntake] = useState<number>(0);
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    dailyGoal: 2500,
    reminderInterval: 60,
    notificationsEnabled: false,
  });

  // Load data from local storage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('hidralife-settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedLogs = localStorage.getItem('hidralife-logs');
    const today = new Date().toISOString().split('T')[0];

    if (savedLogs) {
      const parsedLogs: WaterLog[] = JSON.parse(savedLogs);
      // Filter logs for today to set current intake
      const todayLogs = parsedLogs.filter(log => {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        return logDate === today;
      });
      
      setLogs(parsedLogs);
      setIntake(todayLogs.reduce((acc, curr) => acc + curr.amount, 0));
    }

    const savedStats = localStorage.getItem('hidralife-stats');
    if (savedStats) setDailyStats(JSON.parse(savedStats));
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('hidralife-settings', JSON.stringify(settings));
    localStorage.setItem('hidralife-logs', JSON.stringify(logs));
    localStorage.setItem('hidralife-stats', JSON.stringify(dailyStats));
  }, [settings, logs, dailyStats]);

  // Request notification permission
  const toggleNotifications = async () => {
    if (!settings.notificationsEnabled) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setSettings(prev => ({ ...prev, notificationsEnabled: true }));
          new Notification("HidraLife", { body: "Notificações ativadas! Vamos beber água! 💧" });
        }
      } else {
        alert("Seu navegador não suporta notificações.");
      }
    } else {
      setSettings(prev => ({ ...prev, notificationsEnabled: false }));
    }
  };

  // Reminder Logic
  useEffect(() => {
    if (!settings.notificationsEnabled) return;

    const checkInterval = setInterval(() => {
      const lastLog = logs[logs.length - 1];
      const now = Date.now();
      const intervalMs = settings.reminderInterval * 60 * 1000;

      if (!lastLog || (now - lastLog.timestamp > intervalMs)) {
         // Check if we haven't already notified recently (simple debounce logic could be added here, 
         // but for this scope, let's just show it if user is active on tab or dependent on browser handling)
         if (document.visibilityState === 'hidden') {
            new Notification("Hora de beber água!", { 
                body: "Já faz um tempo desde seu último gole. Mantenha-se hidratado! 💧",
                icon: "https://cdn-icons-png.flaticon.com/512/3105/3105807.png" // Generic water icon url
            });
         }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [settings.notificationsEnabled, settings.reminderInterval, logs]);


  // Add water handler
  const addWater = useCallback((amount: number) => {
    const newLog: WaterLog = {
      id: crypto.randomUUID(),
      amount,
      timestamp: Date.now(),
    };

    setLogs(prev => [...prev, newLog]);
    setIntake(prev => {
        const newIntake = prev + amount;
        
        // Update stats for today
        const today = new Date().toISOString().split('T')[0];
        setDailyStats(prevStats => {
            const existingStatIndex = prevStats.findIndex(s => s.date === today);
            if (existingStatIndex >= 0) {
                const updatedStats = [...prevStats];
                updatedStats[existingStatIndex].total = newIntake;
                updatedStats[existingStatIndex].goal = settings.dailyGoal;
                return updatedStats;
            } else {
                return [...prevStats, { date: today, total: newIntake, goal: settings.dailyGoal }];
            }
        });
        
        return newIntake;
    });
  }, [settings.dailyGoal]);

  // Undo last entry for today
  const undoLastLog = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogIndex = logs.length - 1;
    
    if (lastLogIndex >= 0) {
        const lastLog = logs[lastLogIndex];
        const logDate = new Date(lastLog.timestamp).toISOString().split('T')[0];

        if (logDate === today) {
            const newLogs = logs.slice(0, -1);
            setLogs(newLogs);
            setIntake(prev => Math.max(0, prev - lastLog.amount));
            
            // Update stats
             setDailyStats(prevStats => {
                const newTotal = Math.max(0, intake - lastLog.amount);
                const existingStatIndex = prevStats.findIndex(s => s.date === today);
                if (existingStatIndex >= 0) {
                    const updatedStats = [...prevStats];
                    updatedStats[existingStatIndex].total = newTotal;
                    return updatedStats;
                }
                return prevStats;
            });
        }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50/50 pb-8 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-blue-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-lg text-white">
                <Droplets size={20} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              HidraLife
            </h1>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-blue-50 rounded-full transition-colors text-blue-600"
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      {/* Settings Modal (Inline for simplicity) */}
      {showSettings && (
        <div className="max-w-md mx-auto px-4 py-4 m-4 bg-white rounded-2xl shadow-lg border border-blue-100 animate-in fade-in slide-in-from-top-4">
            <h2 className="font-bold text-lg mb-4 text-slate-700">Configurações</h2>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1">Meta Diária (ml)</label>
                <input 
                    type="range" 
                    min="1000" 
                    max="5000" 
                    step="100" 
                    value={settings.dailyGoal}
                    onChange={(e) => setSettings({...settings, dailyGoal: parseInt(e.target.value)})}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="text-right text-blue-600 font-bold mt-1">{settings.dailyGoal} ml</div>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-blue-50 mt-2">
                <span className="text-slate-600 font-medium flex items-center gap-2">
                   {settings.notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                   Lembretes
                </span>
                <button 
                    onClick={toggleNotifications}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        settings.notificationsEnabled 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    {settings.notificationsEnabled ? 'Ativado' : 'Desativado'}
                </button>
            </div>
            {settings.notificationsEnabled && (
                 <div className="mt-2 text-xs text-slate-500">
                    Enviaremos um lembrete se você não registrar água por {settings.reminderInterval} minutos.
                 </div>
            )}
        </div>
      )}

      {/* Main Content */}
      <main className="pt-4">
        <ProgressCircle current={intake} goal={settings.dailyGoal} />
        
        <div className="text-center mb-8 px-4 flex justify-center items-center gap-3">
             {intake > 0 && (
                <button 
                    onClick={undoLastLog}
                    className="flex items-center gap-1 text-sm text-red-400 hover:text-red-500 transition-colors px-3 py-1 rounded-full hover:bg-red-50"
                >
                    <Trash2 size={14} /> Desfazer
                </button>
             )}
        </div>

        <Controls onAdd={addWater} />
        
        <AICoach current={intake} goal={settings.dailyGoal} />
        
        <HistoryChart data={dailyStats} />
      </main>
    </div>
  );
}

export default App;