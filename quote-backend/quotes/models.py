from django.db import models

class Quote(models.Model):
    text=models.TextField()
    author=models.CharField(max_length=200,default="Unknown")
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table="quotes"

    def __str__(self):
        return f'{self.text}-{self.author}'
    
class LikedQuote(models.Model):
    firebase_uid=models.CharField(max_length=128,db_index=True)
    quote=models.ForeignKey(Quote,on_delete=models.CASCADE,related_name="Likes")
    liked_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table="liked_quotes"
        unique_together=("firebase_uid","quote")
        ordering=["-liked_at"]

    def __str__(self):
        return f"{self.firebase_uid} liked quote {self.quote_id}"
    
class Profile(models.Model):
    firebase_uid=models.CharField(max_length=128,unique=True)
    display_name=models.CharField(max_length=200,blank=True)
    email=models.EmailField(blank=True)
    first_login=models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table="profiles"

    def __str__(self):
        return f"{self.display_name} ({self.firebase_uid})"
    
