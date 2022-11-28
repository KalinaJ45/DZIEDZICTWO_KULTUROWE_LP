from django.contrib import admin
from monuments.models import Monument

from .export_to_shp import Export_to_Shp

class MonumentAdmin(admin.ModelAdmin):

     list_display = ['inspire_id', 'name']
     search_fields = ['inspire_id', 'name']
     ordering = ['name']

     queryset = Monument.objects.all()

     def coord(modeladmin, request, queryset):
        exp_shp = Export_to_Shp.export_to_shp(queryset, Monument, 'monuments')
        return exp_shp

     coord.short_description = "Eksportuj jako Shapefile"
     actions = ['coord']


admin.site.register (Monument, MonumentAdmin)

