'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle, Loader2, Zap, Users, DollarSign, Trash2, Edit, CheckCircle2, XCircle, MapPin } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllBookings } from "@/ai/flows/booking-flow"
import { getStations, deleteStation } from "@/ai/flows/station-management-flow";
import type { Booking, Station } from "@/lib/types"
import StationFormDialog from "@/components/dashboard/station-form-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
    const { isAdmin, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stations, setStations] = useState<Station[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [stationToDelete, setStationToDelete] = useState<Station | null>(null);


    const fetchData = async () => {
        if (isAdmin) {
            try {
                setLoadingData(true);
                const [bookingsData, stationsData] = await Promise.all([
                    getAllBookings(),
                    getStations()
                ]);
                setBookings(bookingsData);
                setStations(stationsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to load dashboard data.' });
            } finally {
                setLoadingData(false);
            }
        }
    };

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/');
        }
        if(isAdmin){
            fetchData();
        }
    }, [isAdmin, loading, router]);
    
    if (loading || !isAdmin) {
        return (
          <div className="flex items-center justify-center h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
    }

    const handleAddStation = () => {
        setSelectedStation(null);
        setIsFormOpen(true);
    };
    
    const handleEditStation = (station: Station) => {
        setSelectedStation(station);
        setIsFormOpen(true);
    };

    const confirmDeleteStation = (station: Station) => {
        setStationToDelete(station);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteStation = async () => {
        if (!stationToDelete) return;
        try {
            await deleteStation(stationToDelete.id);
            toast({ title: "Station Deleted", description: `${stationToDelete.name} has been removed.` });
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Failed to delete station:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not delete the station." });
        } finally {
            setIsDeleteDialogOpen(false);
            setStationToDelete(null);
        }
    };


    const totalAvailability = stations.reduce((acc, station) => acc + station.availableChargers, 0);
    const totalChargers = stations.reduce((acc, station) => acc + station.totalChargers, 0);
    const availabilityPercentage = totalChargers > 0 ? Math.round((totalAvailability / totalChargers) * 100) : 0;
  
    return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Operator Dashboard</h1>
            <Button onClick={handleAddStation}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Station
            </Button>
        </div>
        
        {loadingData ? <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div> : (
            <>
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 mb-8">
                <Card className="animate-fade-in-up">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{stations.length}</div>
                    <p className="text-xs text-muted-foreground">stations currently online</p>
                    </CardContent>
                </Card>
                <Card className="animate-fade-in-up [animation-delay:100ms]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Charger Availability</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{availabilityPercentage}%</div>
                    <p className="text-xs text-muted-foreground">{totalAvailability} of {totalChargers} chargers free</p>
                    </CardContent>
                </Card>
                <Card className="animate-fade-in-up [animation-delay:200ms]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">+{bookings.filter(b => b.status === 'Confirmed').length}</div>
                    <p className="text-xs text-muted-foreground">out of {bookings.length} total bookings</p>
                    </CardContent>
                </Card>
                </div>


                <Card className="animate-fade-in-up [animation-delay:400ms]">
                    <CardHeader>
                        <CardTitle>Station Management</CardTitle>
                        <CardDescription>View, edit, or update your station information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Station Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Availability</TableHead>
                                    <TableHead className="hidden md:table-cell">Price</TableHead>
                                    <TableHead className="hidden sm:table-cell">Rating</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stations.map((station) => (
                                    <TableRow key={station.id}>
                                        <TableCell className="font-medium">{station.name}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                             <Badge variant={station.availableChargers > 0 ? "secondary" : "outline"}
                                                className={station.availableChargers > 0 ? "bg-green-500/20 text-green-400 border-green-500/30" : "border-red-500/30 text-red-400"}
                                            >
                                                {station.availableChargers} / {station.totalChargers}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">${station.price.toFixed(2)}/kWh</TableCell>
                                        <TableCell className="hidden sm:table-cell">{station.rating.toFixed(1)}/5.0</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEditStation(station)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => confirmDeleteStation(station)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </>
        )}
        <StationFormDialog
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            onStationSaved={() => {
                setIsFormOpen(false);
                fetchData();
            }}
            station={selectedStation}
        />
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        station <span className="font-semibold">{stationToDelete?.name}</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteStation} className="bg-destructive hover:bg-destructive/90">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}
