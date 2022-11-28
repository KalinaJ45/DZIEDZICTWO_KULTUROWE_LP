from django.urls import path
from monuments.api import views as monuments_api_views

urlpatterns = [
    path('monuments/', monuments_api_views.MonumentList.as_view()),
    path('monuments/<int:pk>/', monuments_api_views.MonumentDetail.as_view()),
    path('monuments/<int:pk>/delete/', monuments_api_views.MonumentDelete.as_view()),
    path('monuments/<int:pk>/update/', monuments_api_views.MonumentUpdate.as_view()),
    path('monuments/create/', monuments_api_views.MonumentCreate.as_view()),
]
   
    