from django.urls import path
from . import views

app_name = 'demonstrationapp'

urlpatterns = [
    path('', views.dashboardView.as_view(), name='dathboard'),
    ]