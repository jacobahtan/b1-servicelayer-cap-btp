const cds = require("@sap/cds");
const axios = require('axios');
const xsenv = require('@sap/xsenv');
const b1dest = "B1SL";  //  create a simple basic auth destination in your btp cockpit

module.exports = cds.service.impl(async function () {
    const { Books } = this.entities;

    var b1session, b1slurl, b1credentials;

    /** PLEASE READ FIRST
     *  Mandatory: Create a destination instance in SAP BTP then create a service key and copy the JSON and paste into the default-env.json.
     * If not there will be an error of properties undefined.
    */
    getDestination(b1dest).then(dest => {
        b1session = "Basic " + dest.authTokens[0].value;
        b1slurl = dest.destinationConfiguration.URL;
        b1credentials = JSON.parse(dest.destinationConfiguration.User);
        b1credentials.Password = dest.destinationConfiguration.Password;

        //  Retrieve a cookie from B1 through SL Login.
        var request = require("request");
        var options = {
            method: "POST",
            url: b1slurl + "Login",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(b1credentials),
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            var jsonarr = JSON.parse(response.body);
            b1session = "B1SESSION=" + jsonarr.SessionId + "; ROUTEID=.node2";
        });
    });

    this.on("READ", Books, async () => {
        var ret;
        var request = require("request");
        var options = {
            method: "GET",
            url: b1slurl + "Items?$select=ItemCode,ItemName,BarCode&$top=5",
            headers: {
                "Content-Type": "application/json",
                Cookie: b1session,
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            var itemsarr = JSON.parse(response.body);
            ret = itemsarr.value;
        });
        await sleep(2000);
        return ret;
    });
});

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/** Default Helper function to auth your app getting connected with SAP BTP Destination services and return Destination object. */
async function getDestination(dest) {
    try {
        xsenv.loadEnv();
        let services = xsenv.getServices({
            dest: { tag: 'destination' }
        });
        try {
            let options1 = {
                method: 'POST',
                url: services.dest.url + '/oauth/token?grant_type=client_credentials',
                headers: {
                    Authorization: 'Basic ' + Buffer.from(services.dest.clientid + ':' + services.dest.clientsecret).toString('base64')
                }
            };
            let res1 = await axios(options1);
            try {
                options2 = {
                    method: 'GET',
                    url: services.dest.uri + '/destination-configuration/v1/destinations/' + dest,
                    headers: {
                        Authorization: 'Bearer ' + res1.data.access_token
                    }
                };
                let res2 = await axios(options2);
                // return res2.data.destinationConfiguration;
                return res2.data;
            } catch (err) {
                console.log(err.stack);
                return err.message;
            }
        } catch (err) {
            console.log(err.stack);
            return err.message;
        }
    } catch (err) {
        console.log(err.stack);
        return err.message;
    }
};
