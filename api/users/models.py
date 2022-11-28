from distutils.command.upload import upload
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from .forest_inspectorate_dictionary import dictionary_FI


def create_forest_inspectorate_forest_choises():
    keysList = list(dictionary_FI)
    keysList.sort()
    keyTuple = tuple(keysList)
    CHOISE_FOREST_INSPECTORATE = zip(keyTuple, keyTuple)
    return CHOISE_FOREST_INSPECTORATE


class CustomUser(AbstractUser):

    forest_inspectorate = models.CharField(
        _('Nadleśnictwo'), choices=create_forest_inspectorate_forest_choises(), max_length=64, unique=True)
    email = models.EmailField(unique=True)
    REQUIRED_FIELDS = ['email', 'forest_inspectorate']

    def __str__(self):
        return self.username


class Profile(models.Model):
    """Profile model of user (Forest inspectorate)"""
    administrator = models.OneToOneField(CustomUser,  on_delete=models.CASCADE)
    rdlp = models.CharField(_('RDLP'), max_length=64)
    address = models.CharField(
        _('Adres'), max_length=256, null=True, blank=True)
    phone_number = models.CharField(
        _('Nr telefonu'), max_length=24, null=True, blank=True)
    description = models.TextField(_('Opis'), null=True, blank=True)
    profile_picture = models.ImageField(
        _('Zdjęcie profilowe'), upload_to='profile_pictures/%Y/%m/%d/', null=True, blank=True)

    def __str__(self):
        return self.administrator.forest_inspectorate
