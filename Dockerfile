FROM python:3.6

# Necessary env var and port
ENV PYTHONUNBUFFERED 1
EXPOSE 8000

# Create project directory
RUN mkdir -p /sasha
WORKDIR /sasha

# Install requirements
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# Copy all files
COPY src ./src

# Run migrations and collectstatic
# RUN python src/manage.py migrate
RUN python src/manage.py collectstatic --noinput

# Start webserver (not fit for production)
CMD python src/manage.py runserver 0.0.0.0:8000
