import { useState, useEffect } from 'react';
import { Save, Trash2, History, Crosshair, Shield, Swords, Target, Ghost, Skull, Zap, Plus, X } from 'lucide-react';

interface TradeItem {
  cost: string;
  sale: string;
}

interface TradeLog {
  id: string;
  date: string;
  inputs: {
    steamBalance: string;
    csfloatBalance: string;
    stage1Items: TradeItem[];
    stage2Items: TradeItem[];
  };
  results: {
    updatedCsfloatBalance: number;
    updatedSteamBalance: number;
    totalBalance: number;
    netProfit: number;
    profitMargin: number;
  };
}

const bgIcons = [
  // Subtle (Oldukları yerde ufak gezinme)
  { Icon: Crosshair, size: 140, top: '5%', left: '10%', anim: 'animate-float-subtle-1', delay: '0s', opacity: 'opacity-5' },
  { Icon: Shield, size: 90, top: '40%', left: '5%', anim: 'animate-float-subtle-2', delay: '1s', opacity: 'opacity-[0.04]' },
  { Icon: Target, size: 160, top: '15%', left: '75%', anim: 'animate-float-subtle-3', delay: '3s', opacity: 'opacity-[0.03]' },
  { Icon: Skull, size: 130, top: '50%', left: '80%', anim: 'animate-float-subtle-1', delay: '4s', opacity: 'opacity-5' },
  { Icon: Zap, size: 80, top: '25%', left: '40%', anim: 'animate-float-subtle-2', delay: '6s', opacity: 'opacity-[0.02]' },
  { Icon: Crosshair, size: 60, top: '85%', left: '45%', anim: 'animate-float-subtle-3', delay: '0s', opacity: 'opacity-[0.05]' },
  { Icon: Swords, size: 150, top: '35%', left: '30%', anim: 'animate-float-subtle-1', delay: '7s', opacity: 'opacity-[0.03]' },
  { Icon: Shield, size: 200, top: '65%', left: '55%', anim: 'animate-float-subtle-2', delay: '2s', opacity: 'opacity-[0.02]' },
  { Icon: Target, size: 70, top: '10%', left: '50%', anim: 'animate-float-subtle-3', delay: '4s', opacity: 'opacity-[0.04]' },
  { Icon: Skull, size: 95, top: '90%', left: '70%', anim: 'animate-float-subtle-1', delay: '1s', opacity: 'opacity-5' },
  
  // Radical (Radikal, uzun mesafe gezinme)
  { Icon: Ghost, size: 110, top: '80%', left: '15%', anim: 'animate-float-radical-1', delay: '5s', opacity: 'opacity-[0.04]' },
  { Icon: Swords, size: 220, top: '70%', left: '85%', anim: 'animate-float-radical-2', delay: '2s', opacity: 'opacity-[0.03]' },
];

const BackgroundAnimation = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {bgIcons.map((item, i) => (
      <div 
        key={i} 
        className={`absolute text-gray-500 ${item.opacity} ${item.anim}`}
        style={{ top: item.top, left: item.left, animationDelay: item.delay }}
      >
        <item.Icon size={item.size} strokeWidth={1} />
      </div>
    ))}
  </div>
);

const InputField = ({ label, value, setter, delayClass = '' }: { label: string, value: string, setter: (val: string) => void, delayClass?: string }) => (
  <div className={`flex flex-col space-y-1.5 mb-4 ${delayClass}`}>
    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide truncate" title={label}>{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
        <span className="text-gray-500 font-medium transition-colors group-focus-within:text-blue-500">$</span>
      </div>
      <input
        type="text"
        inputMode="decimal"
        className="bg-[#121212] border border-[#2e2e2e] text-gray-200 text-sm rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 p-2.5 outline-none transition-all placeholder-gray-700 hover:border-gray-600"
        placeholder="0.00"
        value={value}
        onChange={(e) => {
          let val = e.target.value;
          val = val.replace(/[^0-9.]/g, '');
          
          const parts = val.split('.');
          if (parts.length > 2) {
            val = parts[0] + '.' + parts.slice(1).join('');
          }

          if (val.length > 1 && val.startsWith('0') && val[1] !== '.') {
            val = val.replace(/^0+/, '');
            if (val === '') val = '0';
          }

          setter(val);
        }}
      />
    </div>
  </div>
);

