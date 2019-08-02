echo "Waiting for PostgreSQL"
sleep 10
echo "PostgreSQL is up - executing command"
exec bash -c "python manage.py migrate && gunicorn --reload system.wsgi -b 0.0.0.0:3031"