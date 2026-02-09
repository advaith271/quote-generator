# Motivational Quotes App - Complete Code

A standalone learning project: React Native for Web + Django REST Framework + Firebase Auth.

---

## Folder Structure

```
quotes-app/
├── quotes-frontend/
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── tsconfig.json
│   ├── package.json
│   ├── firebaseConfig.ts
│   └── src/
│       ├── screens/
│       │   ├── LoginScreen.tsx
│       │   ├── HomeScreen.tsx
│       │   └── LikedQuotesScreen.tsx
│       ├── navigation/
│       │   └── AppNavigator.tsx
│       ├── services/
│       │   ├── api.ts
│       │   └── auth.ts
│       ├── contexts/
│       │   └── AuthContext.tsx
│       └── types/
│           └── index.ts
│
├── quotes-backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── firebase-service-account.json   (gitignored)
│   ├── quotes_project/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── quotes/
│       ├── __init__.py
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── admin.py
│       ├── apps.py
│       ├── firebase_auth.py
│       └── management/
│           └── commands/
│               └── seed_quotes.py
│
└── .gitignore
```

---

## Setup Commands

### Backend
```bash
mkdir quotes-app && cd quotes-app
mkdir quotes-backend && cd quotes-backend
python -m venv venv
venv\Scripts\activate
pip install django djangorestframework firebase-admin django-cors-headers
pip freeze > requirements.txt
django-admin startproject quotes_project .
python manage.py startapp quotes
mkdir -p quotes/management/commands
```

### Frontend
```bash
cd quotes-app
npx create-expo-app quotes-frontend --template blank-typescript
cd quotes-frontend
npx expo install react-native-web react-dom @expo/metro-runtime
npm install firebase @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler
mkdir -p src/screens src/navigation src/services src/contexts src/types
```

---

## Backend Code

### `quotes-backend/requirements.txt`
```
Django==5.1.7
djangorestframework==3.15.2
firebase-admin==6.7.0
django-cors-headers==4.4.0
psycopg2-binary==2.9.9
```

### `quotes-backend/quotes_project/settings.py`
```python
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-change-this-in-production"

DEBUG = True

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "quotes",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "quotes_project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "quotes_project.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "postgres",
        "USER": "postgres",
        "PASSWORD": "YOUR_RDS_PASSWORD",
        "HOST": "django-db.clieeewaki2o.ap-south-2.rds.amazonaws.com",
        "PORT": "5432",
    }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Firebase
FIREBASE_SERVICE_ACCOUNT_PATH = BASE_DIR / "firebase-service-account.json"

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "http://localhost:19006",
    "http://localhost:19000",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "authorization",
    "content-type",
    "origin",
    "x-requested-with",
]

# DRF
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": [],
}
```

### `quotes-backend/quotes_project/urls.py`
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("quotes.urls")),
]
```

### `quotes-backend/quotes_project/wsgi.py`
```python
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "quotes_project.settings")
application = get_wsgi_application()
```

### `quotes-backend/quotes_project/asgi.py`
```python
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "quotes_project.settings")
application = get_asgi_application()
```

### `quotes-backend/quotes_project/__init__.py`
```python
```

### `quotes-backend/quotes/apps.py`
```python
from django.apps import AppConfig

class QuotesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "quotes"
```

### `quotes-backend/quotes/models.py`
```python
from django.db import models


class Quote(models.Model):
    text = models.TextField()
    author = models.CharField(max_length=200, default="Unknown")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "quotes"

    def __str__(self):
        return f'"{self.text}" — {self.author}'


class LikedQuote(models.Model):
    firebase_uid = models.CharField(max_length=128, db_index=True)
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name="likes")
    liked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "liked_quotes"
        unique_together = ("firebase_uid", "quote")
        ordering = ["-liked_at"]

    def __str__(self):
        return f"{self.firebase_uid} liked quote {self.quote_id}"
```

### `quotes-backend/quotes/serializers.py`
```python
from rest_framework import serializers
from .models import Quote, LikedQuote


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ["id", "text", "author"]


class LikedQuoteSerializer(serializers.ModelSerializer):
    quote = QuoteSerializer(read_only=True)

    class Meta:
        model = LikedQuote
        fields = ["id", "quote", "liked_at"]
```

### `quotes-backend/quotes/firebase_auth.py`
```python
import functools
from pathlib import Path

from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin.credentials import Certificate

_app = None


