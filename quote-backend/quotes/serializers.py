from rest_framework import serializers
from .models import Quote,LikedQuote,Profile

class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model=Quote
        fields=["id","text","author"]
    
class LikedQuoteSerializer(serializers.ModelSerializer):
    quote=QuoteSerializer(read_only=True)

    class Meta:
        model=LikedQuote
        fields=["id","quote","liked_at"]

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields=["id","firebase_uid","display_name","email","first_login"]
        
    