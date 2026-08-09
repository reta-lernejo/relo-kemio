import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Globale Variablen ---
let scene, camera, renderer, controls;
let hofmannApparatus;
let liquidH2, liquidO2, liquidMiddle; // Flüssigkeitsmeshes
let bubbles = [];
let simulationRunning = false;
let gasVolumeH2 = 0;
let gasVolumeO2 = 0;

// --- Konstanten ---
const TUBE_RADIUS = 0.5;
const TUBE_HEIGHT = 10;
const TUBE_SPACING = TUBE_RADIUS * 3;
const ELECTRODE_HEIGHT = 0.5;
const ELECTRODE_RADIUS = TUBE_RADIUS * 0.8;
const LIQUID_START_HEIGHT = TUBE_HEIGHT * 0.9; // Höhe bis wohin die äußeren Röhren gefüllt sind
const MAX_GAS_HEIGHT = TUBE_HEIGHT * 0.8; // Max. Höhe, die Gas einnehmen kann
const BUBBLE_RATE = 5; // Blasen pro Sekunde (ungefähr)
const GAS_PRODUCTION_RATE = 0.1; // Einheiten Gasvolumen pro Sekunde

// --- HTML Elemente ---
const volH2Element = document.getElementById('vol-h2');
const volO2Element = document.getElementById('vol-o2');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const canvasContainer = document.getElementById('canvas-container');

// --- Initialisierung ---
function init() {
    // Szene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    // Kamera
    camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, TUBE_HEIGHT / 2, TUBE_HEIGHT * 1.8);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);

    // Licht
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, TUBE_HEIGHT / 2, 0); // Zentriert auf den Apparat
    controls.update();

    // Hofmann Apparat erstellen
    createHofmannApparatus();

    // Event Listener
    startButton.addEventListener('click', startSimulation);
    resetButton.addEventListener('click', resetSimulation);
    window.addEventListener('resize', onWindowResize);

    // Erste Simulation zurücksetzen (initiale Zustände setzen)
    resetSimulation();

    // Animation starten
    animate();
}

// --- Apparat erstellen ---
function createHofmannApparatus() {
    hofmannApparatus = new THREE.Group();
    scene.add(hofmannApparatus);

    // Materialien
    const glassMaterial = new THREE.MeshPhongMaterial({
        color: 0xadd8e6, // Light blue
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide // Innen und außen sichtbar
    });
    const electrodeMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 }); // Dunkelgrau
    const liquidMaterial = new THREE.MeshPhongMaterial({
        color: 0x4169e1, // Royal blue
        transparent: true,
        opacity: 0.7
    });
    const stopcockMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Braun

    // --- Röhren ---
    const tubeGeometry = new THREE.CylinderGeometry(TUBE_RADIUS, TUBE_RADIUS, TUBE_HEIGHT, 32, 1, true); // Oben und unten offen

    // Kathodenröhre (-) links
    const tubeH2 = new THREE.Mesh(tubeGeometry, glassMaterial);
    tubeH2.position.set(-TUBE_SPACING, TUBE_HEIGHT / 2, 0);
    hofmannApparatus.add(tubeH2);

    // Anodenröhre (+) rechts
    const tubeO2 = new THREE.Mesh(tubeGeometry, glassMaterial);
    tubeO2.position.set(TUBE_SPACING, TUBE_HEIGHT / 2, 0);
    hofmannApparatus.add(tubeO2);

    // Mittelröhre
    const tubeMiddle = new THREE.Mesh(tubeGeometry, glassMaterial);
    tubeMiddle.position.set(0, TUBE_HEIGHT / 2, 0);
    hofmannApparatus.add(tubeMiddle);

    // --- Elektroden ---
    const electrodeGeometry = new THREE.CylinderGeometry(ELECTRODE_RADIUS, ELECTRODE_RADIUS, ELECTRODE_HEIGHT, 16);

    // Kathode (-)
    const electrodeH2 = new THREE.Mesh(electrodeGeometry, electrodeMaterial);
    electrodeH2.position.set(-TUBE_SPACING, ELECTRODE_HEIGHT / 2, 0);
    hofmannApparatus.add(electrodeH2);

    // Anode (+)
    const electrodeO2 = new THREE.Mesh(electrodeGeometry, electrodeMaterial);
    electrodeO2.position.set(TUBE_SPACING, ELECTRODE_HEIGHT / 2, 0);
    hofmannApparatus.add(electrodeO2);

    // --- Flüssigkeit (initial) ---
    // Wir erstellen Zylinder, deren Höhe wir später ändern (durch Skalierung und Positionierung)
    const liquidGeometry = new THREE.CylinderGeometry(TUBE_RADIUS * 0.98, TUBE_RADIUS * 0.98, 1, 32); // Höhe 1 als Basis

    liquidH2 = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquidH2.scale.y = LIQUID_START_HEIGHT;
    liquidH2.position.set(-TUBE_SPACING, LIQUID_START_HEIGHT / 2, 0);
    hofmannApparatus.add(liquidH2);

    liquidO2 = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquidO2.scale.y = LIQUID_START_HEIGHT;
    liquidO2.position.set(TUBE_SPACING, LIQUID_START_HEIGHT / 2, 0);
    hofmannApparatus.add(liquidO2);

    // Mittlere Röhre initial etwas höher gefüllt (vereinfacht)
    const middleLiquidHeight = LIQUID_START_HEIGHT * 1.05; // Etwas höher als außen
    liquidMiddle = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquidMiddle.scale.y = middleLiquidHeight;
    liquidMiddle.position.set(0, middleLiquidHeight / 2, 0);
    hofmannApparatus.add(liquidMiddle);


    // --- Verbindung unten (vereinfacht als Box) ---
    const connectorHeight = TUBE_RADIUS;
    const connectorWidth = TUBE_SPACING * 2 + TUBE_RADIUS * 2;
    const connectorGeometry = new THREE.BoxGeometry(connectorWidth, connectorHeight, TUBE_RADIUS * 2);
    const connector = new THREE.Mesh(connectorGeometry, glassMaterial);
    connector.position.set(0, connectorHeight / 2 - TUBE_RADIUS/2 , 0); // Leicht unterhalb der Röhrenbasen
    // Optional: Flüssigkeit auch in der Verbindung
    const connectorLiquidGeometry = new THREE.BoxGeometry(connectorWidth * 0.98, connectorHeight * 0.9, TUBE_RADIUS * 1.9);
    const connectorLiquid = new THREE.Mesh(connectorLiquidGeometry, liquidMaterial);
    connectorLiquid.position.set(0, connectorHeight / 2 - TUBE_RADIUS/2, 0);
    hofmannApparatus.add(connector);
    hofmannApparatus.add(connectorLiquid);


    // --- Hähne (vereinfacht) ---
    const stopcockGeometry = new THREE.CylinderGeometry(TUBE_RADIUS * 0.3, TUBE_RADIUS * 0.3, TUBE_RADIUS * 1.5, 8);
    const stopcockH2 = new THREE.Mesh(stopcockGeometry, stopcockMaterial);
    stopcockH2.rotation.z = Math.PI / 2;
    stopcockH2.position.set(-TUBE_SPACING, TUBE_HEIGHT + TUBE_RADIUS * 0.5, 0);
    hofmannApparatus.add(stopcockH2);

    const stopcockO2 = new THREE.Mesh(stopcockGeometry, stopcockMaterial);
    stopcockO2.rotation.z = Math.PI / 2;
    stopcockO2.position.set(TUBE_SPACING, TUBE_HEIGHT + TUBE_RADIUS * 0.5, 0);
    hofmannApparatus.add(stopcockO2);
}

