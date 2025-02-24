from django.urls import path
from industries.views import IndustryCreateView, IndustryDetailView

urlpatterns = [
    path("industries/create/", IndustryCreateView.as_view(), name="industry-create"),  
    path("industries/<int:pk>/", IndustryDetailView.as_view(), name="industry-detail"), 
]
