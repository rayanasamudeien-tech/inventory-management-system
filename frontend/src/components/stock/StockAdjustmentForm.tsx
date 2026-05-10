'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';

const stockAdjustmentSchema = z.object({
  stockItemId: z.string().min(1, 'Stock item is required'),
  oldQuantity: z.coerce.number().min(0, 'Old quantity cannot be negative'),
  newQuantity: z.coerce.number().min(0, 'New quantity cannot be negative'),
  reason: z.string().optional(),
});

type StockAdjustmentFormValues = z.infer<typeof stockAdjustmentSchema>;

interface StockAdjustmentFormProps {
  onSubmit: (data: StockAdjustmentFormValues) => void;
  loading?: boolean;
}

export function StockAdjustmentForm({ onSubmit, loading }: StockAdjustmentFormProps) {
  const [stockItems, setStockItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const response = await api.get('/stock');
        setStockItems(response.data);
      } catch (error) {
        console.error('Failed to fetch stock items:', error);
      }
    };
    fetchStockItems();
  }, []);

  const form = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(stockAdjustmentSchema) as any,
    defaultValues: {
      stockItemId: '',
      oldQuantity: 0,
      newQuantity: 0,
      reason: '',
    },
  });

  const selectedStockItem = stockItems.find(item => item.id === form.watch('stockItemId'));

  useEffect(() => {
    if (selectedStockItem) {
      form.setValue('oldQuantity', selectedStockItem.quantity);
    }
  }, [selectedStockItem, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="stockItemId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Item</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a stock item" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stockItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} (Current: {item.quantity} {item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="oldQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter reason for adjustment..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Adjustment
          </Button>
        </div>
      </form>
    </Form>
  );
}