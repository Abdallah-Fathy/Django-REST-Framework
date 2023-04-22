import requests

endpoint ="http://localhost:8000/api/products/189786456312123233/"

get_response = requests.get(endpoint)  

print(get_response.json())

