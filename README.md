# Metrall
## Overview
An AI-powered app that aggregates and simplifies access to local public information, focusing initially on Los Angeles as our proof of concept. The app will integrate various data sources, including city council meetings, local news, events, and other city-related information.
ga
## Architecture Components
### 1. **Frontend and Backend (Next.js / Python)**
   - **Frontend**: Serves the user interface, allowing users to input queries and receive results in a clean and responsive manner.
   - **Backend**: Python Handles API requests, processes user inputs, and orchestrates data flow between different services.

### 2. **Database (PostgreSQL)**
   - **PostgreSQL**: The backend stores structured data and user interaction history using a PostgreSQL database.
   - **Schema**: Data related to user queries, responses, and relevant metadata is maintained for personalization and improved user experience.

### 3. **LLM Processing (LLaMA)**
   - **Model**: The application leverages [LLaMA](https://ai.meta.com/llama/) for generating intelligent responses based on user queries.
   - **Use Case**: LLaMA processes the combined data from the Pinecone database and external APIs to formulate concise, contextually relevant responses.

### 4. **External APIs for Data Collection**
   - **Local Government Data API**: Provides additional context about regulations and updates specific to Los Angeles County.
   - **Data Integration**: The backend collects data from these APIs, preprocesses it, and feeds it into the LLaMA model for response generation.

## Data Flow
1. **User Query**: Users input a question through the frontend.
2. **Backend Processing**: The query is sent to the backend, where it is parsed and validated.
4. **LLM Response Generation**: The LLaMA model processes the aggregated data and generates a response.
5. **Frontend Display**: The response is displayed to the user in an easy-to-read format.


## Technologies Used
- **Frontend**: Typescript / Next.js
- **Backend**: Python
- **Database**: PostgreSQL
- **Language Model**: LLaMA (Meta's LLM)
- **External Data Sources**: Multiple APIs for real-time data collection (e.g., law updates, government databases)


### 1. **API Endpoints**
   - **User Queries**: `GET /query`
     - Receives user queries from the frontend.
     - Validates and processes the input before initiating data retrieval and response generation.

### 2. **Data Aggregation Layer**
   - A dedicated data aggregation module will orchestrate calls to INCOMPLETE

## Future Improvements
- **User Authentication**: Adding secure user login to personalize responses further.
- **Caching**: Implementing caching to reduce latency for frequently requested information.
- **Expanded Data Sources**: Integrating more APIs to enhance response comprehensiveness.

### Contributors
https://github.com/trigunshin

https://github.com/bootstrapt

https://github.com/celinalou92

https://github.com/edoda


