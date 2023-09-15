from django.contrib import admin

# Register your models here.
from .models import RateModel
admin.site.register(RateModel)

# Register your models here.
from .models import FutureRate
admin.site.register(FutureRate)

from .models import Post
admin.site.register(Post)

from .models import User
admin.site.register(User)