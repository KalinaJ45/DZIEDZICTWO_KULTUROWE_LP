from rest_framework import serializers
from users.models import Profile
from monuments.models import Monument
from monuments.api.serializers import MonumentSerializer

class ProfileSerializer(serializers.ModelSerializer):
    """Serializer of user profile"""
    administrator_monuments = serializers.SerializerMethodField()
    administrator_email = serializers.SerializerMethodField()
    administrator_forest_inspectorate = serializers.SerializerMethodField()

    def get_administrator_monuments(self, obj):
        query = Monument.objects.filter(administrator=obj.administrator).order_by('name')
        monuments_serialized = MonumentSerializer(query, many=True)
        return monuments_serialized.data

    def get_administrator_email(self, obj):
        return obj.administrator.email

    def get_administrator_forest_inspectorate(self, obj):
       return obj.administrator.forest_inspectorate
    
    class Meta:
        model = Profile
        fields = '__all__'
       

       

       




