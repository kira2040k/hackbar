document.addEventListener("DOMContentLoaded", function () {
const gen = document.getElementById("gen")
gen.addEventListener("click", (event) => {
    const PORT = document.getElementById("PORT").value

    const IP = document.getElementById("IP").value
    document.getElementById("python").innerHTML = document.getElementById("python").innerHTML.replace("IP",IP).replace("PORT",PORT)
    document.getElementById("bash").innerHTML = document.getElementById("bash").innerHTML.replace("IP",IP).replace("PORT",PORT)

    document.getElementById("ruby").innerHTML = document.getElementById("ruby").innerHTML.replace("IP",IP).replace("PORT",PORT)

    document.getElementById("php").innerHTML = document.getElementById("php").innerHTML.replace("IP",IP).replace("PORT",PORT)

    document.getElementById("netcat").innerHTML = document.getElementById("netcat").innerHTML.replace("IP",IP).replace("PORT",PORT)
    document.getElementById("powershell").innerHTML = document.getElementById("powershell").innerHTML.replace("IP",IP).replace("PORT",PORT)

}, false)
})