const cds = require("@sap/cds");
const b1slurl = "_REPLACE_W_B1_SL_URL_";    // e.g. http://servicelayer:port/b1s/v1/
const b1companydb = "_REPLACE_W_B1_SL_COMPANYDB_";
const b1user = "_REPLACE_W_B1_SL_USER_";
const b1pass = "_REPLACE_W_B1_SL_PASS_";

module.exports = cds.service.impl(async function () {
    const { Books } = this.entities;

    this.on("READ", Books, async () => {
        var ret;
        var request = require("request");
        var options = {
            method: "POST",
            url: b1slurl + "Login",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                CompanyDB: b1companydb,
                Password: b1pass,
                UserName: b1user,
            }),
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            var jsonarr = JSON.parse(response.body);
            var cook = "B1SESSION=" + jsonarr.SessionId + "; ROUTEID=.node2";
            var request = require("request");
            var options = {
                method: "GET",
                url: b1slurl + "Items?$select=ItemCode,ItemName,BarCode&$top=5",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cook,
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                var itemsarr = JSON.parse(response.body);
                ret = itemsarr.value;
            });
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