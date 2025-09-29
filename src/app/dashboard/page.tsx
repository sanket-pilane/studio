
'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { stations } from "@/lib/data"
import { MoreHorizontal, PlusCircle, ArrowUpRight, Activity, Users, DollarSign } from "lucide-react"
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
import { useEffect } from "react";

export default function DashboardPage() {
    const { isAdmin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/');
        }
    }, [isAdmin, loading, router]);
    
    if (loading || !isAdmin) {
        return <div className="container mx-auto p-4 md:p-8">Checking permissions...</div>;
    }

    const totalAvailability = stations.reduce((acc, station) => acc + station.availableChargers, 0);
    const totalChargers = stations.reduce((acc, station) => acc + station.totalChargers, 0);
    const availabilityPercentage = totalChargers > 0 ? (totalAvailability / totalChargers * 100).toFixed(0) : 0;
  
    return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Operator Dashboard</h1>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Station
            </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stations.length}</div>
              <p className="text-xs text-muted-foreground">+2 since last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Availability</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availabilityPercentage}%</div>
              <p className="text-xs text-muted-foreground">{totalAvailability} / {totalChargers} chargers free</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,231.89</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 since last hour</p>
            </CardContent>
          </Card>
        </div>


        <Card>
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
                                    <Badge variant={station.availableChargers > 3 ? "secondary" : "outline"}
                                        className={station.availableChargers > 3 ? "bg-green-100 text-green-800" : ""}
                                    >
                                        {station.availableChargers} / {station.totalChargers}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">${station.price}/kWh</TableCell>
                                <TableCell className="hidden sm:table-cell">{station.rating}/5.0</TableCell>
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
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>View Bookings</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Disable</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}

