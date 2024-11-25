from locust import HttpUser, task, between
import random

class BatchUsers(HttpUser):
    wait_time = between(3, 8) 
    @task
    def createUser(self):
        random_number = hex(random.getrandbits(160)) 
        request_body = {'publicAddress': random_number}
        self.client.post('/api/users', json=request_body)
