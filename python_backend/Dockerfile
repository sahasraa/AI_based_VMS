# Use a lightweight Python image
FROM python:3.9-slim

# Set the working directory
WORKDIR /python_backend

# Copy all application files
COPY . .

# Debug: List files to ensure requirements.txt is present
RUN ls -l /python_backend

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install OpenCV Python packages
RUN pip install --no-cache-dir opencv-python opencv-contrib-python

# Install other Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose Flask and FastAPI ports
EXPOSE 5000 8000

# Run the application
CMD ["python", "app.py"]










#bagaa time pattesthundi ga aithundhi 
# wait i will check

































# # Step 1: Use a base image
# FROM python:3.8-slim

# # Step 2: Set the working directory inside the container
# WORKDIR /python_backend

# # Step 3: Copy application files into the container
# COPY . /python_backend

# # Step 4: Install system libraries required for OpenCV
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     libgl1-mesa-glx \
#     libglib2.0-0 \
#     libsm6 \
#     libxext6 \
#     libxrender-dev \
#     python3-opencv \
#     libopencv-dev \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# # Step 5: Set the library path for OpenCV dependencies
# ENV LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:/usr/local/lib

# # Step 6: Copy dependency file into the container
# COPY re











