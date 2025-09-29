# **App Name**: ChargeSpot Navigator

## Core Features:

- User Authentication: Secure user registration and login using NextAuth.js with JWT. 
- Map Display: Display a map centered on the user's location with nearby charging stations marked using the Google Maps API.
- Station Details: Show detailed information about each charging station (name, address, availability, price, rating) on marker click.
- Directions: Integrate with the Google Maps Directions API to provide users with directions and ETA to the selected charging station.
- Station Information Tool: Based on historical booking trends and real-time availability data of local stations, use an LLM tool to advise the user on stations best suited for them at a given time.
- User Profile: Display user information and booking history.

## Style Guidelines:

- Primary color: Saturated cyan (#00BCD4) to evoke a sense of energy and forward motion associated with electric vehicles.
- Background color: Light cyan (#E0F7FA) for a clean and modern feel.
- Accent color: Electric purple (#BF5FFF) to draw attention to key interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a machined, objective look, will be used for all text.
- Use modern, minimalist icons to represent charging stations and related actions.
- Maintain a clean and intuitive layout that is easy to navigate on both desktop and mobile devices.
- Subtle animations to indicate loading states and interactive feedback.