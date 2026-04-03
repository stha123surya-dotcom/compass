const compass = document.getElementById('compass');
const directionText = document.getElementById('directionText');
const degreeText = document.getElementById('degreeText');
const statusRing = document.getElementById('statusRing');
const suggestionBox = document.getElementById('suggestionBox');
const roomSelect = document.getElementById('roomSelect');
const startBtn = document.getElementById('startBtn');

const vastuData = {
    "North": { best: ["living", "entrance", "pooja"], bad: ["bedroom", "septic", "overhead"] },
    "North-East": { best: ["pooja", "entrance", "underground"], bad: ["toilet", "kitchen", "septic", "staircase"] },
    "East": { best: ["living", "entrance", "dining"], bad: ["toilet", "septic"] },
    "South-East": { best: ["kitchen", "parking"], bad: ["underground", "pooja", "bedroom"] },
    "South": { best: ["bedroom", "staircase"], bad: ["underground", "pooja", "entrance"] },
    "South-West": { best: ["bedroom", "overhead", "store"], bad: ["entrance", "pooja", "underground", "septic"] },
    "West": { best: ["dining", "overhead", "toilet", "lift"], bad: ["pooja", "entrance"] },
    "North-West": { best: ["servant", "parking", "septic", "toilet"], bad: ["pooja", "bedroom"] }
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
    
    let isGood = data.best.includes(selectedRoom);
    let isBad = data.bad.includes(selectedRoom);

    if (isGood) {
        statusRing.style.borderColor = "#2ecc71"; // Green
        statusRing.style.boxShadow = "0 0 20px rgba(46, 204, 113, 0.4)";
        suggestionBox.style.borderLeftColor = "#2ecc71";
        suggestionBox.innerText = `EXCELLENT: The ${dir} zone is highly recommended for ${selectedRoom}.`;
    } else if (isBad) {
        statusRing.style.borderColor = "#e74c3c"; // Red
        statusRing.style.boxShadow = "0 0 20px rgba(231, 76, 60, 0.4)";
        suggestionBox.style.borderLeftColor = "#e74c3c";
        suggestionBox.innerText = `AVOID: ${selectedRoom} in ${dir} is considered a major Vastu defect.`;
    } else {
        statusRing.style.borderColor = "#95a5a6"; // Grey
        statusRing.style.boxShadow = "none";
        suggestionBox.style.borderLeftColor = "#95a5a6";
        suggestionBox.innerText = `NEUTRAL: ${selectedRoom} in ${dir} is acceptable with minor adjustments.`;
    }
}

function initCompass() {
    // Standard Permission handling for iOS/Modern Browsers
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response == 'granted') {
                    window.addEventListener('deviceorientation', handler, true);
                    startBtn.style.display = 'none';
                }
            }).catch(e => alert("Please use a mobile device and enable sensors."));
    } else {
        window.addEventListener('deviceorientationabsolute', handler, true);
        startBtn.style.display = 'none';
    }
}

function handler(e) {
    // Check for webkit heading first (iOS), otherwise use alpha (Android)
    let heading = e.webkitCompassHeading || (360 - e.alpha);
    let rounded = Math.round(heading);
    
    // Rotate dial opposite to device movement
    compass.style.transform = `rotate(${-rounded}deg)`;
    degreeText.innerText = `${rounded}°`;
    
    const dir = getDirection(rounded);
    updateVastu(dir);
}

startBtn.addEventListener('click', initCompass);
roomSelect.addEventListener('change', () => {
    const currentDir = directionText.innerText;
    if(currentDir !== "North") updateVastu(currentDir);
});