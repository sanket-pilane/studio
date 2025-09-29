
'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { StationSchema } from '@/lib/zod-schemas';
import type { Station } from '@/lib/types';
import { createStation, updateStation } from '@/ai/flows/station-management-flow';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

type StationFormDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onStationSaved: () => void;
  station: Station | null;
};

// Create a schema for the form, omitting the id as it's not edited in the form
const formSchema = StationSchema.omit({ id: true });
type StationFormData = z.infer<typeof formSchema>;

export default function StationFormDialog({ isOpen, onOpenChange, onStationSaved, station }: StationFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      coordinates: { lat: 0, lng: 0 },
      connectors: [{ type: 'CCS', speed: 50 }],
      price: 0,
      totalChargers: 1,
      availableChargers: 1,
      rating: 4.5,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'connectors',
  });

  useEffect(() => {
    if (station) {
      form.reset(station);
    } else {
      form.reset({
        name: '',
        address: '',
        coordinates: { lat: 18.52, lng: 73.85 },
        connectors: [{ type: 'CCS', speed: 50 }],
        price: 15,
        totalChargers: 4,
        availableChargers: 4,
        rating: 4.5,
      });
    }
  }, [station, form, isOpen]);

  const onSubmit = async (data: StationFormData) => {
    setIsSubmitting(true);
    try {
      if (station) {
        await updateStation(station.id, data);
        toast({ title: 'Station Updated', description: `${data.name} has been successfully updated.` });
      } else {
        await createStation(data);
        toast({ title: 'Station Created', description: `${data.name} has been successfully added.` });
      }
      onStationSaved();
    } catch (error) {
      console.error('Failed to save station:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save station.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{station ? 'Edit Station' : 'Add New Station'}</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Station Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField control={form.control} name="coordinates.lat" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl><Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField control={form.control} name="coordinates.lng" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl><Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price/kWh</FormLabel>
                        <FormControl><Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="totalChargers" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Total Chargers</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="availableChargers" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Available Now</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="rating" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <Separator/>

            <div>
                <FormLabel>Connectors</FormLabel>
                 {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-center mt-2">
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name={`connectors.${index}.type`}
                                render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Tesla">Tesla</SelectItem>
                                                <SelectItem value="CCS">CCS</SelectItem>
                                                <SelectItem value="Type 2">Type 2</SelectItem>
                                                <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-4">
                             <FormField
                                control={form.control}
                                name={`connectors.${index}.speed`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" placeholder="Speed (kW)" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-2">
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ type: 'CCS', speed: 50 })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Connector
                </Button>
            </div>
            
            <DialogFooter className="pt-4 pr-0">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Station'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
