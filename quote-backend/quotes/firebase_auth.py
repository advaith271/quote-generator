import functools
from pathlib import Path

from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

import firebase_admin
from firebase_admin import auth as firebase_auth
from firebase_admin.credentials import Certificate

_app=None

def get_firebase_app():
    global _app
    if _app is None:
        cred=Certificate(str(settings.FIREBASE_SERVICE_ACCOUNT_PATH))
        try:
            _app=firebase_admin.get_app(name="QuotesApp")
        except ValueError:
            _app=firebase_admin.initialize_app(credential=cred,name="QuotesApp")
    return _app

class FirebaseUser:
    def __init__(self,uid,email=None,display_name=None):
        self.uid=uid
        self.email=email
        self.display_name=display_name
        self.is_authenticated=True

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header=request.META.get("HTTP_AUTHORIZATION","")
        if not auth_header.startswith("Bearer "):
            return None
        
        token=auth_header.split("Bearer ")[1]
        try:
            decoded=firebase_auth.verify_id_token(token,app=get_firebase_app())
        except Exception:
            raise AuthenticationFailed("Invalid or expired Firebase token")

        user=FirebaseUser(uid=decoded["uid"],email=decoded.get("email"),display_name=decoded.get("name"))
        return (user,None)
    

