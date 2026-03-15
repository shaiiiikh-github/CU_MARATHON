'use client';

import { useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, CheckCircle2, Clock, Download, FileText, Database, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const INITIAL_HISTORY = [
    { id: 'SCN-8291', project: 'Auth-Microservice-v2', branch: 'main', status: 'Completed', risk: 'LOW', score: '1.2', date: '2024-05-15 14:30', language: 'Python' },
    { id: 'SCN-8290', project: 'Legacy-API-Gateway', branch: 'hotfix/security', status: 'Completed', risk: 'CRITICAL', score: '9.4', date: '2024-05-15 12:15', language: 'JavaScript' },
    { id: 'SCN-8289', project: 'Payment-Processor-JS', branch: 'production', status: 'Completed', risk: 'HIGH', score: '7.8', date: '2024-05-14 18:45', language: 'TypeScript' },
    { id: 'SCN-8288', project: 'Customer-Portal-App', branch: 'staging', status: 'Completed', risk: 'MEDIUM', score: '5.2', date: '2024-05-14 10:20', language: 'React' },
    { id: 'SCN-8287', project: 'Data-Sync-Util', branch: 'main', status: 'Completed', risk: 'SAFE', score: '0.4', date: '2024-05-13 16:10', language: 'Go' },
    { id: 'SCN-8286', project: 'Internal-Admin-Panel', branch: 'feat/audit', status: 'Completed', risk: 'HALLUCINATED', score: '6.5', date: '2024-05-13 09:05', language: 'Python' },
];

const getStatusStyles = (risk: string) => {
    switch (risk) {
        case 'SAFE': return 'text-safe bg-safe/10 border-safe/20';
        case 'LOW': return 'text-safe bg-safe/10 border-safe/20';
        case 'MEDIUM': return 'text-hallucinated bg-hallucinated/10 border-hallucinated/20';
        case 'HIGH': return 'text-hallucinated bg-hallucinated/10 border-hallucinated/20';
        case 'CRITICAL': return 'text-vulnerable bg-vulnerable/10 border-vulnerable/20';
        case 'HALLUCINATED': return 'text-hallucinated bg-hallucinated/10 border-hallucinated/20';
        default: return 'text-secondary bg-card/50 border-card-border';
    }
};

export default function HistoryPage() {
    const [history, setHistory] = useState(INITIAL_HISTORY);
    const [searchTerm, setSearchTerm] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const filteredHistory = history.filter(item =>
        item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert('Forensic log exported as CSV');
        }, 1500);
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto relative min-h-screen">
            {/* 3D Background Elements */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-30">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full animate-drift"></div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black italic mb-3">Audit <span className="gradient-text">Log</span></h1>
                    <p className="text-secondary text-sm font-medium">Archival record of every neural security audit performed by the AI engine.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-3 glass border border-card-border rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-card hover:border-primary/20 transition-all active:scale-95">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-5 py-3 glass border border-card-border rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/10 hover:border-primary/30 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isExporting ? <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div> : <Download className="w-4 h-4" />}
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                {[
                    { label: 'Total Archives', value: '1,248', icon: Database },
                    { label: 'Neural Protection', value: '84%', color: 'safe', icon: ShieldCheck },
                    { label: 'Average Risk', value: '2.4', icon: FileText },
                    { label: 'Active Alerts', value: '12', color: 'vulnerable', icon: AlertCircle },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-5 rounded-2xl border border-card-border bg-card/10 group hover:border-primary/20 transition-all"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] text-secondary uppercase font-black tracking-[0.15em] opacity-60">{stat.label}</p>
                            <stat.icon className={`w-4 h-4 ${stat.color === 'safe' ? 'text-safe' :
                                    stat.color === 'vulnerable' ? 'text-vulnerable' :
                                        stat.color === 'hallucinated' ? 'text-hallucinated' : 'text-secondary'
                                }`} />
                        </div>
                        <p className={`text-2xl md:text-3xl font-black ${stat.color === 'safe' ? 'text-safe' :
                                stat.color === 'vulnerable' ? 'text-vulnerable' :
                                    stat.color === 'hallucinated' ? 'text-hallucinated' : 'text-foreground'
                            }`}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Table Container */}
            <div className="glass rounded-3xl border border-card-border overflow-hidden relative z-10 shadow-2xl shadow-primary/5">
                <div className="p-5 border-b border-card-border bg-card/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-sm w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Filter by Repository or ID..."
                            className="w-full pl-12 pr-4 py-3 bg-background/50 border border-card-border rounded-xl text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-background transition-all"
                        />
                    </div>
                    <div className="hidden lg:flex gap-6">
                        {['safe', 'hallucinated', 'vulnerable'].map((type) => (
                            <div key={type} className="flex items-center gap-2 group cursor-pointer">
                                <span className={`w-2.5 h-2.5 rounded-full ${type === 'safe' ? 'bg-safe shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
                                        type === 'vulnerable' ? 'bg-vulnerable shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
                                            'bg-hallucinated shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                                    }`}></span>
                                <span className="text-[10px] text-secondary font-black uppercase tracking-widest group-hover:text-foreground transition-colors">{type === 'hallucinated' ? 'Warning' : type}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-card/40 text-[10px] font-black uppercase tracking-[0.2em] text-secondary border-b border-card-border">
                                <th className="px-8 py-5">Scan Identifier</th>
                                <th className="px-8 py-5">Neural Target</th>
                                <th className="px-8 py-5">Audit Status</th>
                                <th className="px-8 py-5">Risk Matrix</th>
                                <th className="px-8 py-5">Score</th>
                                <th className="px-8 py-5">Timestamp</th>
                                <th className="px-8 py-5 text-right">Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border/50">
                            {filteredHistory.map((scan, i) => (
                                <motion.tr
                                    key={scan.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group hover:bg-primary/5 transition-all duration-300"
                                >
                                    <td className="px-8 py-5">
                                        <span className="font-mono text-xs text-primary font-black italic tracking-tight">{scan.id}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-card border border-card-border flex items-center justify-center text-[10px] font-black text-secondary group-hover:text-primary group-hover:border-primary/30 transition-all">
                                                {scan.language.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black tracking-tight">{scan.project}</p>
                                                <p className="text-[10px] text-secondary font-bold font-mono opacity-50">{scan.branch}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-xs text-safe font-black uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 rounded-full bg-safe shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                                            Logged
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getStatusStyles(scan.risk)} tracking-widest uppercase`}>
                                            {scan.risk}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-black">{scan.score}</span>
                                            <div className="w-16 h-1.5 bg-card rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(parseFloat(scan.score) * 10, 100)}%` }}
                                                    className={`h-full ${parseFloat(scan.score) > 7 ? 'bg-vulnerable' : parseFloat(scan.score) > 4 ? 'bg-hallucinated' : 'bg-safe'}`}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-[10px] text-secondary font-bold uppercase tracking-wide whitespace-nowrap">
                                            <Clock className="w-3.5 h-3.5" /> {scan.date}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Link href="/reports" className="inline-flex p-3 glass border border-card-border rounded-xl hover:bg-primary hover:border-primary group/btn transition-all shadow-xl active:scale-95">
                                            <ChevronRight className="w-5 h-5 text-secondary group-hover/btn:text-background" />
                                        </Link>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
