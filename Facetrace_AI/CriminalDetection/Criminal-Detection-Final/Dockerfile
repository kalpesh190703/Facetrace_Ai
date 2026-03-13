# Use Python 3.11 (or any version >=3.10)
FROM python:3.11

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    cmake \
    g++ \
    libopenblas-dev \
    libsqlite3-dev \
    libboost-all-dev \
    libopencv-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . .

# Set the default command to run the app
CMD ["python", "app.py"]  # Change this based on your application
