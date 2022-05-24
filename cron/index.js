module.exports = async function (context, _) {
    
    context.bindings.clientData = [];

    const url = "https://ethernodes.org/api/clients";
    const response = await httpsRequest(url)
    context.log(response)

    time = Date.now()

    context.bindings.clientData.push({
        PartitionKey: "0",
        RowKey: time,
        data: response
    });
};

const httpsRequest = url => {
    const https = require('https')

    return new Promise( (resolve, reject) => {
        https.get(url, (res) => {
            var body = "";
    
            res.on("data", (chunk) => {
                body += chunk;
            });
    
            res.on("end", () => {
                try {
                    const json = JSON.parse(body);
                    resolve(json)
    
                } catch (error) {
                    context.error(error.message);
                    reject(error.message)
                };
            });
    
        }).on("error", (error) => {
            context.error(error.message);
            reject(error.message)
        });
    })
}