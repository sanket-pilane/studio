import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { bookings } from "@/lib/data"
import { cn } from "@/lib/utils"
import { CreditCard, MapPin, User, Car } from "lucide-react"

export default function ProfilePage() {
  const user = {
    name: "Alex Doe",
    email: "alex.doe@example.com",
    initials: "AD",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    vehicle: "Tesla Model Y",
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
               <div className="flex items-center">
                <Car className="mr-3 h-5 w-5" />
                <span>Vehicle: <strong>{user.vehicle}</strong></span>
              </div>
              <div className="flex items-center">
                <CreditCard className="mr-3 h-5 w-5" />
                <span>Payment: <strong>Visa **** 4242</strong></span>
              </div>
              <Button variant="outline" className="w-full mt-4">Edit Profile</Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
              <CardDescription>A record of all your past and upcoming charging sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Station</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.stationName}</TableCell>
                      <TableCell>{booking.date} at {booking.time}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            booking.status === 'Confirmed' ? 'default' :
                            booking.status === 'Completed' ? 'secondary' :
                            'destructive'
                          }
                          className={cn({
                            'bg-blue-500 hover:bg-blue-600': booking.status === 'Confirmed',
                            'bg-green-500 hover:bg-green-600': booking.status === 'Completed',
                          })}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
