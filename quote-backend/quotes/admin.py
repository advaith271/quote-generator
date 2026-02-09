from django.contrib import admin
from .models import Quote,LikedQuote,Profile

@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display=("id","text","author","created_at")
    search_fields=("text","author")

@admin.register(LikedQuote)
class LikedQuoteAdmin(admin.ModelAdmin):
    list_display=("id","firebase_uid","quote","liked_at")
    list_filter=("firebase_uid",)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display=("id","firebase_uid","display_name","email","first_login")


