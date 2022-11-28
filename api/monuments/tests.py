from rest_framework.test import APITestCase, APIClient
import json
from rest_framework import status
from monuments.models import Monument
from users.models import CustomUser
from django.contrib.auth import get_user_model

class MonumentAPITestCase(APITestCase):

    

     def setUp(self) -> None:
     
          user = get_user_model().objects.create_superuser(username="admintest", email = "admintest@admintest.com", forest_inspectorate="DGLP", password="admintest")
          self.user = CustomUser.objects.get(username='admintest')
          self.client = APIClient()                         
          self. client.force_authenticate(user=self.user)
          self.monument = Monument.objects.create(administrator = self.user, name="testmonument")

     def  test_create(self):
          initial_monuments_count = Monument.objects.count()
          user_id=self.user.id
          monument_attrs = {
               "administrator": self.user.id, 
               "name": "testmonument2",
          }
          data=json.dumps(monument_attrs)
          response = self.client.post(
               "/api/monuments/create/", 
               data=data, content_type="application/json"
          )
          self.assertEqual(response.status_code, status.HTTP_201_CREATED)
          self.assertEqual(Monument.objects.count(), initial_monuments_count + 1 )
          for attrs, expected_value in monument_attrs.items():
               self.assertEqual(response.data[attrs], expected_value)
          self.assertEqual(response.data['administrator'], user_id)
          self.assertEqual(response.data['name'], 'testmonument2' )

     def  test_list(self):
          response = self.client.get('/api/monuments/')
          self.assertEqual(response.status_code, status.HTTP_200_OK)
          self.assertEqual(response.data[0]['id'], self.monument.id) 
              
     def  test_detail(self):
          response = self.client.get('/api/monuments/{}/'.format(self.monument.id))
          self.assertEqual(response.status_code, status.HTTP_200_OK)
          self.assertEqual(response.data['id'], self.monument.id)     
       
     def  test_update(self):
          user = get_user_model().objects.create_superuser(username="admintest2", email = "admintest2@admintest.com", forest_inspectorate="BIELSK", password="admintest2")
          self.user =CustomUser.objects.get(username='admintest2')
          user_id= self.user.id
          self. client.force_authenticate(user=self.user)
          data = {"administrator": self.user.id, "name": "testmonument3",}
          data=json.dumps(data)
          response = self.client.put(
               '/api/monuments/{}/update/'.format(self.monument.id), 
               data=data, content_type="application/json"
          )
          self.assertEqual(response.status_code, status.HTTP_200_OK)
          updated = Monument.objects.get(id=self.monument.id)
          self.assertEqual(updated.name, 'testmonument3') 
          self.assertEqual(updated.administrator.id, user_id) 

     def  test_partial_update(self):
          response = self.client.patch(
               '/api/monuments/{}/update/'.format(self.monument.id), 
               data ={"name": "testmonument4"}
          )
          self.assertEqual(response.status_code, status.HTTP_200_OK)
          partial_updated = Monument.objects.get(id=self.monument.id)
          self.assertEqual(partial_updated.name, 'testmonument4') 
 
     def  test_delete(self):
          initial_monuments_count = Monument.objects.count()
          response = self.client.delete('/api/monuments/{}/delete/'.format(self.monument.id))
          self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
          self.assertEqual(Monument.objects.count(), initial_monuments_count - 1 )
          self.assertRaises(Monument.DoesNotExist, Monument.objects.get, id=self.monument.id)

          
         