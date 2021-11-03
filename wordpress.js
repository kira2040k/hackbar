document.addEventListener("DOMContentLoaded", function () {

    const scan = document.getElementById("scan")
    scan.addEventListener("click", async (event) => {
        let url = document.getElementById("target_url").value
        await green("scan runing")

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

        
        //test paths
        function test_paths() {
            let list_paths = ['/wp-login.php', "/wp-admin/", "/wp-includes/", "/wp-content/"]
            for (let i = 0; i < list_paths.length; i++) {
                fetch(url + list_paths[i]).then(function (response) {
                    let status = response.status
                    response.text().then(function (text) {
                        if (!response.redirected && status == "200" && text.toLocaleLowerCase().includes("wordpress")) {
                            yellow("found wordpress")

                        }
                    })
                })

            }
        }

        await test_paths()
        //enum users
        async function enum_users() {
            let found_users = []
            for (i = 0; i < 50; i++) {

                await fetch(url + "?author=" + i).then(async function (response) {
                    if (!response.url.includes("?author") && response.redirected && !found_users.includes(response.url.replace(url, "").replace("author", "").replace(/\//ig, ""))) {

                        blue("found user " + response.url.replace(url, "").replace("author", "").replace(/\//ig, ""))
                        found_users.push(response.url.replace(url, "").replace("author", "").replace(/\//ig, ""))
                    }
                })
            }
            for (i = 0; i < found_users.length; i++) {

                var xhttp = new XMLHttpRequest();
                xhttp.open("POST", url + "/wp-login.php", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
                await xhttp.send(`log=${found_users[i]}&pwd=${found_users[i]}`)
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        console.log(this.responseText.length)
                        if (this.responseText.length > 10000) {
                            red(`login /wp-login.php username: ${found_users[i]} password: ${found_users[i]}`)
                        }

                    }
                }
            }
        }
         enum_users() 

        //plugns
        const wordlist = async (url) => {
            return new Promise((resolve, reject) => {
               
                fetch(url).then(response => response.text())
                .then(data => {
                data = data.split("\n")
                resolve(data)
            })
            });
        }

          
async function wordpress() {
    let url = document.getElementById("target_url").value
    wordlist("https://raw.githubusercontent.com/kira2040k/codes/main/3.txt").then( data =>{
        for(var i=0;i<data.length;i++){
                        
            try{
            fetch(url+"/wp-content/plugins/"+data[i]).then( response =>  {    
                if(response.status == "200" && !response.redirected){
                    blue("found " +response.url)
                
                }
            })
            
        }
        catch(e){}
    
        }
        
    })
    
    
    
}


        function users_json() {
            fetch(url + "/wp-json/wp/v2/users").then(function (response) {
                if (!response.redirected && response.status == "200") {
                    red("found users.json file " + url + "/wp-json/wp/v2/users")
                }
            })
            fetch(url + "/?rest_route=/wp/v2/users").then(function (response) {
                if (!response.redirected && response.status == "200") {
                    red("found users.json file " + url + "/?rest_route=/wp/v2/users")
                }

            })

        }
        users_json()

        function index_of() {
            let path_list = ['/wp-content/', '/wp-content/plugins/', '/wp-content/themes/', '/uploads/', '/images/']
            for (let i = 0; i < path_list.length; i++) {
                fetch(url + path_list[i]).then(function (response) {
                    response.text().then(function (text) {
                        if (text.includes("Index of")) {
                            yellow("found index of " + url + path_list[i])
                        }
                    });

                })
            }

        }
        index_of()
        function version() {
            fetch(url).then(function (response) {
                response.text().then(function (text) {
                    regex = /name\=\"generator\" content\=\"WordPress [0-9|.]{1,8}/
                    const version = regex.exec(text)
                    blue(version[0].replace("name\=\"generator\" content\=\"", ""))
                })
            })
        }
        version()

        function xmlrpc() {
            fetch(url + "/xmlrpc.php").then(function (response) {

                if (response.status == 405 && !response.redirected) {
                    yellow("xmlrpc.php was enabled")
                }
            })
        }
        xmlrpc()

        
    })


})