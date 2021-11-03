function capital_small(letter){
    let num = Math.random() 
    
    if(num < 0.4){
        return "%"+letter.toLowerCase().hexEncode().replace("0","").replace("0","")
    }
    
    else{
        return "%"+letter.toUpperCase().hexEncode().replace("0","").replace("0","")
    }
}
String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}
function add_50000(word){
    let payload = ""
    for (var i = 0; i < word.length; i++){
        payload += capital_small(word[i])
    }   
    return "/*!50000"+payload+"*/"
}
// function add_comment(word){
//     let payload = ""
    
//     for (var i = 0; i < word.length; i++){
//         payload += capital_small(word[i]) + `/**/`
//     }    
//     return payload
// }
    function add_comment2(word){
        let payload = ""
        for (var i = 0; i < word.length; i++){
            payload += capital_small(word[i])
        }  
        return "/*!" + payload + "*/"
    }
    function add_commnet_12345(word){
        let payload = ""
        for (var i = 0; i < word.length; i++){
            payload += capital_small(word[i])
        }  
        return "/**//*!12345" + payload + "*/"
    }


document.addEventListener("DOMContentLoaded", function () {

    const click = document.getElementById("scan")
    function add_item(text){
        const colors = ['alert-primary','alert-success','alert-dark','alert-danger','alert-warning','alert-info']
        let div = document.createElement('div');

            div.classList.add('alert',colors[Math.floor(Math.random() * colors.length)]);
            div.setAttribute("role", "alert");
            text = document.createTextNode(text);
            div.appendChild(text);
            document.body.appendChild(div)
    }
    
    
    click.addEventListener("click", async (event) => {
        let word = document.getElementById("waf").value
        const SQli = ['table_schema','@@version','columns','tables','union','select','order by','concat','group_concat','information_schema','database','sleep',"limit",'where','from']
        if(SQli.includes(word.toLowerCase().replace("()",""))){
            // add_item(add_comment(word))
            add_item(add_50000(word))
            add_item(add_comment2(word))
            add_item(add_commnet_12345(word))

        }


    })

})

