'use client';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Papa, { ParseResult } from 'papaparse';

interface PieChartProps {
    csvData?: string;
}

const COLORS = ['#CE7216', '#1E8181']; // Red for Yes, Green for No

export function PieChartComponent({ csvData }: PieChartProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [chartData, setChartData] = useState<
        { name: string; value: number }[]
    >([]);

    useEffect(() => {
        if (csvData) {
            Papa.parse(csvData, {
                header: true,
                complete: (results: ParseResult<{ [key: string]: string }>) => {
                    if (results.data && results.data.length > 0) {
                        // Count Yes and No values in the Churn column
                        const churnCounts = results.data.reduce((acc, row) => {
                            const churnValue = row.Churn?.toLowerCase() || '';
                            if (churnValue === 'yes' || churnValue === 'no') {
                                acc[churnValue] = (acc[churnValue] || 0) + 1;
                            }
                            return acc;
                        }, {} as { [key: string]: number });

                        // Calculate percentages
                        const total = Object.values(churnCounts).reduce(
                            (sum, count) => sum + count,
                            0
                        );
                        const formattedData = Object.entries(churnCounts).map(
                            ([name, value]) => ({
                                name:
                                    name.charAt(0).toUpperCase() +
                                    name.slice(1),
                                value: Math.round((value / total) * 100),
                            })
                        );

                        setChartData(formattedData);
                    }
                },
                error: (error: Error) => {
                    console.error('Error parsing CSV for pie chart:', error);
                },
            });
        }
    }, [csvData]);

    useEffect(() => {
        setIsAnimating(true);
    }, []);

    return (
        <motion.div
            className='w-full h-full'
            initial={{ opacity: 0, rotate: -90 }}
            animate={{
                opacity: isAnimating ? 1 : 0,
                rotate: isAnimating ? 0 : -90,
            }}
            transition={{ duration: 1, delay: 0.5 }}
        >
            <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='value'
                        animationDuration={1500}
                        animationBegin={300}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [
                            `${value}%`,
                            'Percentage',
                        ]}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
