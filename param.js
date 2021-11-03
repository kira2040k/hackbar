document.addEventListener("DOMContentLoaded", function () {
    const scan = document.getElementById("scan")

    scan.addEventListener("click", async (event) => {
        let url = document.getElementById("target_url").value
        get_size(url).then(base_size =>{
            
        
            wordlist("https://raw.githubusercontent.com/kira2040k/codes/main/params.txt").then(async data =>{
        for(var number=0;number<data.length;number++){
            
            await get_size(url+"/?"+data[number]+"=1").then(result =>{
                console.log(data[number])
                if(result != base_size){
                    blue(data[number])
                }
            })
        
    
    }
    blue("done")
})
        })
        

})
function blue(text) {
    let div = document.createElement('div');

    div.classList.add('alert', 'alert-info');
    div.setAttribute("role", "alert");
    text = document.createTextNode(text);
    div.appendChild(text);
    document.body.appendChild(div)
}
})


const get_size = async (url) => {
    return new Promise((resolve, reject) => {
       
        fetch(url).then(response =>{
            resolve(response.headers.get("content-length"))
        })
    });
}
const wordlist = async (url) => {
    return new Promise((resolve, reject) => {
       
        fetch(url).then(response => response.text())
        .then(data => {
        data = data.split("\n")
        resolve(data)
    })
    });
}