from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Note(models.Model):
    topic = models.CharField(max_length=100)
    entry = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.topic
    