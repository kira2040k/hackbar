var founds_urls = []
let found_vuln = []
document.addEventListener("DOMContentLoaded", function () {
    const scan = document.getElementById("scan")

    scan.addEventListener("click", async (event) => {
        let url = document.getElementById("target_url").value
        content(url);
        fetch(url)
        .then(response => response.text())
            .then(data => {
                var parser = new DOMParser();
                parser = parser.parseFromString(data, 'text/html');
                let l = parser.getElementsByTagName('a');
                for (var i = 0; i < l.length; i++) {
                    target_url = l[i].href
                    if(target_url.includes("chrome-extension") && !founds_urls.includes(target_url.replace(/chrome-extension\:\/\/[a-z]{10,100}/,url))){
                    founds_urls.push(target_url.replace(/chrome-extension\:\/\/[a-z]{10,100}/,url))
                    founds_urls.push(/^\/]+[a-zA-Z0-9]$/igm.exec(target_url.replace(/chrome-extension\:\/\/[a-z]{10,100}/,url)))
                    console.log(/^\/]+[a-zA-Z0-9]$/igm.exec(target_url))
                    test(target_url.replace(/chrome-extension\:\/\/[a-z]{10,100}/,url))
                    }
                }
            });
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

//FUZZ
async function content(url) {
        wordlist("https://raw.githubusercontent.com/kira2040k/codes/main/content.txt").then( data =>{
            for(var i=0;i<data.length;i++){
                fetch(url+data[i]).then( response =>  {    
                    if(response.status == "200" && !response.redirected){
                        blue("found " +response.url)
                    }
                })
            }
        })
        
        
        
}


//spider
function test(url){
fetch(url)
        .then(response => response.text())
            .then(data => {
                var parser = new DOMParser();
                parser = parser.parseFromString(data, 'text/html');
                let l = parser.getElementsByTagName('a');
                for (var i = 0; i < l.length; i++) {
                    target_url = l[i].href
                    if(target_url.includes("chrome-extension") && !founds_urls.includes(target_url.replace(/chrome-extension\:\/\/[a-z]{10,100}/,url))){
                    founds_urls.push(target_url)
                    try{
                    test(target_url.replace(/chrome-extension\:\/\/[a-z]{10,100}/,url))
                    SQli(target_url.replace(/chrome-extension\:\/\/[a-z]{10,100}/,url))
                    XSS(target_url.replace(/chrome-extension\:\/\/[a-z]{10,100}/,url))
                    XSS_last(target_url.replace(/chrome-extension\:\/\/[a-z]{10,100}/,url))
                    }catch(e){}
                    }
                }
            });
        }


function XSS_last(url) {
    var regex
    let payloads = ['x"><img src=sadad onerror=print()>', "<script>print()</script>", '<svg/onload=print()>', "<a onmouseover=print()>xxs link</a>"]
    let found = false;
    for (let i = 0; i < payloads.length; i++) {
        if(url.includes("scanner.html")  || founds_urls.includes("h"+url.replace(/FUZZ/g, payloads[i])) ||url.includes("=undefined")) return;
        try{
        fetch(url + payloads[i]).then(response => response.text())
            .then(data => {
                regex = new RegExp(`value=${payloads[i]}`)
                if (data.includes(payloads[i]) && !regex.test(data)) {
                    if (!found) {
                        found = true
                        alert("found XSS " + url + payloads[i])
                    }

                }
            })
        } catch(e){}
    }

}
        

function SQli(url) {
    var queryDict = {}
    let found_urls = []
    url.substr(1).split("&").forEach(function (item) {
        queryDict[item.split("=")[0]] = item.split("=")[1]
    })
    let last = ""
    for (const par in queryDict) {
        last = last + `${par}=${queryDict[par]}FUZZ&`

    }
    last = last.substring(0, last.length - 1)
    let payloads = ['\'', '\'\'', '\`', "\`\`", "\,", "//", "\\\\", "\\", "/", '\"\"', '\"', ";"]
    let found = false
    for (let i = 0; i < payloads.length; i++) {
        
        if(last.includes("scanner.html")  || found_urls.includes("h"+last.replace(/FUZZ/g, payloads[i])) ||last.includes("=undefined")) return;
        try{
        fetch("h"+last.replace(/FUZZ/g, payloads[i])).then(response => response.text())
            .then(data => {
                found_urls.push("h"+last.replace(/FUZZ/g, payloads[i]))
                if (/mysql_fetch_array|Warning.*?\\W(sqlite_|SQLite3::)|(Microsoft|System)\\.Data\\.SQLite\\.SQLiteException|SQLite\\.Exception|SQLite\/JDBCDriver|valid PostgreSQL result|PostgreSQL.*?ERROR|Warning.*?\\Wpg_|check the manual that (corresponds to|fits) your MariaDB server version|MySqlException|Pdo[./_\\\\]Mysql|MySqlClient\\.|Unknown column '[^ ]+' in 'field list'|check the manual that (corresponds to|fits) your MySQL server version|valid MySQL result|MySQLSyntaxErrorException|Warning.*?\\Wmysqli?_|SQL syntax.*?MySQL|mysqli_fetch_array/.exec(data)) {
                    if (!found) {
                        found = true
                        red("found SQli " + "h"+last.replace(/FUZZ/g, payloads[i]))
                    }
                }

            })
        } catch(e){}
    }

    


}

function  XSS(url){
    var queryDict = {}
    let found_urls = []
    url.substr(1).split("&").forEach(function (item) {
        queryDict[item.split("=")[0]] = item.split("=")[1]
    })
    let last = ""
    for (const par in queryDict) {
        last = last + `${par}=${queryDict[par]}FUZZ&`

    }
    last = last.substring(0, last.length - 1)
    let payloads = ['x"><img src=sadad onerror=print()>', '<svg/onload=print()>', "<a onmouseover=print()>xxs link</a>"]
    let found = false
    for (let i = 0; i < payloads.length; i++) {
        if(last.includes("scanner.html")  || found_urls.includes("h"+last.replace(/FUZZ/g, payloads[i])) || last.includes("=undefined")) return;
        try{
        fetch("h"+last.replace(/FUZZ/g, payloads[i])).then(response => response.text())
            .then(data => {
                regex = new RegExp(`value=${payloads[i]}`)

                found_urls.push("h"+last.replace(/FUZZ/g, payloads[i]))
                if (data.includes(payloads[i]) && !regex.test(data) && payloads[i] != undefined) {
                    if (!found) {
                        found = true
                        red("found XSS " + "h"+last.replace(/FUZZ/g, payloads[i]))
                    }
                }

            })
        } catch(e){}
    }
}



function green(text) {
    let div = document.createElement('div');

    div.classList.add('alert', 'alert-success');
    div.setAttribute("role", "alert");
    text = document.createTextNode(text);
    div.appendChild(text);
    document.body.appendChild(div)
}


function red(text) {
    let div = document.createElement('div');
    div.classList.add('alert', 'alert-danger');
    div.setAttribute("role", "alert");
    text = document.createTextNode(text);
    div.appendChild(text);
    document.body.appendChild(div)
}

function yellow(text) {
    let div = document.createElement('div');

    div.classList.add('alert', 'alert-warning');
    div.setAttribute("role", "alert");
    text = document.createTextNode(text);
    div.appendChild(text);
    document.body.appendChild(div)
}

function blue(text) {
    let div = document.createElement('div');

    div.classList.add('alert', 'alert-info');
    div.setAttribute("role", "alert");
    text = document.createTextNode(text);
    div.appendChild(text);
    document.body.appendChild(div)
}
