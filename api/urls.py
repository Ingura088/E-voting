from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login),
    path('aspirants/', views.aspirants),
    path('vote/', views.vote),
    path('results/', views.results),
    path('register/', views.register),
]