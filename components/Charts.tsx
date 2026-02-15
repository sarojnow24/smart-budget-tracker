import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';

interface ChartProps {
  data: any[];
  colors: string[];
  currency: string;
  isDark: boolean;
  customKeys?: string[];
  onClick?: (data: any) => void;
}

interface OverviewChartProps extends ChartProps {
  remaining: number;
  totalIncome: number;
  t: (key: string) => string;
}

const ChartTooltip = ({ active, payload, label, currency, isDark }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-2.5 rounded-xl shadow-2xl border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-900'} animate-in zoom-in duration-200 z-50`}>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{data.name || label}</p>
          <div className="space-y-1">
             {payload.map((entry: any, index: number) => (
                <p key={index} className="text-[11px] font-bold flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                   {entry.name}: <span className="font-mono">{currency} {entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </p>
             ))}
          </div>
        </div>
      );
    }
    return null;
};

// --- REPORTS PIE CHART ---
export const CategoryPieChart: React.FC<ChartProps> = ({ data, colors, currency, isDark, onClick }) => {
  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%" 
            innerRadius="55%" 
            outerRadius="90%" 
            paddingAngle={3} 
            dataKey="value"
            stroke={isDark ? "#1f2937" : "#ffffff"} 
            strokeWidth={3}
            animationBegin={0}
            animationDuration={800}
            label={false}
            onClick={(data) => onClick && onClick(data)}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                style={{ cursor: 'pointer', outline: 'none' }}
              />
            ))}
          </Pie>
          <RechartsTooltip content={<ChartTooltip currency={currency} isDark={isDark} />} />
          <Legend 
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ 
                  fontSize: '9px', 
                  fontWeight: 'bold', 
                  textTransform: 'uppercase',
                  paddingLeft: '10px'
              }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- DASHBOARD BUDGET CHART ---
export const FinancialOverviewChart: React.FC<OverviewChartProps> = ({ data, colors, currency, isDark, remaining, totalIncome, t, onClick }) => {
  const chartData = [...data];
  
  if (remaining > 0) {
    chartData.push({
      name: t('reminding'),
      value: remaining,
      isSpecial: true,
      color: '#32d74b' // Green
    });
  } else if (remaining < 0) {
    chartData.push({
      name: t('extraExpense'),
      value: Math.abs(remaining),
      isSpecial: true,
      color: '#ff3b30' // Red
    });
  }

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%" 
            innerRadius="40%" 
            outerRadius="90%" 
            paddingAngle={2} 
            dataKey="value"
            stroke={isDark ? "#1f2937" : "#ffffff"} 
            strokeWidth={2}
            animationBegin={0}
            animationDuration={800}
            label={false}
            onClick={(data) => onClick && onClick(data)}
            style={{ cursor: 'pointer' }}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isSpecial ? entry.color : colors[index % colors.length]}
                style={{ cursor: 'pointer', outline: 'none' }}
              />
            ))}
          </Pie>
          <RechartsTooltip content={<ChartTooltip currency={currency} isDark={isDark} />} />
          <Legend 
              verticalAlign="bottom" 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ 
                  fontSize: '8px', 
                  fontWeight: '900', 
                  textTransform: 'uppercase',
                  paddingTop: '10px',
                  position: 'relative'
              }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FlowBarChart: React.FC<ChartProps> = ({ data, currency, isDark, onClick }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              onClick={(e) => {
                if (e && e.activePayload && e.activePayload.length > 0) {
                  onClick && onClick(e.activePayload[0].payload);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
                <XAxis 
                    dataKey="date" 
                    tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 'bold'}} 
                    tickFormatter={(val) => {
                        if (!val) return '';
                        const parts = val.split('-');
                        if(parts.length === 3) {
                            const d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
                            return `${d.getDate()}/${d.getMonth()+1}`;
                        }
                        return val;
                    }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                     cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                     contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderColor: 'transparent', borderRadius: '12px' }}
                     itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}
                     content={<ChartTooltip currency={currency} isDark={isDark} />}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}/>
                <Bar dataKey="income" name="Income" fill="#32d74b" radius={[6, 6, 0, 0]} maxBarSize={30} />
                <Bar dataKey="expense" name="Expense" fill="#ff3b30" radius={[6, 6, 0, 0]} maxBarSize={30} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export const TrendLineChart: React.FC<ChartProps> = ({ data, currency, isDark, customKeys, onClick }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 0, left: -10, bottom: 0 }} onClick={(e) => {
                if (e && e.activePayload && e.activePayload.length > 0) {
                  onClick && onClick(e.activePayload[0].payload);
                }
            }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
                <XAxis 
                    dataKey="month" 
                    tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 'bold'}} 
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                     content={<ChartTooltip currency={currency} isDark={isDark} />}
                     cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}/>
                <Line type="monotone" dataKey="income" name="Income" stroke="#32d74b" strokeWidth={3} dot={{r: 4, strokeWidth: 0}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#ff3b30" strokeWidth={3} dot={{r: 4, strokeWidth: 0}} activeDot={{r: 6}} />
            </LineChart>
        </ResponsiveContainer>
    );
};

