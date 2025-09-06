export function updateBalance(bal) {
    document.querySelector(".balance-text.amount").textContent = `₹${bal.toFixed(2)}`;
}

export function addNotification(message, type = "success") {
    const wrapper = document.querySelector(".game-notification-wrapper");

    const animatedDiv = document.createElement("div");
    animatedDiv.className = "game-notification-animated sm";

    const notificationDiv = document.createElement("div");
    notificationDiv.className = `game-notification ${type} sm`;

    const p = document.createElement("p");
    p.className = "game-notification-text";
    p.textContent = message;

    wrapper.innerHTML = "";
    notificationDiv.appendChild(p);
    animatedDiv.appendChild(notificationDiv);
    wrapper.appendChild(animatedDiv);

    setTimeout(() => {
        animatedDiv.remove();
    }, 1500);
}
