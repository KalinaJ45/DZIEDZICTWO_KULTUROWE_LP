import os
import tempfile
import shapefile
from django.http import HttpResponse
from zipfile import ZipFile


class Export_to_Shp():
    """Exports selected monuments to Shapefile"""
    def export_to_shp(queryset, monument, basename):

        basename = basename
        temp_dir = tempfile.TemporaryDirectory()
        name = str(temp_dir.name)
        w = shapefile.Writer(f"{name}\{basename}\{basename}", encoding="utf8")
        all_fields = [
            'inspire_id', 
            'name', 
            'category',
            'function',
            'chronology', 
            'documents',
        ]
        for field in all_fields:
            w.field(field, 'C', size=monument._meta.get_field(
                field).max_length)
        values = queryset.values_list(*all_fields).order_by('id')
        for value in values:
            w.record(*value)
        for object in queryset.order_by('id'):
            longitude = object.longitude
            latitude = object.latitude
            w.point(longitude, latitude)
        w.close()

        zipObj = ZipFile(f"{name}\{basename}.zip", 'w')
        for file in os.listdir(str(f"{name}\{basename}")):
            zipObj.write(f"{name}\{basename}\{file}", file)
        zipObj.close()
        filename = f'{name}\{basename}.zip'
        try:
            fsock = open(filename, "rb")
        except:
            return HttpResponse(f"File '{basename}' Does Not Exist!",
                                content_type='text/plain')
        response = HttpResponse(fsock, content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename={basename}.zip'
        return response
