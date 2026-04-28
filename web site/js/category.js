const categoryData = {
    pop: [
        {
            name: "Carla’s Dreams",
            date: "6 - 7 aprilie 21:00 - 23:45",
            img: "../images/carlas.png"
        },
        {
            name: "Irina Rimes",
            date: "26 aprilie 20:00 - 21:45",
            img: "../images/rimes.png"
        },
        {
            name: "Ionel Istrati",
            date: "19 mai 16:00 - 19:00",
            img: "../images/istrati.png"
        },
        {
            name: "Cleopatra Stratan",
            date: "16 iunie 19:00 - 21:45",
            img: "../images/stratan.png"
        }
    ],

    folk: [
        {
            name: "Nicolae Botgros",
            date: "31 mai 14:00 - 17:20",
            img: "../images/botgros.png"
        },
        {
            name: "Zinaida Julea",
            date: "3 iulie 20:00 - 21:45",
            img: "../images/julea.png"
        },
        {
            name: "Ion Paladi",
            date: "12 iunie 20:30 - 22:30",
            img: "../images/paladi.png"
        },
        {
            name: "Igor Cuciuc",
            date: "29 iulie 19:00 - 21:45",
            img: "../images/cuciuc.png"
        }
    ],

    instrumental: [
        {
            name: "Vasike Iovu",
            date: "6 - 7 octombrie 19:00 - 20:45",
            img: "../images/iovu.png"
        },
        {
            name: "Constantin Moscovici",
            date: "5 august 20:00 - 21:45",
            img: "../images/moscovici.png"
        },
        {
            name: "Orchestra Fraților Advahov",
            date: "19 mai 15:00 - 17:00",
            img: "../images/advahov.png"
        },
        {
            name: "Corneliu Botgros",
            date: "6 septembrie 19:00 - 21:45",
            img: "../images/corneliub.png"
        }
    ],

    rock: [
        {
            name: "Nervy",
            date: "6 - 7 aprilie 21:00 - 23:45",
            img: "../images/nervy.png"
        },
        {
            name: "Zdob și Zdub",
            date: "26 aprilie 20:00 - 21:45",
            img: "../images/zdob.png"
        },
        {
            name: "Lupii lui Calancea",
            date: "19 mai 16:00 - 19:00",
            img: "../images/lupii.png"
        },
        {
            name: "Sabaton",
            date: "16 iunie 19:00 - 21:45",
            img: "../images/sabaton.png"
        }
    ],

    jazz: [
        {
            name: "Jazz'n Chișinău",
            date: "8 iunie 19:00 - 21:00",
            img: "../images/jazzchisinau.png"
        },
        {
            name: "Cătălina Cara",
            date: "14 iunie 20:00 - 22:00",
            img: "../images/catalina.png"
        },
        {
            name: "Jazz Day",
            date: "21 iunie 18:30 - 20:30",
            img: "../images/jazzday.png"
        },
        {
            name: "Geta Burlacu",
            date: "30 iunie 20:00 - 22:30",
            img: "../images/geta.png"
        }
    ]
};

const pageCategory = document.body.dataset.category;
const artistGrid = document.getElementById("artistGrid");
const artists = categoryData[pageCategory];

function renderArtists() {
    artistGrid.innerHTML = "";

    artists.forEach(function(artist) {
        const card = document.createElement("div");
        card.className = "artist-card";

        card.innerHTML = `
            <div class="artist-image">
                <img src="${artist.img}" alt="${artist.name}">
            </div>

            <p class="artist-date">${artist.date}</p>
            <h3 class="artist-name">${artist.name}</h3>

            <a href="#" class="buy-btn" data-name="${artist.name}">
                Cumpără bilet
            </a>
        `;

        artistGrid.appendChild(card);
    });
}

renderArtists();

/* TOAST SUCCES */
function showToast() {
    const toast = document.getElementById("successToast");
    if (!toast) return;

    toast.classList.add("show");

    setTimeout(function() {
        toast.classList.remove("show");
    }, 2000);
}

/* CLICK GLOBAL */
document.addEventListener("click", function(e) {

    // deschide modal
    if (e.target.classList.contains("buy-btn")) {
        e.preventDefault();
        document.getElementById("ticketModal").classList.add("show");
    }

    // inchide modal
    if (e.target.id === "ticketClose") {
        document.getElementById("ticketModal").classList.remove("show");
    }

    // alegere bilet
    if (e.target.classList.contains("choose-btn")) {
        document.getElementById("ticketModal").classList.remove("show");
        showToast();
    }

    // inchide la click pe fundal
    if (e.target.id === "ticketModal") {
        e.target.classList.remove("show");
    }
});