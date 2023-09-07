from django.urls import path
from . import views
 
app_name = 'chart'
urlpatterns = [
    path('index/', views.IndexView.as_view(), name='index'),
    path('get_chart/', views.get_chart, name='get_chart'),
]