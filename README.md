##  Installation & Running Locally

 **Clone the repository**

git clone <your-repository-url>
cd receipt-processor-challenge

 **Install dependencies**

npm install

**Run the server**
node server.js

**Server runs on**: `http://localhost:8080`

## Running with Docker
**Build the Docker image**
docker build -t receipt-processor .

**Run the container**
docker run -p 8080:8080 receipt-processor

**API is now running at:** `http://localhost:8080`