// --- Simulation starten ---
function startSimulation() {
    if (!simulationRunning) {
        simulationRunning = true;
        startButton.textContent = 'Stop';
        startButton.removeEventListener('click', startSimulation);
        startButton.addEventListener('click', stopSimulation);
    }
}

// --- Simulation stoppen ---
function stopSimulation() {
     if (simulationRunning) {
        simulationRunning = false;
        startButton.textContent = 'Start';
        startButton.removeEventListener('click', stopSimulation);
        startButton.addEventListener('click', startSimulation);
    }
}

// --- Simulation zurücksetzen ---
function resetSimulation() {
    stopSimulation(); // Stellt sicher, dass sie gestoppt ist und der Button korrekt ist
    gasVolumeH2 = 0;
    gasVolumeO2 = 0;

    // Flüssigkeitslevel zurücksetzen
    updateLiquidLevels();

    // Blasen entfernen
    bubbles.forEach(bubble => scene.remove(bubble));
    bubbles = [];

    // UI aktualisieren
    updateUI();
}

// --- Blasen erzeugen ---
const bubbleGeometry = new THREE.SphereGeometry(TUBE_RADIUS * 0.05, 8, 8);
const bubbleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

function createBubble(xPos, startY, targetY) {
    const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bubble.position.set(
        xPos + (Math.random() - 0.5) * ELECTRODE_RADIUS * 1.5, // Leichte Streuung
        startY + (Math.random() * 0.1),
        (Math.random() - 0.5) * ELECTRODE_RADIUS * 1.5
    );
    bubble.userData = {
        startY: bubble.position.y,
        targetY: targetY,
        speed: 0.5 + Math.random() * 1.5 // Variable Geschwindigkeit
    };
    bubbles.push(bubble);
    scene.add(bubble); // Direkt zur Szene hinzufügen, nicht zum Apparat-Group
}

