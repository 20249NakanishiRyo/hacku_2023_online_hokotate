from django.urls import path
from django.contrib import admin
from . import views

app_name = 'demonstrationapp'

#handler500 = views.my_customized_server_error

urlpatterns = [
    path('', views.dashboardView.as_view(), name='dashboard'),
    path('user/', views.userView.as_view(), name='user'),
    path('blog/<int:number>/', views.show_blog, name='show_blog'),
    path('admin/', admin.site.urls),
    path('get_chart/', views.get_chart, name='get_chart'),
    path('get_blog/', views.get_blog, name='get_blog'),
    path('get_blog_id/', views.get_blog_id, name='get_blog_id'),
    path('predict_chart/', views.predict_chart, name='predict_chart'),
    ]