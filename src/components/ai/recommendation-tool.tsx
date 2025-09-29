'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, Loader2, AlertCircle, Sparkles, ServerCrash } from 'lucide-react';
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

const formSchema = z.object({
  time: z.string().min(1, 'Please select a time.'),
  connectorType: z.enum(['Tesla', 'CCS', 'Type 2', 'CHAdeMO']),
});

export default function RecommendationTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StationRecommendationOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: new Date().toISOString().slice(0, 16),
      connectorType: 'CCS',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Using a hardcoded location for prototype purposes
      const input = {
        latitude: 37.7749, // San Francisco
        longitude: -122.4194,
        time: new Date(values.time).toISOString(),
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

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Charging Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="connectorType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Connector Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Find Best Station
          </Button>
        </form>
      </Form>
      
      {loading && (
        <div className="flex items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Thinking...
        </div>
      )}

      {error && (
        <Alert variant="destructive">
            <ServerCrash className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
