
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Wand2, Loader2, ServerCrash, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { getStationRecommendation } from '@/ai/flows/station-recommendation-tool';
import type { StationRecommendationOutput } from '@/ai/flows/station-recommendation-tool';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  date: z.date({
    required_error: 'A date and time is required.',
  }),
  connectorType: z.enum(['Tesla', 'CCS', 'Type 2', 'CHAdeMO']),
});

export default function RecommendationTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StationRecommendationOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      connectorType: 'CCS',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const input = {
        latitude: 18.5204, // Pune
        longitude: 73.8567,
        time: values.date.toISOString(),
        connectorType: values.connectorType,
      };
      const recommendation = await getStationRecommendation(input);
      setResult(recommendation);
    } catch (e) {
      console.error(e);
      setError('Failed to get recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (!time) return;

    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(form.getValues('date'));
    newDate.setHours(hours, minutes);
    form.setValue('date', newDate, { shouldValidate: true });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Date & Time */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Charging Date & Time</FormLabel>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  {/* Calendar Picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full sm:w-[240px] justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            const newDate = new Date(field.value);
                            newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                            field.onChange(newDate);
                          }
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setDate(new Date().getDate() - 1))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Time Picker */}
                  <Input
                    type="time"
                    value={field.value ? field.value.toISOString().slice(11, 16) : ''}
                    onChange={handleTimeChange}
                    className="w-full sm:w-auto"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Connector Type */}
          <FormField
            control={form.control}
            name="connectorType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Connector Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a connector" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tesla">Tesla</SelectItem>
                    <SelectItem value="CCS">CCS</SelectItem>
                    <SelectItem value="Type 2">Type 2</SelectItem>
                    <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Find Best Station
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Thinking...
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <ServerCrash className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Result */}
      {result && (
        <Card className="bg-primary/10 border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              AI Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <h3 className="font-semibold text-lg">{result.stationName}</h3>
            <p className="text-sm text-foreground/80">{result.reason}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
