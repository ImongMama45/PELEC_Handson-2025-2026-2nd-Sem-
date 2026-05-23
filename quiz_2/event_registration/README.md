# Event Registration System

A simple Django event registration system built for FINALS HANDS-ON QUIZ #2.

## Features
- Register for an event via a secure Django form
- Custom validation on all fields
- CSRF protection
- SQLite database storage

## Validation Rules
| Field | Rule |
|---|---|
| Full Name | Minimum 5 characters |
| Email | Must end with `@gmail.com` |
| Age | Must be 18 or above |
| Password | Minimum 8 characters |

## Project Structure
```
event_registration/
├── manage.py
├── requirements.txt
├── db.sqlite3
├── event_registration/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── events/
    ├── models.py        # EventRegistration model
    ├── forms.py         # ModelForm with custom validation
    ├── views.py         # register & success views
    ├── urls.py          # URL routing
    ├── migrations/
    └── templates/
        └── events/
            ├── register.html
            └── success.html
```

## Local Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd event_registration

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Apply migrations
python manage.py migrate

# 5. Run the development server
python manage.py runserver
```

Visit: http://127.0.0.1:8000/

## PythonAnywhere Deployment

1. Upload project files to PythonAnywhere via the Files tab
2. Open a Bash console and run:
   ```bash
   pip install --user django
   cd ~/event_registration
   python manage.py migrate
   ```
3. Go to **Web** tab → Add a new web app → Manual configuration → Python 3.x
4. Set **Source code**: `/home/<username>/event_registration`
5. Set **Working directory**: `/home/<username>/event_registration`
6. Edit **WSGI file** — replace contents with:
   ```python
   import os
   import sys
   path = '/home/<username>/event_registration'
   if path not in sys.path:
       sys.path.append(path)
   os.environ['DJANGO_SETTINGS_MODULE'] = 'event_registration.settings'
   from django.core.wsgi import get_wsgi_application
   application = get_wsgi_application()
   ```
7. Reload the web app

> ⚠️ Make sure `ALLOWED_HOSTS = ['*']` is set in `settings.py` for PythonAnywhere to work.
