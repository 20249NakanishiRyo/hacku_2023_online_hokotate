from django.urls import path
from . import views

app_name = 'demonstrationapp'

urlpatterns = [
    path('', views.dashboardView.as_view(), name='dathboard'),
    path('get_chart/', views.get_chart, name='get_chart'),
    ]