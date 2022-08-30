# b1-servicelayer-cap-btp
Utilise service layer in SAP CAP CDS custom event handler logic. Service layer definition is defined through SAP BTP via the Connectivity > Destination service.

# Getting Started
```bash
git clone https://github.com/jacobahtan/b1-servicelayer-cap-btp.git b1-servicelayer-cap-btp
```

1. Create a Destination service instance in your SAP BTP Account.
- SAP BTP Cockpit > Services > Instances & Subscriptions > Create
- Destination service > Plan: Lite > Create
- Create Service Key
- Copy JSON > Paste in default-env.json (__REPLACE_W_DEST_SERVICE_KEY_CREDENTIALS__)

2. Define your SAP Business One Service Layer in SAP BTP Cockpit.
- SAP BTP Cockpit > Connectivity > Destination
- Create Destination
- Name: B1SL
- Type: HTTP
- Description: B1SL
- URL: http://SERVICE_LAYER_URL:PORT/b1s/v1/
- Proxy Type: Internet
- Authentication: BasicAuthentication
- User: { "CompanyDB": "COMPANY_DB", "UserName": "USERNAME" }
- Password: PASSWORD

In this app, it will utilise "destination" as the destination service name and B1SL as the destination definition name.
So, please do not change unless you know how to manage this.

3. Run your CAP App.
```bash
cd b1-servicelayer-cap-btp
npm install
cds run
```