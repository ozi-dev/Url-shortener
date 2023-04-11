const kopyala = document.getElementsByClassName("short-link");
const form = document.getElementById("form");
const input = document.querySelector("input");
const linkWrapper = document.querySelector(".link-wrapper");
const errorDiv = document.querySelector(".error");
const shortenedLink = document.querySelector(".short-link");


const handleSubmit = async () => {
    let url = document.querySelector("#url").value;
    var kisisellestirme = document.querySelector("#kisisellestirme") !== null;
    let body;
    if(kisisellestirme==true){
        var kisi=document.querySelector("#kisisellestirme").value
         body=JSON.stringify({url,kisi});
    }else{  body=JSON.stringify({url});}
    console.log("deneme1",body);
    const response = await fetch("https://url41.herokuapp.com/link", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body:body
    }).then((response) => response.json());
    console.log(response);
    if (response.type == "failure") {
        input.style.border = "2px solid red";
        errorDiv.textContent = `${response.message}, lütfen başka bir tane deneyin`;
    }
    if (response.type == "success") {
        linkWrapper.style.opacity = 1;
        linkWrapper.style.scale = 1;
        linkWrapper.style.display = "flex";
        shortenedLink.textContent = response.message;

    }
};

const clearFields = () => {
    let url = document.querySelector("#url");
    url.value = '';
    url.addEventListener('focus', () => {
        errorDiv.textContent = '';
    })
}

form.addEventListener("submit", (e) => {

    e.preventDefault();
    handleSubmit();
    clearFields();

});

