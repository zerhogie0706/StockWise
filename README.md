# StockWise - AI Strategy Screener

This project is a stock recommendation MVP that combines technical analysis strategies with AI insights using the Gemini API.

## Project Architecture

*   **Frontend**: React (Vite/CRA), Tailwind CSS, Recharts.
*   **Backend**: Django (Python), Django REST Framework.
*   **Database**: PostgreSQL (Production) / SQLite (Local Dev).
*   **Auth**: Google OAuth2 (Identity Services).
*   **AI**: Google Gemini API via `@google/genai`.

---

## 🚀 Part 1: Running the Frontend (Current Environment)

The files in this repository represent the **Frontend**.

1.  **Setup**: Ensure you have a Google Cloud Client ID for authentication.
2.  **API Key**: Ensure `process.env.API_KEY` is set for Gemini API access.
3.  **Run**:
    *   If using a local Node environment: `npm install && npm start`
    *   In a sandbox: The environment handles the build process.

---

## 🐍 Part 2: Django Backend Setup (Python)

Since the current environment is frontend-only, here is the blueprint to create the Backend.

### 1. Prerequisites
*   Python 3.9+
*   `pip install django djangorestframework django-cors-headers google-auth`

### 2. Project Initialization
```bash
django-admin startproject stockwise_backend
cd stockwise_backend
python manage.py startapp api
```

### 3. Database Models (`api/models.py`)

```python
from django.db import models
from django.contrib.auth.models import User

class Stock(models.Model):
    symbol = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255)
    market = models.CharField(max_length=10, choices=[('US', 'US'), ('TW', 'TW')])
    
    def __str__(self):
        return self.symbol

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'stock')
```

### 4. API Views (`api/views.py`)

```python
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from google.oauth2 import id_token
from google.auth.transport import requests
from .models import Stock, Watchlist

CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get('token')
    try:
        # Verify token with Google
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        email = idinfo['email']
        name = idinfo.get('name', '')
        
        # Get or create user
        user, created = User.objects.get_or_create(username=email, defaults={'email': email, 'first_name': name})
        
        # Return simple session info (in real app, return JWT access token)
        return Response({
            'id': user.id,
            'name': user.first_name,
            'email': user.email,
            'is_superuser': user.is_superuser
        })
    except ValueError:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class WatchlistViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)
        
    # Implement create/delete logic here...
```

### 5. URLs (`stockwise_backend/urls.py`)

```python
from django.contrib import admin
from django.urls import path, include
from api.views import google_login

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/google/', google_login),
    # Add router urls for viewsets...
]
```

### 6. Running Locally

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

---

## 🔑 Google Authentication Setup

To make the login button work locally:

1.  Go to **Google Cloud Console**.
2.  Create a new project and configure the **OAuth Consent Screen**.
3.  Create Credentials -> **OAuth Client ID** (Web Application).
4.  Add `http://localhost:3000` (or your dev url) to **Authorized JavaScript origins**.
5.  Copy the **Client ID**.
6.  Paste the Client ID into `components/Tutorial.tsx` in the frontend code.
