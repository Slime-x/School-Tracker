function updateClock() {

    const now = new Date();

    const date = now.toLocaleDateString("en-Us", {
        weekday: "long",
        month: "short",
        day: "numeric"
    });
    document.getElementById("date").textContent = date;

}


updateClock();
setInterval(updateClock, 1000);
