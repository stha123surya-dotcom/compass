/* script.js */
const sectors = [
  { name: "North", range: [337.5, 22.5], best: "Living room, entrance", avoid: "Kitchen" },
  { name: "North-East (Ishan)", range: [22.5, 67.5], best: "Puja room, meditation", avoid: "Bedroom" },
  { name: "East", range: [67.5, 112.5], best: "Living room, study", avoid: "Toilet" },
  { name: "South-East (Aagneya)", range: [112.5, 157.5], best: "Kitchen", avoid: "Bedroom" },
  { name: "South", range: [157.5, 202.5], best: "Staircase, storage", avoid: "Entrance" },
  { name: "South-West (Nairitya)", range: [202.5, 247.5], best: "Master bedroom", avoid: "Kitchen" },
  { name: "West", range: [247.5, 292.5], best: "Kids room, study", avoid: "Puja room" },
  { name: "North-West (Baaybya)", range: [292.5, 337.5], best: "Guest room", avoid: "Kitchen" }
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
    document.getElementById("vastuResult").innerHTML = `
      <b>Best rooms:</b> ${dir.best}<br>
      <b>Should avoid:</b> ${dir.avoid}
    `;
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
