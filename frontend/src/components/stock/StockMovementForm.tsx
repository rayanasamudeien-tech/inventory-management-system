'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Loader2 } from 'lucide-react';

const movementSchema = z.object({
  type: z.enum(['RECEIVE', 'ISSUE', 'RETURN', 'ADJUST']),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  reason: z.string().min(2, 'Reason is required'),
  departmentId: z.string().optional(),
});

type MovementFormValues = z.infer<typeof movementSchema>;

interface StockMovementFormProps {
  item: any;
  type: 'RECEIVE' | 'ISSUE';
  onSubmit: (data: MovementFormValues) => void;
  loading?: boolean;
}

export function StockMovementForm({ item, type, onSubmit, loading }: StockMovementFormProps) {
  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema) as any,
    defaultValues: {
      type: type,
      quantity: 1,
      reason: '',
      departmentId: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-4">
          <p className="text-sm font-medium text-slate-500">Item</p>
          <p className="text-base font-bold text-slate-900">{item.name}</p>
          <p className="text-xs text-slate-500">Current Stock: {item.quantity} {item.unit}</p>
        </div>

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity to {type.toLowerCase()}</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'ISSUE' && (
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issuing to Department</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ict">ICT Department</SelectItem>
                    <SelectItem value="science">Science Department</SelectItem>
                    <SelectItem value="admin">Administration</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason / Remarks</FormLabel>
              <FormControl>
                <Input placeholder="e.g. New shipment received" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="submit" 
            variant={type === 'ISSUE' ? 'default' : 'default'}
            className={type === 'RECEIVE' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {type === 'RECEIVE' ? 'Receive Stock' : 'Issue Stock'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
