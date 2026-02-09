from django.core.management.base import BaseCommand
from quotes.models import Quote

class Command(BaseCommand):
    def handle(self,*args,**options):
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
        created_count=0
        for text,author in quotes_data:
            _,created=Quote.objects.get_or_create(
                text=text,defaults={"author":author}
            )
            if created:
                created_count+=1
            
        self.stdout.write(
            self.style.SUCCESS(
            f"Added {created_count} new quotes. Total is {Quote.objects.count()}"
            )
        )