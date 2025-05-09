'use client';

import type React from 'react';

import { useState, useRef } from 'react';
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
import { Loader2, Dices } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setResult } from '@/lib/redux/slices/predictionSlice';

export function PredictionForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            Dependents: formData.get('dependents') as string,
            tenure: Number(formData.get('tenure')),
            InternetService: formData.get('internet_service') as string,
            OnlineSecurity: formData.get('online_security') as string,
            TechSupport: formData.get('tech_support') as string,
            StreamingTV: formData.get('streamingtv') as string,
            StreamingMovies: formData.get('streamingmovies') as string,
            Contract: formData.get('contract') as string,
            PaperlessBilling: formData.get('paperless_billing') as string,
            PaymentMethod: formData.get('payment_method') as string,
            MonthlyCharges: Number(formData.get('monthly_charges')),
            TotalCharges: Number(formData.get('total_charges')),
        };

        try {
            const response = await fetch(
                'https://churn-prediction-backend-440303738717.asia-southeast1.run.app/predict',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                throw new Error('Prediction request failed');
            }

            const result = await response.json();
            dispatch(
                setResult({
                    isChurn: result.result === 'Yes',
                    churnProbability: result.probability,
                })
            );
            router.push('/results');
        } catch (error) {
            console.error('Error making prediction:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fillRandomValues = () => {
        if (!formRef.current) return;

        // Helper function to get random item from array
        const getRandomItem = (items: any[]) => items[Math.floor(Math.random() * items.length)];

        // Helper function to get random number within range
        const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

        // Fill select fields
        const selects = formRef.current.querySelectorAll('select');
        selects.forEach(select => {
            const options = Array.from(select.options).filter(opt => opt.value);
            if (options.length) {
                const randomOption = getRandomItem(options);
                select.value = randomOption.value;
                // Dispatch change event to trigger React's select component update
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // Fill number inputs
        const inputs = formRef.current.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            const name = (input as HTMLInputElement).name;
            let value = 0;

            if (name === 'monthly_charges') {
                value = getRandomNumber(20, 120);
            } else if (name === 'total_charges') {
                value = getRandomNumber(100, 8000);
            } else if (name === 'tenure') {
                value = getRandomNumber(1, 72);
            }

            (input as HTMLInputElement).value = value.toString();
            // Dispatch change event to trigger React's input component update
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
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
            ref={formRef}
            onSubmit={handleSubmit}
            className='space-y-6'
            variants={container}
            initial='hidden'
            animate='show'
        >


            <motion.div
                className='grid grid-cols-1 md:grid-cols-2 gap-2'
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
                className='grid grid-cols-3 items-center mt-8 w-full'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <div></div>
                <div className="flex justify-center">
                    <Button
                        type='submit'
                        className='px-8 py-2 rounded-full transition-all hover:scale-110 active:scale-95 duration-300'
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
                </div>
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={fillRandomValues}
                        className="flex items-center gap-2"
                    >
                        <Dices className="h-4 w-4" />
                        Fill Random
                    </Button>
                </div>
            </motion.div>
        </motion.form>
    );
}
