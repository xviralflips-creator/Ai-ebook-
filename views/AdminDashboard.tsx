import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, FileText, Server, AlertCircle, CheckCircle, Database, Settings } from 'lucide-react';
import { Button } from '../components/Button';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Active Users', value: '1,284', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Stories Generated', value: '8,543', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'API Health', value: '99.9%', icon: Activity, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Server Load', value: '34%', icon: Server, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const recentLogs = [
    { id: 1, action: 'User Signup', user: 'alice@example.com', time: '2 mins ago', status: 'success' },
    { id: 2, action: 'Story Generation', user: 'bob@example.com', time: '5 mins ago', status: 'success' },
    { id: 3, action: 'API Quota Warning', user: 'System', time: '12 mins ago', status: 'warning' },
    { id: 4, action: 'Payment Processed', user: 'charlie@example.com', time: '15 mins ago', status: 'success' },
    { id: 5, action: 'Image Gen Failed', user: 'dave@example.com', time: '1 hour ago', status: 'error' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Console</h1>
          <p className="text-slate-500 font-medium">System Overview & Management</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline"><Settings className="w-4 h-4 mr-2"/> Config</Button>
            <Button variant="primary">Export Logs</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 rounded-2xl flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area (Simulated) */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-500" />
                Traffic Overview (Real-time)
            </h3>
            <div className="h-64 flex items-end gap-2 justify-between px-2">
                {[...Array(20)].map((_, i) => (
                    <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.random() * 80 + 20}%` }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
                        className="w-full bg-gradient-to-t from-brand-500 to-brand-300 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    />
                ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:59</span>
            </div>
        </div>

        {/* System Logs */}
        <div className="glass-panel p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                Live System Logs
            </h3>
            <div className="space-y-4">
                {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-3 p-3 hover:bg-white/50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                        {log.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {log.status === 'warning' && <AlertCircle className="w-5 h-5 text-orange-500" />}
                        {log.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700">{log.action}</p>
                            <p className="text-xs text-slate-500 truncate">{log.user}</p>
                        </div>
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{log.time}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};