from django.urls import path
from industries.views import IndustryCreateView, IndustryDetailView

urlpatterns = [
    path("create/", IndustryCreateView.as_view(), name="industry-create"),  
    path("<int:pk>/", IndustryDetailView.as_view(), name="industry-detail"), 
]
