
# Step 1: Use a base image
FROM python:3.11-slim

# Step 2: Set the working directory inside the container
WORKDIR /python_backend

# Step 3: Copy application files into the container
COPY . /python_backend

# Step 4: Install system libraries required for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Step 5: Set the library path for OpenCV dependencies
ENV LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:/usr/local/lib

# Step 6: Copy dependency file into the container
COPY requirements.txt /python_backend

# Step 7: Install Python dependenci
EXPOSE 5000

# Step 7: Define the command to run the application
CMD ["python", "app.py"]
