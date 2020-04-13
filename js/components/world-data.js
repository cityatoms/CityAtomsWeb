

const getData =  (country, callback) => {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://covid-193.p.rapidapi.com/statistics?country="+country,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": "4af69467aamshc236f076fbf7836p1a1b8bjsnb9ec2dbb00f2"
        }
    }

    $.ajax(settings).done(function (res) { 
        callback(res.response[0])
    });
}

const renderData = (data) => {
    const worldDataComponent = `
    
        <div class="tally-container">
            <h2 class="tally-type">Total Cases</h2>
            <h3 class="tally dark" id="total-cases">${data.cases.total}</h3>
        </div>

        <div class="tally-container">
            <h2 class="tally-type">Total Recoveries</h2>
            <h3 class="tally green" id="total-recoveries">${data.cases.recovered}</h3>
        </div>
        
        <div class="tally-container">
            <h2 class="tally-type">Total Deaths</h2>
            <h3 class="tally danger" id="total-deaths">${data.deaths.total}</h3>
        </div>

    `
    $('#data').html('')
    $('#data').append(worldDataComponent)

}


export const renderWorldDataComponent = () => {
    $(` <label for="">Search By Country</label>
    <input type="text" id="country-filter">`).prependTo($('#data-section'))
    $('#data-section').append(`<div id="data"></div>`)
    getData('all', (data) => {
        renderData(data)
    })
    
    $('#country-filter').change((e) => {
        getData(e.target.value, (data) => {
            renderData(data)
        })
    })
    
    
}
