from django.shortcuts import render

# Create your views here.
from django.views.generic.base import TemplateView

class dashboardView(TemplateView):
    template_name = 'dashboard.html'