def get_firebase_app():
    global _app
    if _app is None:
        cred = Certificate(str(settings.FIREBASE_SERVICE_ACCOUNT_PATH))
        try:
            _app = firebase_admin.get_app(name="QuotesApp")
        except ValueError:
            _app = firebase_admin.initialize_app(credential=cred, name="QuotesApp")
    return _app


class FirebaseUser:
    """Lightweight user object for DRF. No Django User model needed."""

    def __init__(self, uid, email=None):
        self.uid = uid
        self.email = email
        self.is_authenticated = True


class FirebaseAuthentication(BaseAuthentication):
    """
    DRF authentication class that verifies Firebase ID tokens.
    Extracts Bearer token from the Authorization header,
    verifies it with firebase-admin, and returns a FirebaseUser.
    """

    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split("Bearer ")[1]
        try:
            decoded = firebase_auth.verify_id_token(token, app=get_firebase_app())
        except Exception:
            raise AuthenticationFailed("Invalid or expired Firebase token")

        user = FirebaseUser(uid=decoded["uid"], email=decoded.get("email"))
        return (user, None)
```

### `quotes-backend/quotes/views.py`
```python
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Quote, LikedQuote
from .serializers import QuoteSerializer, LikedQuoteSerializer
from .firebase_auth import FirebaseAuthentication


class RandomQuoteView(APIView):
    """GET /api/quotes/random/ — return a single random quote."""

    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        quote = Quote.objects.order_by("?").first()
        if not quote:
            return Response({"error": "No quotes available"}, status=404)
        serializer = QuoteSerializer(quote)
        return Response(serializer.data)


class LikeQuoteView(APIView):
    """POST/DELETE /api/quotes/<id>/like/ — like or unlike a quote."""

    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, quote_id):
        quote = get_object_or_404(Quote, id=quote_id)
        _, created = LikedQuote.objects.get_or_create(
            firebase_uid=request.user.uid,
            quote=quote,
        )
        status_text = "liked" if created else "already_liked"
        return Response(
            {"status": status_text},
            status=201 if created else 200,
        )

    def delete(self, request, quote_id):
        deleted, _ = LikedQuote.objects.filter(
            firebase_uid=request.user.uid,
            quote_id=quote_id,
        ).delete()
        if deleted:
            return Response({"status": "unliked"})
        return Response({"status": "not_found"}, status=404)


class LikedQuotesView(ListAPIView):
    """GET /api/quotes/liked/ — list all liked quotes for the user."""

    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = LikedQuoteSerializer

    def get_queryset(self):
        return LikedQuote.objects.filter(
            firebase_uid=self.request.user.uid
        ).select_related("quote")
```

### `quotes-backend/quotes/urls.py`
```python
from django.urls import path
from .views import RandomQuoteView, LikeQuoteView, LikedQuotesView

urlpatterns = [
    path("api/quotes/random/", RandomQuoteView.as_view(), name="random-quote"),
    path("api/quotes/<int:quote_id>/like/", LikeQuoteView.as_view(), name="like-quote"),
    path("api/quotes/liked/", LikedQuotesView.as_view(), name="liked-quotes"),
]
```

### `quotes-backend/quotes/admin.py`
```python
from django.contrib import admin
from .models import Quote, LikedQuote


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ("id", "text", "author", "created_at")
    search_fields = ("text", "author")


@admin.register(LikedQuote)
class LikedQuoteAdmin(admin.ModelAdmin):
    list_display = ("id", "firebase_uid", "quote", "liked_at")
    list_filter = ("firebase_uid",)
```

### `quotes-backend/quotes/__init__.py`
```python
```

### `quotes-backend/quotes/management/__init__.py`
```python
```

### `quotes-backend/quotes/management/commands/__init__.py`
```python
```

### `quotes-backend/quotes/management/commands/seed_quotes.py`
```python
from django.core.management.base import BaseCommand
from quotes.models import Quote


