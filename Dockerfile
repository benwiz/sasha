# FROM python:3.6
FROM jaymoulin/rpi-python:3.6

# For jaymoulin/rpi-python:3.6
RUN apt-get install -y python3-pip

# Necessary env var and port
ENV PYTHONUNBUFFERED 1
EXPOSE 8000

# Create project directory
RUN mkdir -p /sasha
WORKDIR /sasha

RUN apt-get update && apt-get install -y \
		gcc \
		gettext \
		mysql-client libmysqlclient-dev \
		postgresql-client libpq-dev \
		sqlite3 \
	--no-install-recommends && rm -rf /var/lib/apt/lists/*

# Install requirements
# COPY ./requirements.txt .
# RUN pip3 install -r requirements.txt
RUN pip3 install mysqlclient sqlite3 psycopg2 django

# Copy all files
COPY src ./src

# # Run migrations and collectstatic
# RUN python src/manage.py migrate
# RUN python src/manage.py collectstatic --noinput

# Start webserver (not fit for production)
CMD python3 src/manage.py runserver 0.0.0.0:8000
