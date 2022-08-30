# b1-servicelayer-cap-btp
This branch shows how you can quickly hard code service layer variables and test consumption of the API through CDS remote service.

# Getting Started
Clone the repo and branch into the local version.
```bash
git clone https://github.com/jacobahtan/b1-servicelayer-cap-btp.git b1-servicelayer-cap-local
```
In this branch, the app will consume service layer API directly in the cat-service.js

```bash
cd b1-servicelayer-cap-local
git checkout -b local 
```
Modify the parameters in cat-service.js to your service layer url & port.
For simplicity, we will use a non-SSL port (HTTP).
e.g. http://myservicelayer:50001/b1s/v1/

Once defined, let's run the app.
```bash
npm install
cds run
```