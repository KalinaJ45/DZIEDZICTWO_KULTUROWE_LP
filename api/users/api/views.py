
from users.models import Profile
from .serializers import ProfileSerializer
from rest_framework import generics


class ProfileList(generics.ListAPIView):
    """ view of list of users profiles"""
    queryset = Profile.objects.all().order_by('administrator__forest_inspectorate')
    serializer_class = ProfileSerializer

class ProfileDetail(generics.RetrieveAPIView):
    """ view of user ptofile detail"""
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'administrator'

class ProfileUpdate(generics.UpdateAPIView):
    """ view of user ptofile detail"""
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'administrator'

