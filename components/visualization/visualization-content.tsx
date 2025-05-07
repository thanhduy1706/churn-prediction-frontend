'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DataTable } from '@/components/visualization/data-table';
import { PieChartComponent } from '@/components/visualization/pie-chart';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { loadCSVFile } from '@/lib/utils/csv-loader';

export function VisualizationContent() {
    const [csvData, setCsvData] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                const data = await loadCSVFile('churn_data.csv'); // Replace with your CSV filename
                setCsvData(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Failed to load data'
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <motion.div
            className='max-w-5xl mx-auto bg-card p-8 rounded-xl border shadow-sm dark:shadow-md'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className='flex items-center mb-8'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <motion.div whileHover={{ x: -5 }}>
                    <Button variant='ghost' size='sm' asChild className='gap-1'>
                        <Link href='/results'>
                            <ArrowLeft className='h-4 w-4' />
                            Go back
                        </Link>
                    </Button>
                </motion.div>
                <h2 className='text-2xl font-medium mx-auto'>Visualization</h2>
            </motion.div>

            <motion.div
                className='grid grid-cols-1 md:grid-cols-2 gap-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h3 className='text-lg font-medium mb-4'>Dataset</h3>
                    {isLoading ? (
                        <div className='text-center py-4'>Loading data...</div>
                    ) : error ? (
                        <div className='text-red-500 text-center py-4'>
                            {error}
                        </div>
                    ) : (
                        <DataTable csvData={csvData} />
                    )}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h3 className='text-lg font-medium mb-4'>
                        Prediction Rate
                    </h3>
                    <div className='flex items-center justify-center h-[300px]'>
                        <PieChartComponent csvData={csvData} />
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
