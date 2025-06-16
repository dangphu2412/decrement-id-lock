from locust import HttpUser, task, between
import random
import string

def random_name():
    return "http://localhost" + ''.join(random.choices(string.ascii_letters + string.digits, k=10))

class CustomerTest(HttpUser):
    @task()
    def write_customers(self):
        self.client.post("/customers", json={"name": random_name()})
