# Assignment: Build a Weather App with Real-Time Data and Business Logic

---

## Goal

Create a **full-stack Weather App** where users can search for weather data by city and view additional contextual insights, such as outfit recommendations and sunrise/sunset calculations.

The app should showcase proficiency in:

- **Next.js** (frontend & backend)
- **PostgreSQL** (persistent storage)
- **State Management** (client-side)
- **External API Integration** (weather data)

---

## Requirements

### Frontend

#### Framework

Use **Next.js** with the App Router.

#### Pages

| #   | Page                    | Description                                                                                                                         |
| --- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Home Page**           | Input to search for a city. Display the current weather and a brief **3-day forecast** for the searched city.                       |
| 2   | **Weather Details Page** | Detailed weather data (wind speed, humidity, UV index, sunrise/sunset). Personalized recommendations based on weather conditions.   |
| 3   | **Favorites Page**      | View a list of favorite cities and quickly access weather details for them.                                                         |

#### State Management

- Use a state management library of your choice (e.g., **MobX + MobX-State-Tree**, **Zustand**).
- Clearly explain **why** you chose the library.

#### UI/UX

- Ensure **responsive design** for desktop and mobile.
- Provide **loading indicators** for API requests and **graceful error handling**.

---

### Backend

#### API

- Use **Next.js API routes** to interact with an external weather API and manage city favorites.
- Fetch weather data from a free external weather API like [OpenWeatherMap](https://openweathermap.org/) or [WeatherAPI](https://www.weatherapi.com/).

#### Database

Use **PostgreSQL** to store the following:

##### 1. Favorite Cities

| Column       | Type        | Notes              |
| ------------ | ----------- | ------------------ |
| `id`         | Primary Key | Auto-generated     |
| `city_name`  | String      | Name of the city   |
| `user_id`    | String      | For multi-user support |
| `created_at` | Timestamp   | Record creation time |

##### 2. Search History

| Column        | Type        | Notes              |
| ------------- | ----------- | ------------------ |
| `id`          | Primary Key | Auto-generated     |
| `search_term` | String      | The searched city  |
| `user_id`     | String      | User identifier    |
| `timestamp`   | Timestamp   | Time of search     |

---

### Business Logic

#### 1. Weather-Based Recommendations

Suggest activities or outfits based on weather conditions:

| Condition        | Recommendation              |
| ---------------- | --------------------------- |
| Cold (< 10 °C)  | "Wear a warm jacket."       |
| Raining          | "Take an umbrella."         |
| Sunny (> 25 °C) | "Wear sunglasses."          |

#### 2. Sunrise & Sunset Time

- Convert sunrise and sunset times from **UTC** to the **user's local timezone** and display them.

#### 3. Caching Strategy

- Cache weather data for a city for **10 minutes** to reduce redundant API calls.
- Serve cached data when available and **refresh it in the background**.

---

### External API Integration

#### Weather API

- Fetch **real-time weather data** using an external weather API.
- Include both **current weather** and a **3-day forecast**.

#### Geolocation API

- On the Home Page, use the user's **geolocation** (via the browser) to show the weather for their current location by default.

---

## Deliverables

| #   | Deliverable          | Details                                                                                                 |
| --- | -------------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | **Codebase**         | GitHub repository with clear commit messages and a README containing: setup instructions, state management rationale, caching explanation. Add `AGENTS.md` / `CLAUDE.md`. |
| 2   | **Database Schema**  | SQL scripts or migration files for PostgreSQL tables.                                                   |
| 3   | **Deployed App**     | Deploy on **Vercel** or **Render** using **GitHub Actions** as the CD process. Provide the URL.         |
