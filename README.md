# Fork & Friends Client Side

![React](https://img.shields.io/badge/React-19.0+-blue)
![React Router](https://img.shields.io/badge/React_Router-7.0+-CA4245)
![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-38B2AC)
![D3.js](https://img.shields.io/badge/D3.js-7.0+-F9A03C)

Fork & Friends is a comprehensive data analysis and social recommendation platform leveraging the Yelp dataset. Built with React and modern web technologies, this platform combines big data analytics with AI-powered recommendations to help users discover new restaurants, connect with like-minded food enthusiasts, and explore dining trends across metropolitan areas. The platform processes over 6.6 million reviews and 192,000+ businesses to deliver intelligent insights and personalized recommendations.

## Important Links

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-2ea44f?style=for-the-badge&logo=vercel)](https://fork-and-friends.onrender.com/)
[![Client Repository](https://img.shields.io/badge/Client_Code-GitHub-blue?style=for-the-badge&logo=github)](https://github.com/NasimRanaFeroz/Fork-Friends_Front-End)
[![Server Repository](https://img.shields.io/badge/Server_Code-GitHub-blue?style=for-the-badge&logo=github)](https://github.com/mdnezam-uddin/Fork-Friends_Back-End)
[![Data Analysis](https://img.shields.io/badge/Big_Data_Analysis-GitHub-orange?style=for-the-badge&logo=github)](https://github.com/azizerorahman/Fork-Friends_Yelp-Analysis)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Features

- **Comprehensive Data Analytics**: Interactive dashboards for business, user, review, rating, and check-in analysis
- **AI-Powered Recommendations**: DeepSeek AI integration for intelligent friend and business suggestions
- **Advanced Data Visualizations**: D3.js powered charts, graphs, and interactive maps
- **Multi-Analysis Dashboard**: Six different analysis modules with detailed insights
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Real-time Data Processing**: Live updates from big data processing pipeline
- **Geographic Analysis**: Location-based insights across 10 metropolitan areas
- **Sentiment Analysis**: NLP-powered review sentiment and word association analysis
- **Social Network Features**: Friend recommendations based on dining preferences
- **Interactive Word Clouds**: Dynamic visualization of review content using POS tagging
- **Collaborative Filtering**: Advanced recommendation algorithms for personalized suggestions
- **Framer Motion Animations**: Smooth, engaging user interface animations

## Technologies Used

- **React**: Frontend library for building the user interface
- **Vite**: Next-generation frontend build tool for fast development
- **React Router**: Navigation and routing for single-page application
- **Tailwind CSS & DaisyUI**: Utility-first CSS framework with component library
- **D3.js**: Data visualization library for interactive charts and maps
- **Framer Motion**: Animation library for smooth UI transitions
- **Leaflet & React Leaflet**: Interactive maps for geographic data visualization
- **Axios**: HTTP client for API communication
- **Lucide React**: Modern icon library
- **EmailJS**: Client-side email service integration
- **React Icons**: Comprehensive icon library

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- The Fork & Friends backend API running (see [Server Repository](https://github.com/mdnezam-uddin/Fork-Friends_Back-End))

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/NasimRanaFeroz/Fork-Friends_Front-End.git
   cd Fork-Friends_Front-End
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory:

   ```env
   # API Configuration
   REACT_APP_API_BASE_URL=your_backend_api_url
   
   # EmailJS Configuration
   REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # Note: Due to special characters in folder path, you may need to run:
   node "node_modules/vite/bin/vite.js"
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

| Variable | Description |
|----------|-------------|
| REACT_APP_API_BASE_URL | Backend API base URL for data fetching |
| REACT_APP_EMAILJS_SERVICE_ID | EmailJS service ID for contact form |
| REACT_APP_EMAILJS_TEMPLATE_ID | EmailJS template ID for email formatting |
| REACT_APP_EMAILJS_PUBLIC_KEY | EmailJS public key for authentication |

## Usage

### Home Page

The main interface displays platform overview, featured analytics, team information, and quick access to analysis dashboards and recommendation services.

### Data Analysis Dashboard

Navigate to `/data-analysis` to access six comprehensive analysis modules:

#### Business Analysis

- Top merchants identification across the U.S.
- City and state rankings by merchant density
- Merchant ratings and category analysis
- Restaurant type exploration (Chinese, American, Mexican, etc.)

#### User Analysis

- User growth trends and yearly statistics
- Elite vs. regular user comparisons
- Top reviewers and most popular users identification
- User engagement metrics and silent vs. active user analysis

#### Review Analysis

- Yearly review trend analysis
- Sentiment analysis and word frequency studies
- Word association analysis and common phrases
- Interactive word clouds with POS tagging
- Positive and negative sentiment breakdowns

#### Rating Analysis

- Rating distribution analysis (1-5 stars)
- Five-star business identification
- Weekly rating patterns and trends
- Business rating evolution over time

#### Check-in Analysis

- Check-in patterns across different time periods
- City-wise check-in analysis
- Yearly check-in trends and growth

#### Comprehensive Analysis

- Integrated multi-dimensional analysis
- Cross-dataset insights and correlations
- Top merchants by city with combined metrics

### Recommendation Systems

#### Friend Recommendations (`/friend-recommendation`)

- AI-powered friend suggestions based on dining preferences
- Collaborative filtering using similar ratings and reviews
- Interest-based matching through DeepSeek AI integration
- Social network analysis for connection recommendations

#### Business Recommendations (`/business-recommendation`)

- Personalized restaurant suggestions
- Location-based recommendations with map integration
- Cuisine preference analysis and matching
- User profile-based collaborative filtering

### Additional Features

#### About Us (`/about-us`)

Learn about the team, project vision, and the comprehensive Yelp dataset including:

- 6,685,900 reviews analyzed
- 192,609 businesses processed
- 200,000+ pictures catalogued
- Data from 10 major metropolitan areas

## Project Structure

```text
Fork-Friends_Front-End/
├── node_modules/
├── public/
│   ├── index.html
│   ├── favicon.png
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── business/
│   │   ├── checkin/
│   │   ├── comprehensive/
│   │   ├── rating/
│   │   ├── review/
│   │   ├── user/
│   │   ├── BusinessAnalysis.jsx
│   │   ├── CheckInAnalysis.jsx
│   │   ├── ComprehensiveAnalysis.jsx
│   │   ├── Footer.jsx
│   │   ├── ImageSlider.jsx
│   │   ├── Navbar.jsx
│   │   ├── RatingAnalysis.jsx
│   │   ├── ReviewAnalysis.jsx
│   │   └── UserAnalysis.jsx
│   ├── pages/
│   │   ├── AboutUs.jsx
│   │   ├── Analysis.jsx
│   │   ├── BusinessRecommendation.jsx
│   │   ├── FAQ.jsx
│   │   ├── Feedback.jsx
│   │   ├── FriendRecommendation.jsx
│   │   ├── Home.jsx
│   │   └── LegalPage.jsx
│   ├── assets/
│   │   ├── ...
│   │   ├── reality.png
│   │   └── restaurant.png
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## Contributors

- **[Azizur Rahman](https://github.com/azizerorahman/)** - Project Lead & Full-Stack Developer
- **[Nasim Rana Feroz](https://github.com/nasimranaferoz/)** - Frontend Developer & UI/UX Designer
- **[MD Nezam Uddin](https://github.com/mdnezamuddin/)** - Backend Developer & Database Engineer

[![Contributors](https://contrib.rocks/image?repo=NasimRanaFeroz/Fork-Friends_Front-End)](https://github.com/NasimRanaFeroz/Fork-Friends_Front-End/graphs/contributors)

---

**Note**: This project processes publicly available [Yelp dataset](https://business.yelp.com/data/resources/open-dataset/) for educational and research purposes. All data analysis and recommendations are based on anonymized user data and publicly accessible business information.
