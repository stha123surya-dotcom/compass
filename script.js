/* script.js */
const sectors = [
  { name: "North", start: 337.5, end: 22.5, msg: "North: Career, opportunities, progress" },
  { name: "North-East (Ishan)", start: 22.5, end: 67.5, msg: "Ishan: Puja room, meditation, positivity" },
  { name: "East", start: 67.5, end: 112.5, msg: "East: Health, vitality, sunrise energy" },
  { name: "South-East (Aagneya)", start: 112.5, end: 157.5, msg: "Aagneya: Kitchen, fire element" },
  { name: "South", start: 157.5, end: 202.5, msg: "South: Stability, strength" },
  { name: "South-West (Nairitya)", start: 202.5, end: 247.5, msg: "Nairitya: Master bedroom, leadership" },
  { name: "West", start: 247.5, end: 292.5, msg: "West: Gains, profits" },
  { name: "North-West (Baaybya)", start: 292.5, end: 337.5, msg: "Baaybya: Guest room, movement, change" }
];

function detectDirection(angle) {
  for (let s of sectors) {
    if (s.start > s.end) {
      if (angle >= s.start || angle < s.end) return s;
    } else if (angle >= s.start && angle < s.end) return s;
  }
}

function updateCompass(event) {
  let heading = event.alpha;

  if (event.webkitCompassHeading !== undefined) heading = event.webkitCompassHeading;

  document.getElementById("needle").style.transform = `rotate(${heading}deg)`;

  const dir = detectDirection(heading);

  if (dir) {
    document.getElementById("directionText").innerText = `${dir.name}`;
    document.getElementById("vastuResult").innerText = dir.msg;
  }
}

function initCompass() {
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission().then(res => {
      if (res === "granted") window.addEventListener("deviceorientation", updateCompass);
    });
  } else {
    window.addEventListener("deviceorientation", updateCompass);
  }
}

initCompass();
