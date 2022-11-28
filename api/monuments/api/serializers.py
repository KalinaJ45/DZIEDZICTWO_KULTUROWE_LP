from rest_framework import serializers
from monuments.models import Monument
from users.models import Profile


class MonumentSerializer(serializers.ModelSerializer):
    """Serializer of monument"""
    administrator_username = serializers.SerializerMethodField()
    administrator_forest_inspectorate = serializers.SerializerMethodField()
    administrator_rdlp = serializers.SerializerMethodField() 
    administrator_id = serializers.SerializerMethodField() 
    
    def get_administrator_rdlp(self, obj):
       return Profile.objects.get(administrator=obj.administrator).rdlp
  
    def get_administrator_username(self, obj):
        return obj.administrator.username

    def get_administrator_forest_inspectorate(self, obj):
        return obj.administrator.forest_inspectorate

    def get_administrator_id(self, obj):
        return obj.administrator.id

    class Meta:
        model = Monument
        fields = '__all__'
        
       

