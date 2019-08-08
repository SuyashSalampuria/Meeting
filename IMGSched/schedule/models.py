from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


# Create your models here.
class meeting(models.Model):
    owner = models.ForeignKey('auth.User', related_name='snippets', on_delete=models.CASCADE, blank=True)
    time_created = models.DateTimeField(default=timezone.now)
    purpose = models.CharField(max_length=255)
    venue= models.CharField(max_length=255)
    private=models.BooleanField(default=True)
    participants=models.ManyToManyField(User, related_name='participants',blank=True)
    meet_time= models.DateTimeField(default=timezone.now)
    def __str__(self):
        return self.purpose
    def save(self, *args, **kwargs):
        super(meeting, self).save(*args, **kwargs)

class comment(models.Model):
    user=models.ForeignKey(User,on_delete=models.PROTECT, default=0)
    meeting=models.ForeignKey(meeting, on_delete=models.CASCADE)
    time=models.DateTimeField(default=timezone.now)
    Comment=models.TextField()
    def __str__(self):
        return self.Comment

