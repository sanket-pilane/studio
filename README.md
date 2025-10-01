# ⚡ ChargeSpot Navigator ⚡

Welcome to **ChargeSpot Navigator**, your smart guide to finding the best spot to charge your electric vehicle. This app makes it simple to locate, book, and manage your EV charging, all with the help of a friendly AI assistant.

![ChargeSpot Navigator UI Screenshot](https://images.unsplash.com/photo-1707758283398-7df21adba23a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjaGFyZ2luZyUyMHN0YXRpb258ZW58MHx8fHwxNzU5MTM5NzE3fDA&ixlib=rb-4.1.0&q=80&w=1080)
*<p align="center">Find your next charge with ease.</p>*

---

## ✨ What Does It Do? (Features)

- **Find Stations on a Map**: See all nearby charging stations on a live, interactive map.
- **Get Smart Recommendations**: Ask our AI assistant to find the best station for you. It considers your location, the time, and your car's needs to give you a personalized recommendation.
- **See Live Availability**: Check how many chargers are free at a station before you go.
- **Book Your Spot**: Reserve a charging spot right from the app so it's waiting for you when you arrive.
- **Manage Your Profile**: Create an account, save your vehicle details, and see a history of all your past bookings.
- **Admin Tools**: A special dashboard for station owners to add and manage their charging locations.

---

## 🚀 How It's Built (Technology)

This app uses a set of modern and powerful tools to deliver a smooth experience:

- **The App's Core (Framework)**: **Next.js** is used to build the app, making it fast and responsive.
- **Artificial Intelligence (AI)**: **Genkit**, a toolkit from Google, powers our smart AI assistant that recommends charging stations.
- **Database and User Accounts**: **Firebase** securely stores all the data (like station info and bookings) and handles user logins.
- **Look and Feel (UI)**:
    - **ShadCN/UI** provides the clean, modern buttons, forms, and cards you see throughout the app.
    - **Tailwind CSS** helps us style everything to look great on any device.
- **The Map**: **Google Maps** is used to display the interactive map and help with directions.

---

## 🏁 Getting Started (For Developers)

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
