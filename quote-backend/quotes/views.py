from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Quote,LikedQuote,Profile
from .serializers import QuoteSerializer,LikedQuoteSerializer,ProfileSerializer
from .firebase_auth import FirebaseAuthentication


class RandomQuoteView(APIView):
    authentication_classes=[FirebaseAuthentication]
    permission_classes=[IsAuthenticated]

    def get(self,request):
        quote=Quote.objects.order_by("?").first()
        if not quote:
            return Response({"error": "No quotes available"},status=404)
        serializer=QuoteSerializer(quote)
        return Response(serializer.data)
    
class LikeQuoteView(APIView):
    authentication_classes=[FirebaseAuthentication]
    permission_classes=[IsAuthenticated]

    def post(self,request,quote_id):
        quote=get_object_or_404(Quote,id=quote_id)
        _,created=LikedQuote.objects.get_or_create(
            firebase_uid=request.user.uid,
            quote=quote,
        )
        status_text="liked" if created else "already_liked"
        return Response({"status":status_text},status=201 if created else 200,)
    
    def delete(self,request,quote_id):
        deleted,_=LikedQuote.objects.filter(
            firebase_uid=request.user.uid,
            quote_id=quote_id,
        ).delete()
        if deleted:
            return Response({"status":"unliked"})
        return Response({"status":"not found"},status=404)
    
class LikedQuotesView(ListAPIView):
    authentication_classes=[FirebaseAuthentication]
    permission_classes=[IsAuthenticated]
    serializer_class=LikedQuoteSerializer

    def get_queryset(self):
        return LikedQuote.objects.filter(
            firebase_uid=self.request.user.uid,
        ).select_related("quote")
    
class ProfileView(APIView):
    authentication_classes=[FirebaseAuthentication]
    permission_classes=[IsAuthenticated]

    def get(self,request):
        profile,created=Profile.objects.get_or_create(
            firebase_uid=request.user.uid,
            defaults={
                "email": request.user.email or "",
                "display_name": request.user.display_name or ""
            }
        )
        serializer=ProfileSerializer(profile)
        return Response(serializer.data)
    
    
