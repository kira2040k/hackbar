

document.addEventListener("DOMContentLoaded", function () {
    function blue(text) {
        let div = document.createElement('div');

        div.classList.add('alert', 'alert-info');
        div.setAttribute("role", "alert");
        text = document.createTextNode(text);
        div.appendChild(text);
        document.body.appendChild(div)
    }
    const click = document.getElementById("scan")
    let re 
    click.addEventListener("click", async (event) => {
        const blacklist = document.getElementById("waf").value.split(" ")
        re = ""
        for(x=0;x<blacklist.length;x++){
               re += blacklist[x] + "|" 
            
        }
        re = re.substring(0, re.length - 1);
        re = new RegExp (re)
        wordlist("https://raw.githubusercontent.com/kira2040k/codes/main/XSS.txt").then( data =>{
            for(var i=0;i<data.length;i++){
            if(data[i] == undefined) return;
            
            if(!re.test(data[i]) && blacklist[x] != " " && blacklist[x] != ""){
                blue(data[i])
            }
                
        
            }
            
        })
            
    })
    

})


const wordlist = async (url) => {
    return new Promise((resolve, reject) => {
       
        fetch(url).then(response => response.text())
        .then(data => {
        data = data.split("\n")
        resolve(data)
    })
    });
}