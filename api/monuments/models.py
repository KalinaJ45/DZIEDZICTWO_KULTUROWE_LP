from random import choices
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
CustomUser = get_user_model()


CHOICES_CATEGORY = [
    ('Zabytek archeologiczny', 'Zabytek archeologiczny'),
    ('Zabytek nieruchomy', 'Zabytek nieruchomy'),
    ('Zabytek ruchomy', 'Zabytek ruchomy'), 
]


class Monument(models.Model):
    """Model of monument"""
    administrator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True)
    inspire_id = models.CharField(_('Inspire Id'),max_length=64, blank=True, null=True)
    name = models.CharField(_('Nazwa obiektu'), max_length=254)
    category = models.CharField(_('Kategoria obiektu'), max_length=64,
                                  choices=CHOICES_CATEGORY, blank=True, null=True)
    function = models.CharField(_('Funkcja obiektu'), max_length=64, blank=True, null=True)
    chronology = models.CharField(_('Chronologia obiektu'), max_length=64, blank=True, null=True)
    documents = models.CharField(_('Dokumenty dotyczące ochrony'), max_length=254, blank=True, null=True)
    description = models.TextField(_('Opis'), blank=True, null=True)
    lease = models.BooleanField(_('Obiekt dzierżawiony'), default = False)
    availability = models.BooleanField(_('Obiekt dostępny dla turystów'), default = True)
    longitude = models.FloatField(_('Współrzędna X'), blank=True, null=True)
    latitude = models.FloatField(_('Współrzędna Y'), blank=True, null=True)
    picture1 = models.ImageField(_('Fotografia 1'), blank=True, null=True, upload_to="pictures/%Y/%m/%d/")
    picture2 = models.ImageField(_('Fotografia 2'), blank=True, null=True, upload_to="pictures/%Y/%m/%d/")
    picture3 = models.ImageField(_('Fotografia 3'), blank=True, null=True, upload_to="pictures/%Y/%m/%d/")

    
    def __str__(self):
        return self.name

    def get_place_first_name(self):
        return self.name.split()[1]
        

    class Meta:
        verbose_name_plural = " Zabytki"
        