class Command(BaseCommand):
    help = "Seed the database with motivational quotes"

    def handle(self, *args, **options):
        quotes_data = [
            ("The only way to do great work is to love what you do.", "Steve Jobs"),
            ("Innovation distinguishes between a leader and a follower.", "Steve Jobs"),
            ("Life is what happens when you're busy making other plans.", "John Lennon"),
            ("The future belongs to those who believe in the beauty of their dreams.", "Eleanor Roosevelt"),
            ("It is during our darkest moments that we must focus to see the light.", "Aristotle"),
            ("The only impossible journey is the one you never begin.", "Tony Robbins"),
            ("Success is not final, failure is not fatal: it is the courage to continue that counts.", "Winston Churchill"),
            ("Believe you can and you're halfway there.", "Theodore Roosevelt"),
            ("Act as if what you do makes a difference. It does.", "William James"),
            ("What you get by achieving your goals is not as important as what you become by achieving your goals.", "Zig Ziglar"),
            ("You miss 100% of the shots you don't take.", "Wayne Gretzky"),
            ("Whether you think you can or you think you can't, you're right.", "Henry Ford"),
            ("The best time to plant a tree was 20 years ago. The second best time is now.", "Chinese Proverb"),
            ("Your limitation is only your imagination.", "Unknown"),
            ("Push yourself, because no one else is going to do it for you.", "Unknown"),
            ("Great things never come from comfort zones.", "Unknown"),
            ("Dream it. Wish it. Do it.", "Unknown"),
            ("Don't stop when you're tired. Stop when you're done.", "Unknown"),
            ("Wake up with determination. Go to bed with satisfaction.", "Unknown"),
            ("Do something today that your future self will thank you for.", "Sean Patrick Flanery"),
            ("Little things make big days.", "Unknown"),
            ("It's going to be hard, but hard does not mean impossible.", "Unknown"),
            ("Don't wait for opportunity. Create it.", "Unknown"),
            ("The secret of getting ahead is getting started.", "Mark Twain"),
            ("In the middle of every difficulty lies opportunity.", "Albert Einstein"),
        ]

        created_count = 0
        for text, author in quotes_data:
            _, created = Quote.objects.get_or_create(
                text=text, defaults={"author": author}
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {created_count} new quotes. Total: {Quote.objects.count()}"
            )
        )
```

### Run Backend Setup
```bash
cd quotes-backend
python manage.py makemigrations
python manage.py migrate
python manage.py seed_quotes
python manage.py createsuperuser   # optional, for admin panel
python manage.py runserver
```

---

## Frontend Code

### `quotes-frontend/firebaseConfig.ts`
```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace with your Firebase project config from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### `quotes-frontend/src/types/index.ts`
```typescript
export interface Quote {
  id: number;
  text: string;
  author: string;
}

export interface LikedQuote {
  id: number;
  quote: Quote;
  liked_at: string;
}
```

### `quotes-frontend/src/services/auth.ts`
```typescript
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};
```

### `quotes-frontend/src/services/api.ts`
```typescript
import { getIdToken } from "./auth";
import { Quote, LikedQuote } from "../types";

const API_BASE_URL = "http://localhost:8000";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await getIdToken();
  if (!token) throw new Error("Not authenticated");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchRandomQuote = async (): Promise<Quote> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/quotes/random/`, {
    headers,
  });
  if (!response.ok) throw new Error("Failed to fetch quote");
  return response.json();
};

