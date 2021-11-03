

document.addEventListener("DOMContentLoaded", function () { 
    function add_item(text){
        const colors = ['alert-primary','','alert-dark','alert-danger','alert-warning','alert-info']
        let div = document.createElement('div');

            div.classList.add('alert',colors[Math.floor(Math.random() * colors.length)]);
            div.setAttribute("role", "alert");
            text = document.createTextNode(text);
            div.appendChild(text);
            document.body.appendChild(div)
    }
    
    const scan  = document.getElementById("scan")
    scan.addEventListener("click", async (event) => {
        const domain = document.getElementById("subdomain").value 
        var found = []
        function crt_sh() {

            fetch("https://crt.sh/?q="+domain).then(response => response.text())
            .then(data => {
                    // let subs = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/ig.exec(data)
                    
                    let subs =  data.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g) 
                    //let found = []
                    var subdomain = ""
                    for(i=0;i<subs.length;i++){
                        if(!found.includes(subs[i]) && subs[i].includes(domain)){
                            found.push(subs[i])
                            fetch("https://"+subs[i]).then(response =>{
                                add_item(response.url)
                            })
                        }
    
                    }
    
                })
        }
        function netcraft() {
            fetch("https://searchdns.netcraft.com/?restriction=site+contains&host="+domain+"&position=limited").then(response => response.text())
            .then(data => {
                    // let subs = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/ig.exec(data)
                    
                    let subs =  data.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g) 
                    //let found = []
                    var subdomain = ""
                    for(i=0;i<subs.length;i++){
                        if(!found.includes(subs[i]) && subs[i].includes(domain)){
                            found.push(subs[i])
                            fetch("https://"+subs[i]).then(response =>{
                                add_item(response.url)
                            })
                        }
    
                    }
    
                })

        }
        function hackertarget() {
            fetch("https://api.hackertarget.com/hostsearch/?q="+domain).then(response => response.text())
            .then(data => {
                    
                    let subs =  data.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g) 
                    for(i=0;i<subs.length;i++){
                        if(!found.includes(subs[i]) && subs[i].includes(domain)){
                            found.push(subs[i])
                            fetch("https://"+subs[i]).then(response =>{
                                add_item(response.url)
                            })
                        }
    
                    }
    
                })
        }
        hackertarget()
        netcraft()
        crt_sh()
    })

})
