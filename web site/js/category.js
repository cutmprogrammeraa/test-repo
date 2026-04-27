const categoryData = {
    pop: [
        {
            name: "Carla’s Dreams",
            date: "6 - 7 aprilie 21:00 - 23:45",
            img: "images/pop-1.jpg"
        },
        {
            name: "Irina Rimes",
            date: "26 aprilie 20:00 - 21:45",
            img: "images/pop-2.jpg"
        },
        {
            name: "Ionel Istrati",
            date: "19 mai 16:00 - 19:00",
            img: "images/pop-3.jpg"
        },
        {
            name: "Cleopatra Stratan",
            date: "16 iunie 19:00 - 21:45",
            img: "images/pop-4.jpg"
        }
    ],

    folk: [
        {
            name: "Nicolae Botgros",
            date: "31 mai 14:00 - 17:20",
            img: "images/folk-1.jpg"
        },
        {
            name: "Zinaida Julea",
            date: "3 iulie 20:00 - 21:45",
            img: "images/folk-2.jpg"
        },
        {
            name: "Ion Paladi",
            date: "12 iunie 20:30 - 22:30",
            img: "images/folk-3.jpg"
        },
        {
            name: "Igor Cuciuc",
            date: "29 iulie 19:00 - 21:45",
            img: "images/folk-4.jpg"
        }
    ],

    instrumental: [
        {
            name: "Vasike Iovu",
            date: "6 - 7 octombrie 19:00 - 20:45",
            img: "images/instrumental-1.jpg"
        },
        {
            name: "Constantin Moscovici",
            date: "5 august 20:00 - 21:45",
            img: "images/instrumental-2.jpg"
        },
        {
            name: "Orchestra Fraților Advahov",
            date: "19 mai 15:00 - 17:00",
            img: "images/instrumental-3.jpg"
        },
        {
            name: "Corneliu Botgros",
            date: "6 septembrie 19:00 - 21:45",
            img: "images/instrumental-4.jpg"
        }
    ],

    rock: [
        {
            name: "Nervi",
            date: "6 - 7 aprilie 21:00 - 23:45",
            img: "images/rock-1.jpg"
        },
        {
            name: "Zdob și Zdub",
            date: "26 aprilie 20:00 - 21:45",
            img: "images/rock-2.jpg"
        },
        {
            name: "Lupii lui Calancea",
            date: "19 mai 16:00 - 19:00",
            img: "images/rock-3.jpg"
        },
        {
            name: "Sabaton",
            date: "16 iunie 19:00 - 21:45",
            img: "images/rock-4.jpg"
        }
    ],

    jazz: [
        {
            name: "Jazz Quartet",
            date: "8 iunie 19:00 - 21:00",
            img: "images/jazz-1.jpg"
        },
        {
            name: "Blue Night Band",
            date: "14 iunie 20:00 - 22:00",
            img: "images/jazz-2.jpg"
        },
        {
            name: "Saxophone Live",
            date: "21 iunie 18:30 - 20:30",
            img: "images/jazz-3.jpg"
        },
        {
            name: "Evening Jazz Club",
            date: "30 iunie 20:00 - 22:30",
            img: "images/jazz-4.jpg"
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

        const savedTicket = localStorage.getItem("selectedTicket");

        card.innerHTML = `
            <div class="artist-image">
                <img src="${artist.img}" alt="${artist.name}">
            </div>

            <p class="artist-date">${artist.date}</p>
            <h3 class="artist-name">${artist.name}</h3>

            <a href="#" class="buy-btn ${savedTicket === artist.name ? "selected" : ""}" data-name="${artist.name}">
                ${savedTicket === artist.name ? "Bilet selectat" : "Cumpără bilet"}
            </a>
        `;

        artistGrid.appendChild(card);
    });
}

renderArtists();

document.addEventListener("click", function(event) {
    if (event.target.classList.contains("buy-btn")) {
        event.preventDefault();

        const artistName = event.target.dataset.name;

        localStorage.setItem("selectedTicket", artistName);

        document.querySelectorAll(".buy-btn").forEach(function(button) {
            button.classList.remove("selected");
            button.textContent = "Cumpără bilet";
        });

        event.target.classList.add("selected");
        event.target.textContent = "Bilet selectat";
    }
});