// --- SPENDING HEATMAP COMPONENT ---
interface SpendingHeatmapProps {
  transactions: any[];
  currency: string;
  isDark: boolean;
  onClick: (date: string) => void;
}

export const SpendingHeatmap: React.FC<SpendingHeatmapProps> = ({ transactions, currency, isDark, onClick }) => {
  // 1. Prepare Data Grid (Last 15 weeks / ~105 days)
  const today = new Date();
  const weeks = 15;
  const days = weeks * 7;
  
  // Generate date map
  const dateMap: Record<string, number> = {};
  let maxSpend = 0;

  transactions.forEach(t => {
     if (t.type === 'expense') {
        const d = new Date(t.date);
        if (!isNaN(d.getTime())) {
            const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            dateMap[key] = (dateMap[key] || 0) + t.amount;
            if (dateMap[key] > maxSpend) maxSpend = dateMap[key];
        }
     }
  });

  // Create grid cells
  const cells = [];
  for (let i = days - 1; i >= 0; i--) {
     const d = new Date();
     d.setDate(today.getDate() - i);
     const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
     const amount = dateMap[key] || 0;
     const intensity = amount === 0 ? 0 : Math.ceil((amount / maxSpend) * 4);
     
     cells.push({ date: d, key, amount, intensity });
  }

  // Group by week for vertical columns (GitHub style)
  const weeksData = [];
  let currentWeek = [];
  for (let i = 0; i < cells.length; i++) {
     currentWeek.push(cells[i]);
     if (currentWeek.length === 7 || i === cells.length - 1) {
        weeksData.push(currentWeek);
        currentWeek = [];
     }
  }

  const getColor = (intensity: number) => {
     if (intensity === 0) return isDark ? 'bg-gray-800' : 'bg-gray-100';
     // Red scale for expenses
     if (intensity === 1) return 'bg-red-200 dark:bg-red-900/40';
     if (intensity === 2) return 'bg-red-300 dark:bg-red-900/60';
     if (intensity === 3) return 'bg-red-400 dark:bg-red-800';
     return 'bg-red-500 dark:bg-red-600';
  };

  return (
    <div className="w-full h-full flex flex-col justify-center overflow-x-auto no-scrollbar pb-2">
       <div className="flex gap-1.5 min-w-max px-2">
          {weeksData.map((week, wIdx) => (
             <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day) => (
                   <div 
                      key={day.key}
                      onClick={() => onClick(day.key)}
                      className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${getColor(day.intensity)} transition-all hover:scale-125 hover:z-10 cursor-pointer relative group`}
                   >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[9px] font-bold py-1 px-2 rounded-lg whitespace-nowrap z-50 pointer-events-none">
                         {day.date.toLocaleDateString(undefined, {month:'short', day:'numeric'})}: {currency}{day.amount.toFixed(0)}
                      </div>
                   </div>
                ))}
             </div>
          ))}
       </div>
       <div className="flex items-center justify-end gap-2 mt-3 px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Less</span>
          <div className="flex gap-1">
             <div className={`w-2.5 h-2.5 rounded-sm ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
             <div className="w-2.5 h-2.5 rounded-sm bg-red-200 dark:bg-red-900/40"></div>
             <div className="w-2.5 h-2.5 rounded-sm bg-red-400 dark:bg-red-800"></div>
             <div className="w-2.5 h-2.5 rounded-sm bg-red-500 dark:bg-red-600"></div>
          </div>
          <span>More</span>
       </div>
    </div>
  );
};