

from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import Profile
from django.contrib.auth import get_user_model
from .forest_inspectorate_dictionary import dictionary_FI 
User = get_user_model()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):

    def create_rdlp():
        
        for key in dictionary_FI:
            if key==instance.forest_inspectorate:
                user_rdlp=dictionary_FI[key]
                return user_rdlp
    if created:
        Profile.objects.create(administrator = instance, rdlp=create_rdlp())

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
