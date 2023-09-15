from django.urls import path
from django.contrib import admin
from . import views

app_name = 'demonstrationapp'

#handler500 = views.my_customized_server_error

urlpatterns = [
    path('', views.dashboardView.as_view(), name='dashboard'),
    path('user/', views.userView.as_view(), name='user'),
    path('login/', views.loginView.as_view(), name='login'),
    path('newuser/', views.newuserView.as_view(), name='newuser'),
    path('blog_list/', views.blog_listView.as_view(), name='blog_list'),
    path('blog/<int:number>/', views.show_blog, name='show_blog'),
    path('admin/', admin.site.urls),
    path('get_chart/', views.get_chart, name='get_chart'),
    path('get_blog/', views.get_blog, name='get_blog'),
    path('get_blog_id/', views.get_blog_id, name='get_blog_id'),
    path('predict_chart/', views.predict_chart, name='predict_chart'),
    path('register_newuser/', views.register_newuser, name='register_newuser'),
    path('auth_login/', views.auth_login, name='auth_login'),
    path('get_userinfo/', views.get_userinfo, name='get_userinfo'),
    path('update_user/', views.update_user, name='update_user'),
    ]