export const likeQuote = async (
  quoteId: number
): Promise<{ status: string }> => {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/api/quotes/${quoteId}/like/`,
    {
      method: "POST",
      headers,
    }
  );
  if (!response.ok) throw new Error("Failed to like quote");
  return response.json();
};

export const fetchLikedQuotes = async (): Promise<LikedQuote[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/quotes/liked/`, {
    headers,
  });
  if (!response.ok) throw new Error("Failed to fetch liked quotes");
  const data = await response.json();
  return data;
};
```

### `quotes-frontend/src/contexts/AuthContext.tsx`
```typescript
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import {
  signInWithGoogle as googleSignIn,
  logout as firebaseLogout,
} from "../services/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await googleSignIn();
  };

  const logout = async () => {
    await firebaseLogout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### `quotes-frontend/src/screens/LoginScreen.tsx`
```typescript
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

const LoginScreen: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Quotes</Text>
      <Text style={styles.subtitle}>Get inspired every day</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 48,
  },
  button: {
    backgroundColor: "#4285F4",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    minWidth: 220,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginTop: 16,
    fontSize: 14,
  },
});

export default LoginScreen;
```

### `quotes-frontend/src/screens/HomeScreen.tsx`
```typescript
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { fetchRandomQuote, likeQuote } from "../services/api";
import { Quote } from "../types";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { logout } = useAuth();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [likeStatus, setLikeStatus] = useState<string | null>(null);

  const loadRandomQuote = async () => {
    setLoading(true);
    setLikeStatus(null);
    try {
      const data = await fetchRandomQuote();
      setQuote(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to load quote");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomQuote();
  }, []);

  const handleLike = async () => {
    if (!quote) return;
    try {
      const result = await likeQuote(quote.id);
      setLikeStatus(result.status);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to like quote");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Logout failed");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.quoteCard}>
        {loading ? (
          <ActivityIndicator size="large" color="#4285F4" />
        ) : quote ? (
          <>
            <Text style={styles.quoteText}>"{quote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {quote.author}</Text>
          </>
        ) : (
          <Text style={styles.quoteText}>No quotes available</Text>
        )}
      </View>

      {likeStatus && (
        <Text style={styles.likeStatus}>
          {likeStatus === "liked" ? "Added to liked quotes!" : "Already liked!"}
        </Text>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.randomButton]}
          onPress={loadRandomQuote}
        >
          <Text style={styles.actionButtonText}>Random</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLike}
          disabled={!quote}
        >
          <Text style={styles.actionButtonText}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likedListButton]}
          onPress={() => navigation.navigate("LikedQuotes")}
        >
          <Text style={styles.actionButtonText}>Liked Quotes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  logoutButton: {
    position: "absolute",
    top: 50,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
  },
  logoutText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  quoteCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: 500,
    width: "100%",
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 30,
    color: "#333",
    textAlign: "center",
    fontStyle: "italic",
  },
  quoteAuthor: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  likeStatus: {
    marginTop: 12,
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 32,
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  randomButton: {
    backgroundColor: "#4285F4",
  },
  likeButton: {
    backgroundColor: "#EA4335",
  },
  likedListButton: {
    backgroundColor: "#34A853",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default HomeScreen;
```

### `quotes-frontend/src/screens/LikedQuotesScreen.tsx`
```typescript
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { fetchLikedQuotes } from "../services/api";
import { LikedQuote } from "../types";

const LikedQuotesScreen: React.FC = () => {
  const [likedQuotes, setLikedQuotes] = useState<LikedQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLikedQuotes = async () => {
      try {
        const data = await fetchLikedQuotes();
        setLikedQuotes(data);
      } catch (err: any) {
        Alert.alert("Error", err.message || "Failed to load liked quotes");
      } finally {
        setLoading(false);
      }
    };
    loadLikedQuotes();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  if (likedQuotes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No liked quotes yet.</Text>
        <Text style={styles.emptySubtext}>
          Go back and like some quotes!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={likedQuotes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.quoteText}>"{item.quote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {item.quote.author}</Text>
            <Text style={styles.likedAt}>
              Liked on {new Date(item.liked_at).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    fontStyle: "italic",
  },
  quoteAuthor: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  likedAt: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
});

export default LikedQuotesScreen;
```

### `quotes-frontend/src/navigation/AppNavigator.tsx`
```typescript
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import LikedQuotesScreen from "../screens/LikedQuotesScreen";

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="LikedQuotes"
              component={LikedQuotesScreen}
              options={{
                headerShown: true,
                title: "Liked Quotes",
                headerStyle: { backgroundColor: "#f5f5f5" },
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

### `quotes-frontend/App.tsx`
```typescript
import React from "react";
import { AuthProvider } from "./src/contexts/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
```

---

## `.gitignore` (project root)

```
# Python
venv/
__pycache__/
*.pyc
db.sqlite3

# Firebase secrets
firebase-service-account.json

# Node
node_modules/
.expo/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

---

## Firebase Setup (manual steps)

1. Go to https://console.firebase.google.com — create a new project
2. Authentication > Sign-in method > Enable **Google**
3. Project Settings > General > Add a **Web app** — copy the config into `firebaseConfig.ts`
4. Project Settings > Service Accounts > **Generate new private key** — save as `quotes-backend/firebase-service-account.json`

---

## Run the App

**Terminal 1 — Backend:**
```bash
cd quotes-app/quotes-backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 — Frontend:**
```bash
cd quotes-app/quotes-frontend
npx expo start --web
```

---

## Verification
1. Backend: `curl http://localhost:8000/api/quotes/random/` (temporarily remove auth to test)
2. Frontend: Google sign-in popup works in browser
3. Full flow: Login -> see quote -> Random -> Like -> Liked Quotes -> Logout
4. Edge cases: double-like returns `already_liked`, empty liked list shows empty state
