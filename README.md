# Yelp Data Analysis & Recommendation System

## Project Overview
This project analyzes the Yelp dataset to extract insights about businesses, users, and reviews, and develops a recommendation system using big data techniques and the ChatGPT API. The system provides friend recommendations and business recommendations based on user behavior and preferences.

## Dataset
The project uses the Yelp dataset, which includes:
- 6,685,900 reviews
- 192,609 businesses
- 200,000 pictures
- Data from 10 metropolitan areas

## Data Structure
- **Users**: User profiles, review counts, friends, etc.
- **Businesses**: Business information, location, ratings, etc.
- **Reviews**: User reviews, ratings, and feedback
- **Check-ins**: User check-in data at businesses

## Features

### Data Analysis & Visualization

#### Business Analysis
- Most common merchants in the U.S.
- Top cities and states with most merchants
- Average ratings analysis
- Category distribution and analysis
- Restaurant type analysis

#### User Analysis
- User growth trends
- Top reviewers and popular users
- Elite user analysis
- User activity statistics

#### Review Analysis
- Review trends over time
- Sentiment analysis
- Word frequency and association analysis
- Natural language processing insights

#### Rating & Check-in Analysis
- Rating distribution
- Temporal patterns in check-ins
- Popular check-in locations

### Recommendation System

#### Friend Recommendation
- Collaborative filtering-based recommendations
- Interest-based recommendations using ChatGPT API
- Graph-based social network recommendations

#### Business Recommendation
- Personalized recommendations using collaborative filtering
- NLP-based recommendations with ChatGPT
- Location-based recommendations
- Interactive chat-based search

## Technologies Used
- Python for data processing and analysis
- Big Data frameworks (Spark, Hadoop)
- Machine Learning libraries
- ChatGPT API for natural language processing
- Data visualization tools

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js (for backend)
- Vite (for frontend)
- Access to ChatGPT API

### Installation

#### Clone the repository
```bash
git clone https://github.com/NasimRanaFeroz/Fork-Friends_Front-End.git
cd fork-and-friend
```

#### Install frontend dependencies
```bash
cd ../fork-&-friend-fe
npm install
```

#### Set up environment variables
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

### Running the Application

#### Start the backend server
```bash
cd backend
npm start
```

#### Start the frontend development server
```bash
cd ../fork-&-friend-fe
npm run dev
```

## Features
- Interactive data visualizations
- Friend recommendation system
- Business recommendation system
- Chat-based user interface with ChatGPT integration
- Personalized user experience

## License
This project is for educational purposes only. The Yelp dataset is subject to Yelp's terms of use.

## Acknowledgements
- Yelp for providing the dataset
- OpenAI for ChatGPT API