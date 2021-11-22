function setup() {

    const links_list = [
        "",
        window.location.href,
        "//www.google.de",
        "//www.google.com",
        "//instagram.com",
        "//facebook.com",
        "//www.youtube.com/watch?v=dQw4w9WgXcQ",
        "//de.pornhub.com",
        "//xhamster.com"
        ]
    
    let words_list = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
    shuffle(words_list)
    words_list = get_first_items_from_list(words_list, links_list.length);

    const form = document.querySelector("#captcha-form")

    var links_dict = create_links_dict(words_list, links_list)
    create_docs(links_dict)

    form.addEventListener("submit", form_submit);
}


function get_first_items_from_list(list, number_of_items) {
    var first_items = []
    for (var i = 0; i < number_of_items; i++) {
        first_items.push(list[i])
    }
    return first_items
}

function create_links_dict(words, links) {
    if (words.length != links.length) {
        return "Error: words and links must be the same length"
    }

    shuffle(words);
    shuffle(links);

    link_dict = {}

    words.forEach((key, i) => link_dict[key] = links[i]);
    

    return link_dict


}


function create_docs(link_dict) {

    const parent_div = document.getElementById("history-test")
// loop over links_dict and create a new elemtn for each key and appent it to the body
    for (var key in link_dict) {
        var new_element = document.createElement("a");
        new_element.innerHTML = key;
        new_element.href = link_dict[key];
        new_element.classList.add("history-link")
        link_dict[key] == "" ? new_element.classList.add("history-positive"): new_element.classList.add("history-test-link")
        parent_div.appendChild(new_element);
    }

}

function form_submit(event) {

    event.preventDefault();
    const form_data = new FormData(event.target);
    const form_data_dict = {}
    form_data.forEach((value, key) => form_data_dict[key] = value)
    
    //console.log(form_data_dict)

    let words_input = form_data_dict["captcha-form-words"].toLowerCase().split("");
    let websites = [];

    words_input.forEach((word) => {
        if (word in link_dict) {
            websites.push(link_dict[word])
        }
    })

    if (!websites.includes("")) {
        //console.log("CAPTCHA not fully made");
        document.querySelector("#captcha-error").style.display = "block";
    } else {
        websites = [...new Set(websites)];
        //console.log(websites);
        // remove empty string
        websites = websites.filter(function(item) {
            return item !== ""
        })
        //console.log(websites)
        send_to_server(websites);
        document.querySelector("#captcha-error").style.display = "none";
        document.querySelector("#captcha-success").style.display = "block";
    }
}


function send_to_server(websites) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    let ref = ""
    "ref" in params ? ref = params["ref"]: null;

    let websites_base64 = btoa(JSON.stringify(websites));
    let data = { "a": websites_base64 }
    fetch(`/data?ref=${ref}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })

}


/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

setup();