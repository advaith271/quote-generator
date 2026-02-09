from django.urls import path
from .views import RandomQuoteView,LikeQuoteView,LikedQuotesView,ProfileView

urlpatterns = [
    path("api/quotes/random/",RandomQuoteView.as_view(),name="random-quote"),
    path("api/quotes/<int:quote_id>/like/",LikeQuoteView.as_view(),name="like-quote"),
    path("api/quotes/liked/",LikedQuotesView.as_view(),name="liked-quotes"),
    path("api/profile/",ProfileView.as_view(),name="profile"),
]


