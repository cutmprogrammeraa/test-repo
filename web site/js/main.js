/* ===== COUNTDOWN ===== */

const eventDate = new Date("2026-05-05T16:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance <= 0) {
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* ===== ABOUT ANIMATION ===== */

const aboutSection = document.querySelector(".about");

function showAbout() {
    if (!aboutSection) return;

    if (aboutSection.getBoundingClientRect().top < window.innerHeight - 120) {
        aboutSection.classList.add("show");
    }
}

window.addEventListener("scroll", showAbout);
showAbout();


/* ===== ARTISTS ANIMATION ===== */

const artistsSection = document.querySelector(".artists");

function showArtists() {
    if (!artistsSection) return;

    if (artistsSection.getBoundingClientRect().top < window.innerHeight - 120) {
        artistsSection.classList.add("show");
    }
}

window.addEventListener("scroll", showArtists);
showArtists();


/* ===== CATEGORIES SLIDER ===== */

const categoryWrapper = document.querySelector(".category-wrapper");
const originalCards = Array.from(document.querySelectorAll(".category-card"));
const dots = document.querySelectorAll(".dot");

if (categoryWrapper && originalCards.length > 0) {
    originalCards.forEach(function(card) {
        const clone = card.cloneNode(true);
        categoryWrapper.appendChild(clone);
    });

    let isPaused = false;
    let speed = 0.7;

    function updateDots() {
        const cardWidth = originalCards[0].offsetWidth + 30;
        const activeIndex = Math.floor(categoryWrapper.scrollLeft / cardWidth) % originalCards.length;

        dots.forEach(function(dot) {
            dot.classList.remove("active");
        });

        if (dots[activeIndex]) {
            dots[activeIndex].classList.add("active");
        }
    }

    function infiniteMove() {
        if (!isPaused) {
            categoryWrapper.scrollLeft += speed;

            if (categoryWrapper.scrollLeft >= categoryWrapper.scrollWidth / 2) {
                categoryWrapper.scrollLeft = 0;
            }

            updateDots();
        }

        requestAnimationFrame(infiniteMove);
    }

    categoryWrapper.addEventListener("mouseenter", function() {
        isPaused = true;
    });

    categoryWrapper.addEventListener("mouseleave", function() {
        isPaused = false;
    });

    categoryWrapper.addEventListener("wheel", function(event) {
        event.preventDefault();

        categoryWrapper.scrollLeft += event.deltaY;

        if (categoryWrapper.scrollLeft >= categoryWrapper.scrollWidth / 2) {
            categoryWrapper.scrollLeft = 0;
        }

        if (categoryWrapper.scrollLeft < 0) {
            categoryWrapper.scrollLeft = categoryWrapper.scrollWidth / 2;
        }

        updateDots();
    });

    dots.forEach(function(dot) {
        dot.addEventListener("mouseenter", function() {
            isPaused = true;

            const index = Number(dot.dataset.index);
            const cardWidth = originalCards[0].offsetWidth + 30;

            categoryWrapper.scrollTo({
                left: index * cardWidth,
                behavior: "smooth"
            });

            dots.forEach(function(d) {
                d.classList.remove("active");
            });

            dot.classList.add("active");
        });

        dot.addEventListener("mouseleave", function() {
            isPaused = false;
        });

        dot.addEventListener("click", function() {
            const index = Number(dot.dataset.index);
            const cardWidth = originalCards[0].offsetWidth + 30;

            categoryWrapper.scrollTo({
                left: index * cardWidth,
                behavior: "smooth"
            });
        });
    });

    updateDots();
    infiniteMove();
}


/* ===== REVIEWS ===== */

const reviews = [
    {
        name: "Daniel Pop",
        img: "../images/rusu.png",
        text: "Am găsit biletele foarte ușor și tot procesul a fost rapid. Concertul a fost minunat, iar atmosfera exact cum mi-am dorit.",
        likes: 18,
        dislikes: 1,
        date: 1,
        voted: null
    },
    {
        name: "Maria Ionescu",
        img: "../images/ionescu.png",
        text: "Tot procesul a fost rapid, iar concertul a fost minunat. Atmosfera a fost exact cum mi-am dorit.",
        likes: 9,
        dislikes: 0,
        date: 2,
        voted: null
    },
    {
        name: "Elena Marinescu",
        img: "../images/marinescu.png",
        text: "O platformă simplă și eficientă. Mi-a plăcut cât de repede am putut găsi evenimentul dorit.",
        likes: 15,
        dislikes: 2,
        date: 3,
        voted: null
    }
];

const reviewsSlider = document.getElementById("reviewsSlider");
const reviewDots = document.getElementById("reviewDots");
const reviewTabs = document.querySelectorAll(".review-tab");
const addReviewBtn = document.getElementById("addReviewBtn");
const prevReview = document.getElementById("prevReview");
const nextReviewBtn = document.getElementById("nextReview");

const reviewModal = document.getElementById("reviewModal");
const modalClose = document.getElementById("modalClose");
const modalName = document.getElementById("modalName");
const modalMessage = document.getElementById("modalMessage");
const modalSubmit = document.getElementById("modalSubmit");
const modalSuccess = document.getElementById("modalSuccess");

let currentReviews = [...reviews];
let reviewIndex = 0;
let reviewTimer;

function renderReviews() {
    if (!reviewsSlider || !reviewDots) return;

    reviewsSlider.innerHTML = "";
    reviewDots.innerHTML = "";

    currentReviews.forEach(function(review, i) {
        const card = document.createElement("div");
        card.className = "review-card";

        card.innerHTML = `
            <div class="quote left-quote">“</div>
            <div class="quote right-quote">”</div>

            <div class="review-user">
                <img src="${review.img || '../images/icon.png'}" alt="${review.name}">
                <h3>${review.name}</h3>
            </div>

            <p class="review-text">${review.text}</p>

            <div class="review-actions">
                <button class="${review.voted === "like" ? "voted" : ""}" onclick="likeReview(${i})">
                    ♡ ${review.likes}
                </button>

                <button class="${review.voted === "dislike" ? "voted" : ""}" onclick="dislikeReview(${i})">
                    👎 ${review.dislikes}
                </button>
            </div>
        `;

        reviewsSlider.appendChild(card);

        const dot = document.createElement("span");
        dot.className = "review-dot";

        dot.addEventListener("click", function() {
            reviewIndex = i;
            updateReviews();
            restartReviews();
        });

        reviewDots.appendChild(dot);
    });

    updateReviews();
}

function updateReviews() {
    const cards = document.querySelectorAll(".review-card");
    const dotsReview = document.querySelectorAll(".review-dot");

    if (cards.length === 0) return;

    cards.forEach(function(card) {
        card.className = "review-card";
    });

    dotsReview.forEach(function(dot) {
        dot.classList.remove("active");
    });

    const left = (reviewIndex - 1 + cards.length) % cards.length;
    const right = (reviewIndex + 1) % cards.length;

    cards[reviewIndex].classList.add("active");
    cards[left].classList.add("left");
    cards[right].classList.add("right");

    if (dotsReview[reviewIndex]) {
        dotsReview[reviewIndex].classList.add("active");
    }
}

function goReview(direction) {
    reviewIndex += direction;

    if (reviewIndex < 0) {
        reviewIndex = currentReviews.length - 1;
    }

    if (reviewIndex >= currentReviews.length) {
        reviewIndex = 0;
    }

    updateReviews();
    restartReviews();
}

function startReviews() {
    clearInterval(reviewTimer);
    reviewTimer = setInterval(function() {
        goReview(1);
    }, 5500);
}

function restartReviews() {
    clearInterval(reviewTimer);
    startReviews();
}

if (prevReview) {
    prevReview.addEventListener("click", function() {
        goReview(-1);
    });
}

if (nextReviewBtn) {
    nextReviewBtn.addEventListener("click", function() {
        goReview(1);
    });
}

function likeReview(i) {
    if (currentReviews[i].voted === "like") {
        currentReviews[i].likes--;
        currentReviews[i].voted = null;
    } else {
        if (currentReviews[i].voted === "dislike") {
            currentReviews[i].dislikes--;
        }

        currentReviews[i].likes++;
        currentReviews[i].voted = "like";
    }

    renderReviews();
}

function dislikeReview(i) {
    if (currentReviews[i].voted === "dislike") {
        currentReviews[i].dislikes--;
        currentReviews[i].voted = null;
    } else {
        if (currentReviews[i].voted === "like") {
            currentReviews[i].likes--;
        }

        currentReviews[i].dislikes++;
        currentReviews[i].voted = "dislike";
    }

    renderReviews();
}

function openReviewModal() {
    if (!reviewModal) return;

    modalName.value = "";
    modalMessage.value = "";
    modalSuccess.classList.remove("show");
    reviewModal.classList.add("show");
}

function closeModal() {
    reviewModal.classList.remove("show");
    modalSuccess.classList.remove("show");
}

if (addReviewBtn) {
    addReviewBtn.addEventListener("click", openReviewModal);
}

if (modalClose) {
    modalClose.addEventListener("click", closeModal);
}

if (reviewModal) {
    reviewModal.addEventListener("click", function(event) {
        if (event.target === reviewModal) {
            closeModal();
        }
    });
}

if (modalSubmit) {
    modalSubmit.addEventListener("click", function() {
        const name = modalName.value.trim();
        const message = modalMessage.value.trim();

        if (name === "" || message === "") {
            return;
        }

        currentReviews.unshift({
            name: name,
            img: "../images/icon.png",
            text: message,
            likes: 0,
            dislikes: 0,
            date: 0,
            voted: null
        });

        reviewIndex = 0;

        modalSuccess.classList.add("show");

        setTimeout(function() {
            closeModal();
            renderReviews();
            restartReviews();
        }, 800);
    });
}

reviewTabs.forEach(function(tab) {
    tab.addEventListener("click", function() {
        reviewTabs.forEach(function(t) {
            t.classList.remove("active");
        });

        tab.classList.add("active");

        if (tab.dataset.filter === "popular") {
            currentReviews.sort(function(a, b) {
                return b.likes - a.likes;
            });
        } else {
            currentReviews.sort(function(a, b) {
                return a.date - b.date;
            });
        }

        reviewIndex = 0;
        renderReviews();
        restartReviews();
    });
});

if (reviewsSlider) {
    reviewsSlider.addEventListener("mouseenter", function() {
        clearInterval(reviewTimer);
    });

    reviewsSlider.addEventListener("mouseleave", function() {
        startReviews();
    });

    renderReviews();
    startReviews();
}

/* ===========================
   MOMENTS — Scroll Reveal
   =========================== */

const momentsSection = document.querySelector(".moments");

function showMoments() {
    if (!momentsSection) return;
    if (momentsSection.getBoundingClientRect().top < window.innerHeight - 100) {
        momentsSection.classList.add("show");
    }
}

window.addEventListener("scroll", showMoments);
showMoments();


/* ===========================
   AUTH — Login / Sign Up
=========================== */

function authSwitch(tab, clickedBtn) {
    document.getElementById("auth-login").classList.toggle("hidden", tab !== "login");
    document.getElementById("auth-register").classList.toggle("hidden", tab !== "register");
    document.getElementById("auth-success").classList.add("hidden");

    document.querySelectorAll(".auth-tab").forEach(function(btn) {
        btn.classList.remove("active");
    });

    if (clickedBtn) clickedBtn.classList.add("active");
}

function toggleEye(inputId, btn) {
    const inp = document.getElementById(inputId);
    if (!inp) return;

    if (inp.type === "password") {
        inp.type = "text";
        btn.textContent = "🙈";
    } else {
        inp.type = "password";
        btn.textContent = "👁";
    }
}

function validateAinp(el) {
    if (!el) return false;

    const val = el.value.trim();

    if (val === "") {
        el.classList.remove("valid");
        el.classList.add("invalid");
        return false;
    }

    if (el.type === "email") {
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (!emailOk) {
            el.classList.remove("valid");
            el.classList.add("invalid");
            return false;
        }
    }

    if (el.id === "r-telefon") {
        const phoneOk = /^\+373 \d{2} \d{3} \d{3}$/.test(val);
        if (!phoneOk) {
            el.classList.remove("valid");
            el.classList.add("invalid");
            return false;
        }
    }

    if (el.id === "r-pass" && val.length < 8) {
        el.classList.remove("valid");
        el.classList.add("invalid");
        return false;
    }

    el.classList.remove("invalid");
    el.classList.add("valid");
    return true;
}

function showAuthSuccess(name, email, msg = "Bine ai venit!") {
    document.getElementById("auth-login").classList.add("hidden");
    document.getElementById("auth-register").classList.add("hidden");
    document.getElementById("auth-success").classList.remove("hidden");

    document.getElementById("auth-success-title").textContent = "Succes!";
    document.getElementById("auth-success-msg").textContent = msg;

    document.getElementById("auth-user-badge").innerHTML = `
        <div class="auth-user-av">${name.charAt(0).toUpperCase()}</div>
        <div>
            <div class="auth-user-name">${name}</div>
            <div class="auth-user-email">${email}</div>
        </div>
    `;
}

function doRegister(btn) {
    const numeEl = document.getElementById("r-nume");
    const prenumeEl = document.getElementById("r-prenume");
    const emailEl = document.getElementById("r-email");
    const telefonEl = document.getElementById("r-telefon");
    const passEl = document.getElementById("r-pass");
    const pass2El = document.getElementById("r-pass2");

    let ok = true;

    [numeEl, prenumeEl, emailEl, telefonEl, passEl, pass2El].forEach(function(el) {
        if (!validateAinp(el)) ok = false;
    });

    if (passEl.value !== pass2El.value) {
        pass2El.classList.add("invalid");
        btn.textContent = "✗ Parolele nu coincid";
        setTimeout(function() {
            btn.textContent = "Creează Cont";
        }, 2000);
        return;
    }

    if (!ok) return;

    const user = {
        name: numeEl.value.trim() + " " + prenumeEl.value.trim(),
        email: emailEl.value.trim(),
        telefon: telefonEl.value.trim(),
        pass: passEl.value
    };

    let accounts = JSON.parse(localStorage.getItem("musik_accounts") || "[]");

    const exists = accounts.some(function(account) {
        return account.email === user.email;
    });

    if (exists) {
        btn.textContent = "✗ Email deja folosit";
        setTimeout(function() {
            btn.textContent = "Creează Cont";
        }, 2000);
        return;
    }

    accounts.push(user);
    localStorage.setItem("musik_accounts", JSON.stringify(accounts));
    localStorage.setItem("musik_user", JSON.stringify(user));

    accounts.forEach(function(user) {
        console.log("User:", user.name, user.email);
    });

    fetch("http://localhost:3000/save-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(function(res) {
        return res.json();
    })
    .then(function(data) {
        console.log("Salvat în data.json:", data);
    })
    .catch(function(err) {
        console.log("Eroare server:", err);
    });

    btn.textContent = "✓ Cont creat!";
    btn.classList.add("sent");

    setTimeout(function() {
        showAuthSuccess(user.name, user.email, "Cont creat cu succes!");
    }, 500);
}

