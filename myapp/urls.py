"""myapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from main import views as main_views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', main_views.home, name="home"),
    path('add_purchase', main_views.add_purchase, name="add_purchase"),
    path('calculator', main_views.calculator, name="calculator"),
    path('buy_history', main_views.buy_history, name="buy_history"),
    path('debts_details', main_views.debts_details, name="debts_details"),
    path('debts_details/<int:debt_id>', main_views.debts_details, name="debts_details"),
    path('save_debts_details/<int:debt_id>', main_views.save_debts_details, name="save_debts_details"),
    path('person_details/<str:p_name>/', main_views.dynamic_lookup_view, name='person_details'),
    path('person_create', main_views.person_create_view, name="person_create"),
    path('base_page', main_views.base_page, name="base_page"),
    
    
    
]
