'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setResult } from '@/lib/redux/slices/predictionSlice';

export function PredictionForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call and prediction result
        setTimeout(() => {
            // Simulate prediction: randomly Yes/No (replace with real logic)
            const isChurn = Math.random() > 0.5;
            dispatch(
                setResult({ isChurn, churnProbability: isChurn ? 0.8 : 0.2 })
            );
            setIsSubmitting(false);
            router.push('/results');
        }, 1500);
    };

    const formFields = [
        {
            label: 'Online Security',
            type: 'select',
            options: ['Yes', 'No', 'No internet service'],
            placeholder: 'Select Online Security',
        },
        {
            label: 'Monthly Charges',
            type: 'input',
            placeholder: 'Type Monthly Charges...',
        },
        {
            label: 'Internet Service',
            type: 'select',
            options: ['DSL', 'Fiber optic', 'No'],
            placeholder: 'Select Internet Service',
        },
        {
            label: 'Tenure',
            type: 'input',
            placeholder: 'Type Tenure Value...',
        },
        {
            label: 'Contract',
            type: 'select',
            options: ['Month-to-month', 'One year', 'Two year'],
            placeholder: 'Select Contract',
        },
        {
            label: 'StreamingTV',
            type: 'select',
            options: ['Yes', 'No', 'No internet service'],
            placeholder: 'Select StreamingTV',
        },
        {
            label: 'StreamingMovies',
            type: 'select',
            options: ['Yes', 'No', 'No internet service'],
            placeholder: 'Select StreamingMovies',
        },
        {
            label: 'Total Charges',
            type: 'input',
            placeholder: 'Type Total Charges...',
        },
        {
            label: 'Dependents',
            type: 'select',
            options: ['Yes', 'No'],
            placeholder: 'Select Dependents',
        },
        {
            label: 'Payment Method',
            type: 'select',
            options: [
                'Electronic check',
                'Mailed check',
                'Bank transfer (automatic)',
                'Credit card (automatic)',
            ],
            placeholder: 'Select Payment Method',
        },
        {
            label: 'Paperless Billing',
            type: 'select',
            options: ['Yes', 'No'],
            placeholder: 'Select Paperless Billing',
        },
        {
            label: 'Tech Support',
            type: 'select',
            options: ['Yes', 'No', 'No internet service'],
            placeholder: 'Select Tech Support',
        },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.3,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className='space-y-8'
            variants={container}
            initial='hidden'
            animate='show'
        >
            <motion.div
                className='grid grid-cols-1 md:grid-cols-2 gap-6'
                variants={container}
            >
                {formFields.map((field, index) => (
                    <motion.div
                        key={index}
                        className='space-y-2'
                        variants={item}
                    >
                        <label className='text-sm font-medium'>
                            {field.label}{' '}
                            <span className='text-red-500'>*</span>
                        </label>
                        {field.type === 'select' ? (
                            <Select
                                name={field.label
                                    .toLowerCase()
                                    .replace(/\s+/g, '_')}
                                required
                            >
                                <SelectTrigger className='w-full transition-all hover:border-primary focus:ring-1 focus:ring-primary'>
                                    <SelectValue
                                        placeholder={field.placeholder}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map((option, i) => (
                                        <SelectItem
                                            key={i}
                                            value={option
                                                .toLowerCase()
                                                .replace(/\s+/g, '_')}
                                        >
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                name={field.label
                                    .toLowerCase()
                                    .replace(/\s+/g, '_')}
                                type='number'
                                placeholder={field.placeholder}
                                required
                                className='transition-all hover:border-primary focus:ring-1 focus:ring-primary'
                            />
                        )}
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className='flex justify-center mt-8'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <Button
                    type='submit'
                    className='px-8 py-2 rounded-full transition-all hover:scale-105 active:scale-95'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className='flex items-center gap-2'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            Processing...
                        </span>
                    ) : (
                        'Predict'
                    )}
                </Button>
            </motion.div>
        </motion.form>
    );
}
