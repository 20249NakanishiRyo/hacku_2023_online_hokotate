from django.urls import path
from django.contrib import admin
from . import views

app_name = 'demonstrationapp'

handler500 = views.my_customized_server_error

urlpatterns = [
    path('', views.dashboardView.as_view(), name='dashboard'),
    path('user/', views.userView.as_view(), name='userboard'),
    path('admin/', admin.site.urls),
    path('get_chart/', views.get_chart, name='get_chart'),
    path('predict_chart/', views.predict_chart, name='predict_chart'),
    ]