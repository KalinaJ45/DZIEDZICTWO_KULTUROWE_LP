from django.urls import path
from users.api import views as users_api_views


urlpatterns = [
    path('profiles/', users_api_views.ProfileList.as_view()),
    path('profiles/<int:administrator>/', users_api_views.ProfileDetail.as_view()),
    path('profiles/<int:administrator>/update/', users_api_views.ProfileUpdate.as_view()),
]





   