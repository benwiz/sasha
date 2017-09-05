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

# Copy all files (using volumes for development to make bulding faster)
COPY src ./src

# # Run migrations and collectstatic
# RUN python src/manage.py migrate
# RUN python src/manage.py collectstatic --noinput

# Env vars
ENV FB_ACCOUNT sasha.benwiz@gmail.com
ENV GOOGLE_SHEETS_API_CLIENT_ID 675295018302-uh6snposhcp1bqffgatnq7n3on3h3819.apps.googleusercontent.com

# Start webserver (not fit for production)
CMD python src/manage.py runserver 0.0.0.0:8000
