# Fork & Friends
## Eat Together, Share Together

## Overview

Fork & Friends is a data analysis and recommendation platform leveraging the Yelp dataset. It combines big data analytics with DeepSeek AI to provide intelligent friend and business recommendations.

## About the Yelp Dataset

The Yelp dataset used in this project includes:

- 6,685,900 reviews
- 192,609 businesses
- 200,000 pictures
- Data from 10 metropolitan areas

This dataset is publicly available for educational and academic purposes.

## Core Features

### Data Analysis & Visualization

#### Business Analysis
- Identify top merchants across the U.S.
- City and state rankings by merchant density
- Analyze merchant ratings and categories
- Explore restaurant types (e.g., Chinese, American, Mexican)

#### User Analysis
- Track user growth trends by year
- Compare elite vs. regular users
- Identify top reviewers and popular users

#### Review Analysis
- Analyze yearly review trends
- Perform sentiment analysis on reviews
- Conduct word frequency and association analysis
- Generate word clouds using POS tagging

#### Rating & Check-in Analysis
- Examine rating distributions (1-5 stars)
- Analyze weekly and hourly check-in patterns
- Highlight top businesses by ratings and check-ins

### AI-Powered Recommendation System

#### Friend Recommendation
- Collaborative filtering based on similar ratings and preferences
- Interest-based recommendations using DeepSeek AI
- Graph-based social network recommendations

#### Business Recommendation
- User profile analysis and collaborative filtering
- NLP-based recommendations via DeepSeek
- Location-based suggestions

## Technologies Used

- **Big Data Processing**: Apache Spark, Hadoop
- **AI Integration**: DeepSeek API for NLP and recommendations
- **Data Visualization**: D3.js, Framer Motion
- **Backend**: Python, Flask, Node.js, Express
- **Frontend**: React.js, Tailwind CSS

## Data Structure

### Users
Includes identifiers, activity metrics, social connections, and reputation indicators.

### Businesses
Contains location, ratings, categories, and operational details.

### Reviews & Check-ins
Captures user opinions, engagement metrics, and temporal patterns of business visits.

## Key Features Implementation

### Friend Recommendation System
Analyzes user behavior, review similarities, and social connections to suggest friends with shared interests.

### Business Recommendation Engine
Uses collaborative filtering and DeepSeek NLP to provide personalized business suggestions based on user preferences and context.

### Interactive Data Visualizations
Offers dashboards to visualize business trends, user growth, and review patterns, delivering insights for users and business owners.

## Future Development

- Integrate additional data sources
- Enhance recommendation algorithms
- Add real-time analytics
- Implement geospatial analysis features

## Contributors

- Azizur Rahman Jamim - Project Lead
- Nasim Rana Feroz - Frontend Developer
- MD Nezam Uddin - Backend Developer

## License

This project is licensed under the MIT License. See the LICENSE file for details.