function doLogin(btn) {
    const emailEl = document.getElementById("l-email");
    const passEl = document.getElementById("l-pass");

    let ok = true;

    [emailEl, passEl].forEach(function(el) {
        if (!validateAinp(el)) ok = false;
    });

    if (!ok) return;

    const accounts = JSON.parse(localStorage.getItem("musik_accounts") || "[]");

    const found = accounts.find(function(account) {
        return account.email === emailEl.value.trim() &&
               account.pass === passEl.value;
    });

    if (!found) {
        btn.textContent = "✗ Date incorecte";
        btn.classList.add("err");

        setTimeout(function() {
            btn.textContent = "Login";
            btn.classList.remove("err");
        }, 2000);

        return;
    }

    localStorage.setItem("musik_user", JSON.stringify(found));

    btn.textContent = "✓ Succes!";
    btn.classList.add("sent");

    setTimeout(function() {
        showAuthSuccess(found.name, found.email, "Autentificat cu succes!");
    }, 500);
}

function doLogout() {
    localStorage.removeItem("musik_user");
    document.getElementById("auth-success").classList.add("hidden");
    authSwitch("login", document.querySelectorAll(".auth-tab")[0]);
}

/* Telefon Moldova auto-format: +373 60 000 000 */
const telInput = document.getElementById("r-telefon");

if (telInput) {
    telInput.value = "+373 ";

    telInput.addEventListener("input", function() {
        let digits = this.value.replace(/\D/g, "");

        if (digits.startsWith("373")) {
            digits = digits.slice(3);
        }

        digits = digits.slice(0, 8);

        let formatted = "+373 ";

        if (digits.length > 0) formatted += digits.substring(0, 2);
        if (digits.length > 2) formatted += " " + digits.substring(2, 5);
        if (digits.length > 5) formatted += " " + digits.substring(5, 8);

        this.value = formatted;
    });
}