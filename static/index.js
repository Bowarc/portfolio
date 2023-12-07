function elementFromHtml(html) {
    const template = document.createElement("template");

    template.innerHTML = html.trim();

    return template.content.firstElementChild;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function update_age(){
    let years = (new Date() - new Date(2001, 9, 15))/ 1000 / 60 / 60 / 24 / 365.242199;
    console.log(age);
    document.getElementById("age").innerHTML = `${Math.round(years)} ans`;  
}

update_age()