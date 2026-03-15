'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-10 h-10" />;

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl glass-hover glass text-secondary hover:text-primary transition-all duration-300 flex items-center justify-center relative overflow-hidden"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <div className="relative w-5 h-5">
                <motion.div
                    initial={false}
                    animate={{
                        y: theme === 'dark' ? 0 : 20,
                        opacity: theme === 'dark' ? 1 : 0,
                        rotate: theme === 'dark' ? 0 : 45
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0"
                >
                    <Moon className="w-5 h-5" />
                </motion.div>
                <motion.div
                    initial={false}
                    animate={{
                        y: theme === 'light' ? 0 : -20,
                        opacity: theme === 'light' ? 1 : 0,
                        rotate: theme === 'light' ? 0 : -45
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0"
                >
                    <Sun className="w-5 h-5" />
                </motion.div>
            </div>
        </motion.button>
    );
}
