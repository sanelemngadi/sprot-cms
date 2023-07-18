from django.urls import path
from pysprot import views

urlpatterns = [
    path("", views.design_view, name="design"),
]
