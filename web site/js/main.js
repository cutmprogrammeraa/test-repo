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
        img: "images/review-1.jpg",
        text: "Ca artist, am participat atât ca performer cât și ca spectator. Nivelul tehnic și profesionalismul echipei Musik nu au egal în industrie.",
        likes: 18,
        dislikes: 1,
        date: 1,
        voted: null
    },
    {
        name: "Maria Ionescu",
        img: "images/review-2.jpg",
        text: "Tot procesul a fost rapid, iar concertul a fost minunat. Atmosfera a fost exact cum mi-am dorit.",
        likes: 9,
        dislikes: 0,
        date: 2,
        voted: null
    },
    {
        name: "Elena Marinescu",
        img: "images/review-3.jpg",
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
                <img src="${review.img}" alt="${review.name}">
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
            img: "images/review-default.jpg",
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
   localStorage + feedback vizual
   =========================== */

const AUTH_LOGIN_FIELDS  = [
    { id: "l-name",  key: "musik_l_name"  },
    { id: "l-email", key: "musik_l_email" },
    { id: "l-phone", key: "musik_l_phone" }
];

const AUTH_SIGNUP_FIELDS = [
    { id: "s-name",  key: "musik_s_name"  },
    { id: "s-email", key: "musik_s_email" },
    { id: "s-phone", key: "musik_s_phone" }
];

/* Comută tab-ul activ */
function authSwitch(tab, clickedBtn) {
    document.querySelectorAll(".auth-tab").forEach(function(b) { b.classList.remove("active"); });
    if (clickedBtn) clickedBtn.classList.add("active");

    document.getElementById("auth-login").classList.toggle("hidden",   tab !== "login");
    document.getElementById("auth-signup").classList.toggle("hidden",  tab !== "signup");
    document.getElementById("auth-success").classList.add("hidden");
}

/* Arată/ascunde parolă */
function toggleEye(inputId, btn) {
    var inp = document.getElementById(inputId);
    if (!inp) return;
    var show = inp.type === "password";
    inp.type = show ? "text" : "password";
    btn.textContent = show ? "🙈" : "👁";
}

/* Validare câmp */
function validateAinp(el) {
    var val = el.value.trim();
    if (!val) { el.classList.remove("valid"); el.classList.add("invalid"); return false; }
    if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        el.classList.remove("valid"); el.classList.add("invalid"); return false;
    }
    el.classList.remove("invalid"); el.classList.add("valid"); return true;
}

/* Salvare localStorage + indicator */
function saveAinp(key, value, siId, siTxtId) {
    localStorage.setItem(key, value);
    var ind = document.getElementById(siId);
    var txt = document.getElementById(siTxtId);
    if (!ind || !txt) return;
    ind.classList.add("active");
    txt.textContent = "✓ Salvat automat";
    clearTimeout(window["_si_" + siId]);
    window["_si_" + siId] = setTimeout(function() {
        ind.classList.remove("active");
        txt.textContent = "Date salvate în browser";
    }, 1800);
}

/* Încarcă date din localStorage */
function loadAuthData() {
    AUTH_LOGIN_FIELDS.concat(AUTH_SIGNUP_FIELDS).forEach(function(f) {
        var el = document.getElementById(f.id);
        var saved = localStorage.getItem(f.key);
        if (el && saved) { el.value = saved; el.classList.add("has-val"); }
    });
}

/* Atașează events pe câmpuri */
function initAuthInputs(fields, siId, siTxtId) {
    fields.forEach(function(f) {
        var el = document.getElementById(f.id);
        if (!el) return;
        el.addEventListener("input", function() {
            saveAinp(f.key, el.value, siId, siTxtId);
            validateAinp(el);
            el.classList.toggle("has-val", el.value.trim() !== "");
        });
        el.addEventListener("blur", function() { validateAinp(el); });
    });
}

/* Afișează success state */
function showAuthSuccess(name, email, msg) {
    document.getElementById("auth-login").classList.add("hidden");
    document.getElementById("auth-signup").classList.add("hidden");
    document.getElementById("auth-success").classList.remove("hidden");
    document.querySelectorAll(".auth-tab").forEach(function(t) { t.style.display = "none"; });

    document.getElementById("auth-success-title").textContent = msg || "Autentificat!";
    document.getElementById("auth-success-msg").textContent = "Bine ai venit, " + name + "!";

    var badge = document.getElementById("auth-user-badge");
    badge.innerHTML =
        '<div class="auth-user-av">' + name.charAt(0).toUpperCase() + "</div>" +
        '<div><div class="auth-user-name">' + name + "</div>" +
        '<div class="auth-user-email">' + email + "</div></div>";
}

