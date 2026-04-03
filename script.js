const compass = document.getElementById('compass');
const directionText = document.getElementById('directionText');
const degreeText = document.getElementById('degreeText');
const statusBadge = document.getElementById('statusBadge');
const suggestionBox = document.getElementById('suggestionBox');
const roomSelect = document.getElementById('roomSelect');
const startBtn = document.getElementById('startBtn');

const vastuData = {
    "North": { best: ["living", "pooja"], bad: ["toilet", "kitchen"] },
    "North-East": { best: ["pooja", "entrance"], bad: ["toilet", "kitchen"] },
    "East": { best: ["living", "entrance"], bad: ["bedroom"] },
    "South-East": { best: ["kitchen"], bad: ["bedroom", "pooja"] },
    "South": { best: ["bedroom"], bad: ["pooja", "kitchen"] },
    "South-West": { best: ["bedroom"], bad: ["entrance", "pooja"] },
    "West": { best: ["dining", "toilet"], bad: ["pooja"] },
    "North-West": { best: ["bedroom", "toilet"], bad: ["kitchen"] }
};

function getDirection(deg) {
    if (deg >= 337.5 || deg < 22.5) return "North";
    if (deg >= 22.5 && deg < 67.5) return "North-East";
    if (deg >= 67.5 && deg < 112.5) return "East";
    if (deg >= 112.5 && deg < 157.5) return "South-East";
    if (deg >= 157.5 && deg < 202.5) return "South";
    if (deg >= 202.5 && deg < 247.5) return "South-West";
    if (deg >= 247.5 && deg < 292.5) return "West";
    if (deg >= 292.5 && deg < 337.5) return "North-West";
}

function updateVastu(dir) {
    const selectedRoom = roomSelect.value;
    const data = vastuData[dir];
    
    directionText.innerText = dir;
    
    // Check compatibility
    let isGood = data.best.includes(selectedRoom);
    let isBad = data.bad.includes(selectedRoom);

    if (isGood) {
        statusBadge.innerText = "EXCELLENT LOCATION";
        statusBadge.style.backgroundColor = "#27ae60"; // Green
        suggestionBox.innerText = `This is the perfect spot for a ${selectedRoom}.`;
    } else if (isBad) {
        statusBadge.innerText = "POOR LOCATION";
        statusBadge.style.backgroundColor = "#c0392b"; // Red
        suggestionBox.innerText = `Avoid placing a ${selectedRoom} here. High Vastu dosh.`;
    } else {
        statusBadge.innerText = "NEUTRAL";
        statusBadge.style.backgroundColor = "#7f8c8d"; // Grey
        suggestionBox.innerText = `Average location for a ${selectedRoom}. Remedies may help.`;
    }
}

function initCompass() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response == 'granted') {
                    window.addEventListener('deviceorientation', handler, true);
                }
            }).catch(console.error);
    } else {
        window.addEventListener('deviceorientationabsolute', handler, true);
    }
    startBtn.style.display = 'none';
}

function handler(e) {
    let compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    let rounded = Math.round(compass);
    
    // Rotate the dial
    document.getElementById('compass').style.transform = `rotate(${-rounded}deg)`;
    degreeText.innerText = `${rounded}°`;
    
    const dir = getDirection(rounded);
    updateVastu(dir);
}

startBtn.addEventListener('click', initCompass);
roomSelect.addEventListener('change', () => {
    // Re-check vastu when room type changes
    const currentDeg = parseInt(degreeText.innerText);
    updateVastu(getDirection(currentDeg));
});