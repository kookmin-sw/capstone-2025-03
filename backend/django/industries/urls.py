from django.urls import path
from .views import IndustryListCreateView, IndustryDetailView

urlpatterns = [
    path("", IndustryListCreateView.as_view(), name="industry-list-create"),  
    path("<int:pk>/", IndustryDetailView.as_view(), name="industry-detail"), 
]
