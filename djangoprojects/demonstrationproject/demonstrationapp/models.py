from django.db import models
from jsonfield import JSONField
# Create your models here.
class RateModel(models.Model):
    data = JSONField()