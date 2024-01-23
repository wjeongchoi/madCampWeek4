function showToast(message, backgroundColor = "#A4A4A4") {
    var toast = document.createElement("div");
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = backgroundColor;
    toast.style.color = "white";
    toast.style.padding = "10px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "1000";

    document.body.appendChild(toast);

    setTimeout(function () {
        document.body.removeChild(toast);
    }, 3000);
}
