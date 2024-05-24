module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    const labels = JSON.stringify(
        context.bindings.clientData.map(c =>  {
            const d = new Date( parseInt(c.RowKey))
            return d.toString("MM YYYY h:mm:ss")
        })
    ) 

    const EL5 = ["geth", "erigon", "reth", "nethermind", "besu"]

    const EL5Strings = EL5.map( c => extractData(c, context.bindings.clientData))
        .map(generateDatasetString)
        .join(',')

    const geth = extractData("geth", context.bindings.clientData)
    context.log(geth.name)
    context.log(geth.values)

    const responseMessage = "<html> \n" +
    "<script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>\n"+
    "<body>"+
    `<div>
        <canvas id="myChart"></canvas>
    </div>` +
    "</body>\n"+
    
    `<script>
  
    const data = {
      labels: ${labels},
      datasets: [${EL5Strings}]
    };
  
    const config = {
      type: 'line',
      data: data,
      options: {}
    };
  </script>
  
  <script>
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
</script>`+
    
    
    "</html>\n"



    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage,
        headers: {'Content-Type': 'text/html'}
    };
}


const extractData = (clientName, payload) => {
    const client = payload.map(c => c.data)
    .flatMap(l => JSON.parse(l).filter( 
        i => i.client === clientName
    )).map(i => i.value)

    return {
        "name": clientName,
        "values": JSON.stringify(client)
    }
}

const generateDatasetString = (dataset) => {

    const color = stringToColour(dataset.name).toString()
    console.log(color)
    return `
    {
        label: '${dataset.name}',
        backgroundColor: '${color}',
        borderColor: '${color}',
        data: ${dataset.values}
    }
    `
}

// taken from https://stackoverflow.com/a/16348977/10134230
const stringToColour = str => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += (value.toString(16)).substring(-2);
    }
    return colour;
  }