/* Verifică dacă e logat */
function checkAuthLoggedIn() {
    var user = JSON.parse(localStorage.getItem("musik_user") || "null");
    if (user) showAuthSuccess(user.name, user.email, "Bine ai revenit!");
}

/* LOGIN */
function doLogin(btn) {
    var nameEl  = document.getElementById("l-name");
    var emailEl = document.getElementById("l-email");
    var passEl  = document.getElementById("l-pass");
    var ok = true;
    [nameEl, emailEl, passEl].forEach(function(el) { if (!validateAinp(el)) ok = false; });

    if (!ok) { btn.classList.add("shake"); setTimeout(function() { btn.classList.remove("shake"); }, 500); return; }

    var accounts = JSON.parse(localStorage.getItem("musik_accounts") || "[]");
    var found = null;
    accounts.forEach(function(a) { if (a.email === emailEl.value.trim() && a.pass === passEl.value) found = a; });

    if (!found && accounts.length > 0) {
        btn.classList.add("err"); btn.textContent = "✗ Date incorecte";
        passEl.classList.add("invalid");
        setTimeout(function() { btn.classList.remove("err"); btn.textContent = "Login"; }, 2200);
        return;
    }

    btn.classList.add("sending"); btn.textContent = "Se autentifică...";
    setTimeout(function() {
        var user = found || { name: nameEl.value.trim(), email: emailEl.value.trim() };
        localStorage.setItem("musik_user", JSON.stringify(user));
        btn.classList.remove("sending"); btn.classList.add("sent"); btn.textContent = "✓ Succes!";
        setTimeout(function() { showAuthSuccess(user.name, user.email); }, 550);
    }, 1000);
}

/* SIGN UP */
function doSignup(btn) {
    var nameEl  = document.getElementById("s-name");
    var emailEl = document.getElementById("s-email");
    var passEl  = document.getElementById("s-pass");
    var pass2El = document.getElementById("s-pass2");
    var ok = true;
    [nameEl, emailEl, passEl, pass2El].forEach(function(el) { if (!validateAinp(el)) ok = false; });

    if (passEl.value !== pass2El.value) {
        pass2El.classList.add("invalid");
        btn.classList.add("err", "shake");
        var orig = btn.textContent; btn.textContent = "✗ Parolele nu coincid!";
        setTimeout(function() { btn.classList.remove("err", "shake"); btn.textContent = orig; }, 2200);
        return;
    }

    if (!ok) { btn.classList.add("shake"); setTimeout(function() { btn.classList.remove("shake"); }, 500); return; }

    btn.classList.add("sending"); btn.textContent = "Se creează contul...";
    setTimeout(function() {
        var user = { name: nameEl.value.trim(), email: emailEl.value.trim(), pass: passEl.value };
        var accounts = JSON.parse(localStorage.getItem("musik_accounts") || "[]");
        accounts.push(user); localStorage.setItem("musik_accounts", JSON.stringify(accounts));
        localStorage.setItem("musik_user", JSON.stringify(user));

        fetch("/save-user", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
})
.then(function(response) {
    return response.json();
})
.then(function(data) {
    console.log("Trimis la server:", data);
})
.catch(function(error) {
    console.log("Eroare la salvare:", error);
});

        AUTH_SIGNUP_FIELDS.forEach(function(f) {
            var el = document.getElementById(f.id);
            if (el) { el.value = ""; el.classList.remove("valid","invalid","has-val"); }
            localStorage.removeItem(f.key);
        });
        ["s-pass","s-pass2"].forEach(function(id) {
            var el = document.getElementById(id); if (el) el.value = "";
        });

        btn.classList.remove("sending"); btn.classList.add("sent"); btn.textContent = "✓ Cont creat!";
        setTimeout(function() { showAuthSuccess(user.name, user.email, "Cont creat cu succes!"); }, 550);
    }, 1200);
}

/* LOGOUT */
function doLogout() {
    localStorage.removeItem("musik_user");
    document.getElementById("auth-success").classList.add("hidden");
    document.querySelectorAll(".auth-tab").forEach(function(t) { t.style.display = ""; });
    var btnL = document.getElementById("btn-login");
    var btnS = document.getElementById("btn-signup");
    if (btnL) { btnL.className = "auth-btn"; btnL.textContent = "Login"; }
    if (btnS) { btnS.className = "auth-btn"; btnS.textContent = "Creează Cont"; }
    authSwitch("login", document.querySelector(".auth-tab"));
}

/* INIT */
document.addEventListener("DOMContentLoaded", function() {
    initAuthInputs(AUTH_LOGIN_FIELDS,  "si-login",  "si-login-txt");
    initAuthInputs(AUTH_SIGNUP_FIELDS, "si-signup", "si-signup-txt");
    loadAuthData();
    checkAuthLoggedIn();
});