export default function App() {
  const [steamBalance, setSteamBalance] = useState<string>('');
  const [csfloatBalance, setCsfloatBalance] = useState<string>('');
  
  const [stage1Items, setStage1Items] = useState<TradeItem[]>([{ cost: '', sale: '' }]);
  const [stage2Items, setStage2Items] = useState<TradeItem[]>([{ cost: '', sale: '' }]);

  const [logs, setLogs] = useState<TradeLog[]>([]);

  // Load from local storage
  useEffect(() => {
    const savedInputs = localStorage.getItem('tradeCalcInputsV4');
    if (savedInputs) {
      try {
        const parsed = JSON.parse(savedInputs);
        setSteamBalance(parsed.steamBalance || '');
        setCsfloatBalance(parsed.csfloatBalance || '');
        if (parsed.stage1Items) setStage1Items(parsed.stage1Items);
        if (parsed.stage2Items) setStage2Items(parsed.stage2Items);
      } catch (e) {
        console.error("Failed to parse saved inputs");
      }
    }

    const savedLogs = localStorage.getItem('tradeCalcLogsV4');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse saved logs");
      }
    }
  }, []);

  // Save inputs to local storage on change
  useEffect(() => {
    const inputs = {
      steamBalance,
      csfloatBalance,
      stage1Items,
      stage2Items
    };
    localStorage.setItem('tradeCalcInputsV4', JSON.stringify(inputs));
  }, [steamBalance, csfloatBalance, stage1Items, stage2Items]);

  const getNum = (str: string) => {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  const sBalance = getNum(steamBalance);
  const csBalance = getNum(csfloatBalance);
  
  const steamCost = stage1Items.reduce((acc, item) => acc + getNum(item.cost), 0);
  const csSale = stage1Items.reduce((acc, item) => acc + getNum(item.sale), 0);
  
  const csCost = stage2Items.reduce((acc, item) => acc + getNum(item.cost), 0);
  const steamSale = stage2Items.reduce((acc, item) => acc + getNum(item.sale), 0);

  const csfloatSaleNet = csSale * 0.98;
  const steamSaleNet = steamSale * 0.87;
  
  const updatedSteamBalance = sBalance - steamCost + steamSaleNet;
  const updatedCsfloatBalance = csBalance + csfloatSaleNet - csCost;
  const totalBalance = updatedSteamBalance + updatedCsfloatBalance;
  
  const netProfit = (csfloatSaleNet - csCost) + steamSaleNet - steamCost;
  const profitMargin = steamCost > 0 ? (netProfit / steamCost) * 100 : 0;

  const saveLog = () => {
    const newLog: TradeLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      inputs: {
        steamBalance,
        csfloatBalance,
        stage1Items: JSON.parse(JSON.stringify(stage1Items)),
        stage2Items: JSON.parse(JSON.stringify(stage2Items))
      },
      results: {
        updatedCsfloatBalance,
        updatedSteamBalance,
        totalBalance,
        netProfit,
        profitMargin
      }
    };
    const newLogs = [newLog, ...logs];
    setLogs(newLogs);
    localStorage.setItem('tradeCalcLogsV4', JSON.stringify(newLogs));
  };

  const clearLogs = () => {
    if (window.confirm('Tüm geçmişi silmek istediğinize emin misiniz?')) {
      setLogs([]);
      localStorage.removeItem('tradeCalcLogsV4');
    }
  };

  const deleteLog = (id: string) => {
    const newLogs = logs.filter(log => log.id !== id);
    setLogs(newLogs);
    localStorage.setItem('tradeCalcLogsV4', JSON.stringify(newLogs));
  };

  const addStage1Item = () => setStage1Items([...stage1Items, { cost: '', sale: '' }]);
  const removeStage1Item = (index: number) => setStage1Items(stage1Items.filter((_, i) => i !== index));
  const updateStage1Item = (index: number, field: 'cost' | 'sale', val: string) => {
    const newItems = [...stage1Items];
    newItems[index][field] = val;
    setStage1Items(newItems);
  };

  const addStage2Item = () => setStage2Items([...stage2Items, { cost: '', sale: '' }]);
  const removeStage2Item = (index: number) => setStage2Items(stage2Items.filter((_, i) => i !== index));
  const updateStage2Item = (index: number, field: 'cost' | 'sale', val: string) => {
    const newItems = [...stage2Items];
    newItems[index][field] = val;
    setStage2Items(newItems);
  };

  const totalProfit = logs.reduce((sum, log) => sum + log.results.netProfit, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 p-4 md:p-8 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      <BackgroundAnimation />
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        <header className="mb-8 border-b border-[#222] pb-4 flex justify-between items-end animate-fade-in">
          <div>
            <h1 className="text-xl font-bold text-gray-100 tracking-tight">CS Trade Hesaplayıcı</h1>
            <p className="text-xs text-gray-500 mt-1">Steam & CSFloat ROI Analizi</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form - Slides in from Left */}
          <div className="lg:col-span-7 xl:col-span-8 animate-slide-in-left">
            <div className="bg-[#161616]/85 backdrop-blur-md border border-[#222] rounded-md p-6 shadow-2xl transition-all duration-300 hover:border-[#333]">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-4">
                <InputField label="Mevcut Steam Bakiyesi" value={steamBalance} setter={setSteamBalance} />
                <InputField label="Mevcut CSFloat Bakiyesi" value={csfloatBalance} setter={setCsfloatBalance} />
              </div>
              
              {/* Stage 1 */}
              <div className="mt-8 mb-4">
                <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-4">
                  <div className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">1. Aşama (Steam'den Al {'->'} CSFloat'ta Sat)</div>
                  <button 
                    onClick={addStage1Item}
                    className="text-gray-400 hover:text-blue-400 p-1 hover:bg-blue-500/10 rounded transition-colors"
                    title="Yeni Skin Ekle"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {stage1Items.map((item, index) => (
                    <div key={`s1-${index}`} className="relative bg-[#121212]/30 p-3 rounded border border-[#222] animate-fade-in">
                      {stage1Items.length > 1 && (
                        <button 
                          onClick={() => removeStage1Item(index)}
                          className="absolute -right-2 -top-2 bg-[#1a1a1a] border border-[#333] text-gray-500 hover:text-red-400 hover:border-red-400/50 rounded-full p-1 z-10 transition-colors"
                          title="Bu skini sil"
                        >
                          <X size={12} />
                        </button>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <InputField 
                          label={stage1Items.length > 1 ? `Steam Maliyeti #${index + 1}` : "Steam Maliyeti"} 
                          value={item.cost} 
                          setter={(val) => updateStage1Item(index, 'cost', val)} 
                        />
                        <InputField 
                          label={stage1Items.length > 1 ? `CSFloat Satış Fiyatı #${index + 1}` : "CSFloat Satış Fiyatı"} 
                          value={item.sale} 
                          setter={(val) => updateStage1Item(index, 'sale', val)} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Stage 2 */}
              <div className="mt-8 mb-4">
                <div className="flex justify-between items-center border-b border-[#222] pb-2 mb-4">
                  <div className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">2. Aşama (CSFloat'tan Al {'->'} Steam'de Sat)</div>
                  <button 
                    onClick={addStage2Item}
                    className="text-gray-400 hover:text-blue-400 p-1 hover:bg-blue-500/10 rounded transition-colors"
                    title="Yeni Skin Ekle"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {stage2Items.map((item, index) => (
                    <div key={`s2-${index}`} className="relative bg-[#121212]/30 p-3 rounded border border-[#222] animate-fade-in">
                      {stage2Items.length > 1 && (
                        <button 
                          onClick={() => removeStage2Item(index)}
                          className="absolute -right-2 -top-2 bg-[#1a1a1a] border border-[#333] text-gray-500 hover:text-red-400 hover:border-red-400/50 rounded-full p-1 z-10 transition-colors"
                          title="Bu skini sil"
                        >
                          <X size={12} />
                        </button>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <InputField 
                          label={stage2Items.length > 1 ? `CSFloat Maliyeti #${index + 1}` : "CSFloat Maliyeti"} 
                          value={item.cost} 
                          setter={(val) => updateStage2Item(index, 'cost', val)} 
                        />
                        <InputField 
                          label={stage2Items.length > 1 ? `Steam Satış Fiyatı #${index + 1}` : "Steam Satış Fiyatı"} 
                          value={item.sale} 
                          setter={(val) => updateStage2Item(index, 'sale', val)} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#222]">
                <button
                  onClick={saveLog}
                  className="bg-[#242424] hover:bg-[#2e2e2e] active:scale-95 border border-[#333] text-gray-200 text-sm font-medium py-2 px-6 rounded transition-all flex items-center gap-2 group"
                >
                  <Save className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  İşlemi Kaydet
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            
            {/* Summary - Slides in from Right */}
            <div className="bg-[#161616]/85 backdrop-blur-md border border-[#222] rounded-md p-5 animate-slide-in-right shadow-2xl transition-all duration-300 hover:border-[#333]" style={{ animationDelay: '150ms' }}>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5">Özet</h2>
              
              <div className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <div className="text-[11px] text-gray-500 mb-1 group-hover:text-gray-400 transition-colors">Yeni Steam Bky.</div>
                    <div className="text-lg font-medium text-gray-100 transition-all duration-300">
                      ${updatedSteamBalance.toFixed(2)}
                    </div>
                  </div>
                  <div className="group">
                    <div className="text-[11px] text-gray-500 mb-1 group-hover:text-gray-400 transition-colors">Yeni CSFloat Bky.</div>
                    <div className="text-lg font-medium text-gray-100 transition-all duration-300">
                      ${updatedCsfloatBalance.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#222] group">
                  <div className="text-xs text-gray-500 mb-1 group-hover:text-gray-400 transition-colors">Toplam Bakiye</div>
                  <div className="text-xl font-bold text-gray-100 transition-all duration-300">
                    ${totalBalance.toFixed(2)}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#222] group">
                  <div className="text-xs text-gray-500 mb-1 group-hover:text-gray-400 transition-colors">Net Kâr / Zarar</div>
                  <div className={`text-2xl font-bold transition-all duration-300 ${netProfit > 0 ? 'text-[#4caf50]' : netProfit < 0 ? 'text-[#f44336]' : 'text-gray-100'}`}>
                    {netProfit > 0 ? '+' : ''}{netProfit.toFixed(2)} USD
                  </div>
                </div>

                <div className="group">
                  <div className="text-xs text-gray-500 mb-1 group-hover:text-gray-400 transition-colors">ROI (Kâr Oranı)</div>
                  <div className={`text-lg font-semibold transition-all duration-300 ${profitMargin > 0 ? 'text-[#4caf50]' : profitMargin < 0 ? 'text-[#f44336]' : 'text-gray-100'}`}>
                    {profitMargin > 0 ? '+' : ''}{profitMargin.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Logs - Slides in from Bottom */}
            <div className="bg-[#161616]/85 backdrop-blur-md border border-[#222] rounded-md flex flex-col flex-grow max-h-[500px] animate-slide-in-up shadow-2xl transition-all duration-300 hover:border-[#333]" style={{ animationDelay: '300ms' }}>
              <div className="p-4 border-b border-[#222] flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <History className="h-4 w-4" /> Geçmiş
                </h2>
                {logs.length > 0 && (
                  <button onClick={clearLogs} className="text-xs text-[#f44336] hover:underline transition-all">
                    Temizle
                  </button>
                )}
              </div>
              
              <div className="p-4 bg-[#121212]/50 border-b border-[#222]">
                <div className="text-xs text-gray-500">Toplam Kâr</div>
                <div className={`text-lg font-bold transition-all duration-300 ${totalProfit > 0 ? 'text-[#4caf50]' : totalProfit < 0 ? 'text-[#f44336]' : 'text-gray-300'}`}>
                  ${totalProfit > 0 ? '+' : ''}{totalProfit.toFixed(2)}
                </div>
              </div>

              <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar flex-grow">
                {logs.length === 0 ? (
                  <div className="text-xs text-gray-600 text-center py-4">Henüz kayıt yok.</div>
                ) : (
                  logs.map((log, i) => (
                    <div key={log.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded p-3 relative group animate-fade-in" style={{ animationDelay: `${(i * 50)}ms` }}>
                      <button 
                        onClick={() => deleteLog(log.id)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-[#f44336] opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <div className="text-[10px] text-gray-500 mb-2">{log.date}</div>
                      
                      <div className="text-[10px] text-gray-500 mb-2 opacity-70">
                        {log.inputs.stage1Items.length}x Aşama 1 | {log.inputs.stage2Items.length}x Aşama 2
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <div className={`text-sm font-bold ${log.results.netProfit > 0 ? 'text-[#4caf50]' : log.results.netProfit < 0 ? 'text-[#f44336]' : 'text-gray-300'}`}>
                            ${log.results.netProfit > 0 ? '+' : ''}{log.results.netProfit.toFixed(2)}
                          </div>
                        </div>
                        <div className={`text-xs font-semibold ${log.results.profitMargin > 0 ? 'text-[#4caf50]' : log.results.profitMargin < 0 ? 'text-[#f44336]' : 'text-gray-300'}`}>
                          {log.results.profitMargin > 0 ? '+' : ''}{log.results.profitMargin.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
