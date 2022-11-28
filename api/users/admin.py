
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .models import Profile

   
class CustomUserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('username', 'email', 'forest_inspectorate')
    list_filter = ('forest_inspectorate',)
    fieldsets = (
        (None, {'fields': ('username','email', 'forest_inspectorate','password')}),
        
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username','email', 'forest_inspectorate', 'password1', 'password2',)}
        ),
    )
    search_fields = ('forest_inspectorate',)
    ordering = ('forest_inspectorate',)

class ProfileAdmin(admin.ModelAdmin):
     search_fields = ('administrator__forest_inspectorate',)
     ordering = ['administrator__forest_inspectorate']

    

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.unregister(Group)
admin.site. register(Profile, ProfileAdmin)
