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