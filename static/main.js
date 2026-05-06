const pages = ["home", "aspirants", "ballot"];


/* PAGE NAVIGATION */
function showPage(page) {

    pages.forEach(p => {
        document.getElementById(p).style.display =
            (p === page) ? "block" : "none";
    });

}


/* NAVIGATION LINKS */
document.querySelectorAll(".nav-link").forEach(el => {

    el.onclick = () => {

        if (!localStorage.getItem("token")) {
            alert("Login required.");
            return;
        }

        showPage(el.dataset.page);

        if (el.dataset.page === "ballot") {
            loadResults();
        }

    };

});


/* DEFAULT PAGE */
showPage("home");


/* LOGIN */
document.getElementById("loginBtn").onclick = async () => {

    let reg = document.getElementById("regNo").value.trim();
    let pass = document.getElementById("password").value.trim();

    try {

        let res = await fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                admission_no: reg,
                password: pass
            })
        });

        let data = await res.json();

        if (data.token) {

            localStorage.setItem("token", data.token);
            localStorage.setItem("student_id", data.student_id);

            alert("Login successful!");

            showPage("aspirants");
            loadAspirants();

        } else {
            alert("Login failed.");
        }

    } catch(error) {

        console.error(error);
        alert("Server error.");

    }

};


// SHOW REGISTER FORM
document.getElementById("registerLink").onclick = function(e) {
    e.preventDefault();

    let box = document.getElementById("register-box");

    box.style.display =
        (box.style.display === "none") ? "block" : "none";
};


// REGISTER BUTTON (UPDATED INPUTS)
document.getElementById("registerBtn").onclick = async () => {

    let reg = document.getElementById("regNoReg").value.trim();
    let pass = document.getElementById("passwordReg").value.trim();

    if (!reg || !pass) {
        alert("Enter admission number and password");
        return;
    }

    let res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            admission_no: reg,
            password: pass
        })
    });

    let data = await res.json();

    alert(data.message);
};


/* LOAD ASPIRANTS */
async function loadAspirants() {

    try {

        let res = await fetch("http://127.0.0.1:8000/api/aspirants/");
        let data = await res.json();

        let container = document.getElementById("aspirants-list");
        container.innerHTML = "";

        data.forEach(a => {

            container.innerHTML += `
                <div class="aspirant-card">
                    <h3>${a.name}</h3>
                    <p>${a.position}</p>
                    <button onclick="vote(${a.id})">Vote</button>
                </div>
            `;

        });

    } catch(error) {

        console.error(error);
        alert("Could not load aspirants.");

    }

}


/* VOTE */
async function vote(id) {

    let res = await fetch("http://127.0.0.1:8000/api/vote/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            aspirant: id,
            student_id: localStorage.getItem("student_id")
        })
    });

    let text = await res.text();

    console.log("RAW RESPONSE:", text);

    try {
        let data = JSON.parse(text);
        alert(data.message);
    } catch (e) {
        console.error("Not JSON response:", text);
        alert("Server error (check console)");
    }

}


/* LIVE RESULTS */
async function loadResults() {

    try {

        let res = await fetch("http://127.0.0.1:8000/api/results/");
        let results = await res.json();

        let div = document.getElementById("live-results");
        div.innerHTML = "";

        results.forEach(r => {

            div.innerHTML += `
                <div class="results-bar">
                    <strong>${r.aspirant}</strong>

                    <div class="progress">
                        <div class="progress-inner"
                             style="width:${r.percent}%;"></div>
                    </div>

                    <small>
                        ${r.votes} votes (${r.percent}%)
                    </small>
                </div>
            `;

        });

    } catch(error) {

        console.error("Results error:", error);

    }

}


/* AUTO REFRESH RESULTS */
setInterval(loadResults, 4000);