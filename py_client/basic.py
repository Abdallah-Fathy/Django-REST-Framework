import requests

# endpoint ="https://httpbin.org/anything"
endpoint ="http://localhost:8000/api/"

get_response = requests.post(endpoint,json={"content":"Hello World"})  #HTTP Request
# print(get_response.text) # print raw text response
# print(get_response.status_code)


# HTTP Request -> HTML
# REST API HTTP Request -> JSON
# JavaScriptn Object Notation ~ Python Dict
print(get_response.json())
# print(get_response.status_code)
