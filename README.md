# ⚡ ChargeSpot Navigator ⚡

Welcome to **ChargeSpot Navigator**, a modern, AI-powered web application designed to help electric vehicle owners find the perfect charging station for their needs. Built with a cutting-edge tech stack, this app provides a seamless and intuitive user experience.

![ChargeSpot Navigator UI Screenshot](https://images.unsplash.com/photo-1707758283398-7df21adba23a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjaGFyZ2luZyUyMHN0YXRpb258ZW58MHx8fHwxNzU5MTM5NzE3fDA&ixlib=rb-4.1.0&q=80&w=1080)
*<p align="center">Find your next charge with ease.</p>*

---

## ✨ Features

- **Interactive Map View**: Browse charging stations on a fast, interactive map powered by Google Maps.
- **AI-Powered Recommendations**: Let our Genkit-powered AI find the best station for you based on your location, time, and connector type.
- **Real-time Availability**: See live data on how many chargers are available at each station.
- **User Authentication**: Secure sign-up and login functionality using Firebase Authentication.
- **User Profiles**: Manage your profile and view your booking history.
- **Simple Booking System**: Reserve a charging spot directly from the app.
- **Admin Dashboard**: A dedicated dashboard for operators to add, edit, and manage their charging stations in real-time.

---

## 🚀 Tech Stack

This project is built with a modern, component-based architecture using the following technologies:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **AI/Generative**: [Genkit](https://firebase.google.com/docs/genkit)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Mapping**: [Google Maps Platform](https://mapsplatform.google.com/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)

---

## 🏁 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Google Maps API key:
    ```env
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.

---

## 🛠️ Admin Access

To access the operator dashboard for managing stations, use the following credentials:

- **Email**: `admin@example.com`
- **Password**: `password`
