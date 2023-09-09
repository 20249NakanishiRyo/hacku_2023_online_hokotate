from django.db import models
from jsonfield import JSONField
# Create your models here.
class RateModel(models.Model):
 date = models.DateField()
 open = models.FloatField()
 high = models.FloatField()
 low = models.FloatField()
 close = models.FloatField()