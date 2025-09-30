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

  // Generate times in 12-hour format with AM/PM
  const generateTimes = () => {
    const times: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const min = m.toString().padStart(2, '0');
        times.push(`${hour12}:${min} ${ampm}`);
      }
    }
    return times;
  };

  const parseTimeValue = (val: string) => {
    const [time, ampm] = val.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return { h, m };
  };

  return (
    <div className="space-y-6 max-w-md sm:max-w-lg lg:max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Date & Time */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col min-w-0">
                <FormLabel>Charging Date & Time</FormLabel>

                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-col gap-2 min-w-0">
                  {/* Calendar Picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="min-w-0">
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full sm:w-[220px] min-w-0 justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          </span>
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

                  {/* Time Picker (12-hour format) */}
                  <Select
                    onValueChange={(val) => {
                      const { h, m } = parseTimeValue(val);
                      const newDate = new Date(form.getValues('date'));
                      newDate.setHours(h, m);
                      form.setValue('date', newDate, { shouldValidate: true });
                    }}
                    value={(() => {
                      const d = form.getValues('date');
                      const h24 = d.getHours();
                      const m = d.getMinutes().toString().padStart(2, '0');
                      const ampm = h24 >= 12 ? 'PM' : 'AM';
                      const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
                      return `${h12}:${m} ${ampm}`;
                    })()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {generateTimes().map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
