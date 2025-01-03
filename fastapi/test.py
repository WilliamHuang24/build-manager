import requests

url = 'http://127.0.0.1:5173/api/builds'
myobj = {
  "id": "10",
  "framework": "eagle",
  "passed": 2,
  "failed": 0,
  "skipped": 1,
  "hostname": "bob@123.com",
  "date": "2024-12-24",
  "content": "bob"
}

x = requests.post(url, json = myobj)
print(x.text)
