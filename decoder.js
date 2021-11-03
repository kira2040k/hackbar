
document.addEventListener("DOMContentLoaded", function () {
    const scan = document.getElementById("scan")
    function add_item(text){
        const colors = ['alert-primary','alert-success','alert-dark','alert-danger','alert-warning','alert-info']
        let div = document.createElement('div');

            div.classList.add('alert',colors[Math.floor(Math.random() * colors.length)]);
            div.setAttribute("role", "alert");
            text = document.createTextNode(text);
            div.appendChild(text);
            document.body.appendChild(div)
    }
    scan.addEventListener("click", async (event) => {
        let cipher = document.getElementById("target_url").value
        add_item("Base64: "+decode_base64(cipher))
        add_item("ROT47: "+ ROT47(cipher))
        add_item("ROT13: "+ rot13(cipher))
        add_item("decoded decimal: "+ decode_decimal(cipher))
        add_item("decode octal: " + decode_octal(cipher))
        add_item("decode hex: " + decode_hex(cipher))
        add_item("decode ascii: " + decode_ascii(cipher))
        add_item("decode base85:"+ decode_ascii85(cipher))
    })

})



function decode_decimal(text){
    text = text.split(" ")
    let last = ""
    for(i=0;i<text.length;i++){
        var numeric = /\d+/.exec(text[i]);
        var decoded = String.fromCharCode(numeric);
        last = last + decoded
    }
    return last
}
function checkUTF8(text) {
    try {        
        return decodeURIComponent(escape(window.atob( text )));
    }catch(e) {
        return false
    }   
}
function ROTn(text, map) {
    // Generic ROT-n algorithm for keycodes in MAP.
    var R = new String()
    var i, j, c, len = map.length
    for(i = 0; i < text.length; i++) {
      c = text.charAt(i)
      j = map.indexOf(c)
      if (j >= 0) {
        c = map.charAt((j + len / 2) % len)
      }
      R = R + c
    }
    return R;
  }
function ROT47(text) {
    // Hides all ASCII-characters from 33 ("!") to 126 ("~").  Hence can be used
    // to obfuscate virtually any text, including URLs and emails.
    var R = new String()
    R = ROTn(text,
    "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~")
    return R;
  }
function decode_base64(text,text2) {
    while(true){
        try{
        text =  decodeURIComponent(escape(window.atob(text)));
        text2 = text
        if(checkUTF8(text)) decode_base64(text,text2) ;
        else return text2;
        }
        catch(e){
            return "Not found"
        }
    
    }
  }
  function rot13(str) {
    var input     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var output    = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
    var index     = x => input.indexOf(x);
    var translate = x => index(x) > -1 ? output[index(x)] : x;
    return str.split('').map(translate).join('');
  }
  function decode_octal(octBytes) {
    return bytesToChars(octToDecBytes(octBytes.split(' '))).join('');
  }
  
function bytesToChars(bytes) {
    return bytes.map(function(byte) {
      return String.fromCharCode(parseInt(byte, 10));
    });
  }
  function octToDecBytes(octBytes) {
    return octBytes.map(function(oct) {
      return parseInt(oct, 8);
    });
  }
  function decode_hex(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function decode_ascii(text){
    text = text.split(" ")
    let last = ""
    for(i=0;i<text.length;i++){
        last = last + String.fromCharCode(text[i])
       
    }
        

    return last
}


