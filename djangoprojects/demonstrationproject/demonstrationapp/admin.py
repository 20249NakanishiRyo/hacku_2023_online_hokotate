from django.contrib import admin

# Register your models here.
from .models import RateModel
admin.site.register(RateModel)

# Register your models here.
from .models import FutureRate
admin.site.register(FutureRate)