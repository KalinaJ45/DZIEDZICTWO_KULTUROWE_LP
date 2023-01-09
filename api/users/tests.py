from rest_framework.test import APITestCase, APIClient
import json
from rest_framework import status
from users.models import CustomUser, Profile
from django.contrib.auth import get_user_model


class ProfileAPITestCase(APITestCase):

    def setUp(self) -> None:
        user = get_user_model().objects.create_superuser(username="admintest",
                                                         email="admintest@admintest.com", forest_inspectorate="DGLP", password="admintest")
        self.user = CustomUser.objects.get(username='admintest')
        self.user.forest_inspectorate = 'DGLP'
        self.user.save()
        self.client = APIClient()
        self. client.force_authenticate(user=self.user)
        self.profile = Profile.objects.get(administrator=self.user)

    def test_list(self):
        response = self.client.get('/api/profiles/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data[0]['id'] == self.profile.id

    def test_detail(self):
        response = self.client.get('/api/profiles/{}/'.format(self.profile.id))
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == self.profile.id

    def test_partial_update(self):
        response = self.client.patch(
            '/api/profiles/{}/update/'.format(self.profile.id),
            data={"address": "test address2"}
        )
        assert response.status_code == status.HTTP_200_OK
        partial_updated = Profile.objects.get(administrator=self.user)
        assert partial_updated.address == 'test address2'
