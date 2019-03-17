let tableContainner;
document.addEventListener("DOMContentLoaded", init);

function init(){
    tableContainner = document.getElementById('list');

    for(let site in config){
        console.log(site);
        let htmlString = "<tr><td>{0}</td><td>{1}</td><td>{2}</td></tr>";
        tableContainner.innerHTML += htmlString.replace("{0}", site).replace("{1}",config[site].default).replace("{2}","goto " + site + " " + config[site].param);
    }
}