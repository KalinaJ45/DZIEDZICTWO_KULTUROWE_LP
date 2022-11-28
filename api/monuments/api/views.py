from .serializers import MonumentSerializer
from monuments.models import Monument
from rest_framework import generics


class MonumentList(generics.ListAPIView):
    """ view of list of monuments"""
    queryset = Monument.objects.all().order_by('name')
    serializer_class = MonumentSerializer

class MonumentCreate(generics.CreateAPIView):
    """ view of create of monuments"""
    queryset = Monument.objects.all()
    serializer_class = MonumentSerializer

class MonumentDetail(generics.RetrieveAPIView):
    """ view of monuments detail"""
    queryset = Monument.objects.all()
    serializer_class = MonumentSerializer

class MonumentDelete(generics.DestroyAPIView):
    """ View of selected monument delete"""
    queryset = Monument.objects.all()
    serializer_class = MonumentSerializer

class MonumentUpdate(generics.UpdateAPIView):
    """ View of selected monument update"""
    queryset = Monument.objects.all()
    serializer_class = MonumentSerializer
    

    