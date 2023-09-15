from django.db import models
from jsonfield import JSONField
# Create your models here.
class RateModel(models.Model):
 date = models.DateField()
 open = models.FloatField()
 high = models.FloatField()
 low = models.FloatField()
 close = models.FloatField()

class FutureRate(models.Model):
 date = models.DateField()
 close = models.FloatField()
 sma01 = models.FloatField()
 sma02 = models.FloatField()
 sma03 = models.FloatField()

class Post(models.Model):
 title = models.CharField(max_length=25)
 slug = models.SlugField()
 intro = models.TextField()
 body = models.TextField()
 posted_date = models.DateField(auto_now_add=True)

class User(models.Model):
 username = models.CharField(max_length=50)
 password = models.CharField(max_length=50)
 ticker = models.CharField(max_length=20)