// --- Flüssigkeitslevel aktualisieren ---
function updateLiquidLevels() {
    // Gas Höhe berechnen (vereinfacht, Volumen ~ Höhe in der Röhre)
    let gasHeightH2 = Math.min(gasVolumeH2, MAX_GAS_HEIGHT);
    let gasHeightO2 = Math.min(gasVolumeO2, MAX_GAS_HEIGHT);

    let liquidHeightH2 = LIQUID_START_HEIGHT - gasHeightH2;
    let liquidHeightO2 = LIQUID_START_HEIGHT - gasHeightO2;

    // Sicherstellen, dass Level nicht unter die Elektrode fällt (visuell)
    liquidHeightH2 = Math.max(liquidHeightH2, ELECTRODE_HEIGHT);
    liquidHeightO2 = Math.max(liquidHeightO2, ELECTRODE_HEIGHT);

    // Mesh anpassen (Skalierung und Position)
    liquidH2.scale.y = liquidHeightH2;
    liquidH2.position.y = liquidHeightH2 / 2;

    liquidO2.scale.y = liquidHeightO2;
    liquidO2.position.y = liquidHeightO2 / 2;

     // Mittelröhre: Level steigt leicht, wenn Außenlevel sinken (sehr vereinfacht)
    // const averageOuterHeight = (liquidHeightH2 + liquidHeightO2) / 2;
    // const middleLiquidHeight = LIQUID_START_HEIGHT * 1.05 + (LIQUID_START_HEIGHT - averageOuterHeight) * 0.5;
    // liquidMiddle.scale.y = Math.max(middleLiquidHeight, ELECTRODE_HEIGHT); // Oder Mindesthöhe
    // liquidMiddle.position.y = liquidMiddle.scale.y / 2;
    // --- Einfachere Variante: Mittelröhre bleibt konstant ---
    // Nichts tun für liquidMiddle
}


// --- UI aktualisieren ---
function updateUI() {
    volH2Element.textContent = gasVolumeH2.toFixed(2);
    volO2Element.textContent = gasVolumeO2.toFixed(2);
}

// --- Fenstergröße ändern ---
function onWindowResize() {
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
}

// --- Animationsschleife ---
let lastTime = 0;
let bubbleTimerH2 = 0;
let bubbleTimerO2 = 0;

function animate(time) {
    requestAnimationFrame(animate);

    const delta = (time - (lastTime || time)) / 1000; // Zeit seit letztem Frame in Sekunden
    lastTime = time;

    if (simulationRunning) {
        // Gas produzieren (H2 doppelt so schnell wie O2)
        // Nur produzieren, wenn noch Platz ist
        if (gasVolumeH2 < MAX_GAS_HEIGHT) {
             gasVolumeH2 += GAS_PRODUCTION_RATE * 2 * delta;
        }
        if (gasVolumeO2 < MAX_GAS_HEIGHT) {
            gasVolumeO2 += GAS_PRODUCTION_RATE * 1 * delta;
        }


        // Flüssigkeitslevel und UI aktualisieren
        updateLiquidLevels();
        updateUI();

        // Blasen Timer und Erzeugung
        bubbleTimerH2 += delta;
        bubbleTimerO2 += delta;
        const bubbleInterval = 1 / BUBBLE_RATE;

        // Aktuelle obere Grenze der Flüssigkeit ermitteln
        const liquidTopH2 = liquidH2.position.y + liquidH2.scale.y / 2;
        const liquidTopO2 = liquidO2.position.y + liquidO2.scale.y / 2;

        // H2 Blasen (doppelte Rate)
        while (bubbleTimerH2 > bubbleInterval / 2) { // Hälfte des Intervalls -> doppelte Rate
             if (gasVolumeH2 < MAX_GAS_HEIGHT) { // Nur Blasen wenn Gas produziert wird
                createBubble(-TUBE_SPACING, ELECTRODE_HEIGHT, liquidTopH2);
            }
            bubbleTimerH2 -= bubbleInterval / 2;
        }
        // O2 Blasen
        while (bubbleTimerO2 > bubbleInterval) {
             if (gasVolumeO2 < MAX_GAS_HEIGHT) { // Nur Blasen wenn Gas produziert wird
                createBubble(TUBE_SPACING, ELECTRODE_HEIGHT, liquidTopO2);
             }
            bubbleTimerO2 -= bubbleInterval;
        }
    }

    // Blasen bewegen und entfernen
    const bubblesToRemove = [];
    bubbles.forEach((bubble, index) => {
        bubble.position.y += bubble.userData.speed * delta;
        // Blase entfernen, wenn sie die (aktuelle) Oberfläche erreicht oder überschreitet
        // Wir verwenden userData.targetY zum Zeitpunkt der Erstellung, um nicht ständig neu zu berechnen
        if (bubble.position.y > bubble.userData.targetY) {
            bubblesToRemove.push(index);
            scene.remove(bubble);
        }
    });

    // Entferne Blasen aus dem Array (rückwärts iterieren, um Indizes nicht zu verschieben)
    for (let i = bubblesToRemove.length - 1; i >= 0; i--) {
        bubbles.splice(bubblesToRemove[i], 1);
    }


    controls.update(); // Für OrbitControls
    renderer.render(scene, camera);
}

// --- Start ---
init();

