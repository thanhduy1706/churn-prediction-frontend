'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/redux/store';

export function ResultsContent() {
    const result = useSelector((state: RootState) => state.prediction.result);
    let display, color, emoji;
    if (result.isChurn === true) {
        display = 'Yes';
        color = 'text-[#1E8181]';
        emoji = '😞';
    } else if (result.isChurn === false) {
        display = 'No';
        color = 'text-[#CE7216]';
        emoji = '😊';
    } else {
        display = '-';
        color = 'text-muted-foreground';
        emoji = '';
    }

    return (
        <motion.div
            className='max-w-4xl mx-auto bg-card p-8 rounded-xl border shadow-sm dark:shadow-md'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className='text-center space-y-12'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <motion.h2
                    className='text-4xl font-medium'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    Predicted result:
                </motion.h2>
                <motion.div
                    className='space-y-2'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <div
                        className={`text-7xl font-bold flex items-center justify-center gap-4 ${color}`}
                    >
                        {display}{' '}
                        {emoji && <span className='text-6xl'>{emoji}</span>}
                    </div>
                    <div className='mt-4'>
                        <p className='text-lg text-muted-foreground'>
                            Churn Probability:
                        </p>
                        <p className='text-2xl font-semibold mt-2'>
                            {((result.churnProbability ?? 0) * 100).toFixed(2)}%
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className='pt-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <p className='text-sm text-muted-foreground mb-2'>
                        Start a new prediction
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                            variant='outline'
                            asChild
                            className='rounded-full'
                        >
                            <Link href='/'>Start New</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
