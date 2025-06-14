const btn = document.querySelector("#btn");
const content = document.querySelector("#content");
const voice = document.querySelector("#voice"); 

// Check if browser supports speech synthesis and recognition
const isSpeechSupported = "speechSynthesis" in window;
const isRecognitionSupported = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!isSpeechSupported || !isRecognitionSupported) {
    alert("Sorry, your browser does not support speech recognition or synthesis.");
}

// Speak function to handle text-to-speech
function speak(text) {
    if (!isSpeechSupported) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.lang = "hi-IN";
    utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
    };
    window.speechSynthesis.speak(utterance);
}

// Greet user based on time of day
function wishMe() { 
    if (!isSpeechSupported) return;

    const hour = new Date().getHours();
    let greeting = "";
    if (hour >= 0 && hour < 12) { 
        greeting = "Good Morning Sir";
    } else if (hour >= 12 && hour < 17) { 
        greeting = "Good Afternoon Sir";
    } else if (hour >= 17 && hour < 20) { 
        greeting = "Good Evening Sir";
    } else { // Night (20–23)
        greeting = "Good Night Sir";
    }
    speak(greeting);
}

// Run greeting on page load
window.addEventListener("load", wishMe);

// Initialize speech recognition
let recognition = null;
if (isRecognitionSupported) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new Recognition();
    recognition.onresult = (event) => {
        const currentIndex = event.resultIndex; 
        const transcript = event.results[currentIndex][0].transcript.toLowerCase().trim();
        content.innerText = transcript; // Display recognized text

        takeCommand(transcript);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        speak("Sorry, I couldn't understand. Please try again.");
        if (voice) voice.style.display = "none";
        if (btn) btn.style.display = "flex";
    };

    recognition.onend = () => {
        if (voice) voice.style.display = "none";
        if (btn) btn.style.display = "flex";
    };
}

// Handle button click
if (btn) {
    btn.addEventListener("click", () => {
        if (!isRecognitionSupported) {
            speak("Speech recognition is not supported in this browser.");
            return;
        }
        recognition.start();
        if (voice) voice.style.display = "block";
        if (btn) btn.style.display = "none";
        speak("Listening...");
    });
}

// Process voice commands
function takeCommand(message) {
    if (!isSpeechSupported) return;

    if (voice) voice.style.display = "none";
    if (btn) btn.style.display = "flex";

    // Command handlers
    if (message.includes("hello") || message.includes("hey")) { 
        speak("Hello Sir, I am Andy, your voice assistant created by Ayush. How can I help you?");
    } else if (message.includes("who are you")) {
        speak("I am Andy, your voice assistant, created by Ayush Sir.");
    } else if (message.includes("thank you")) {
        speak("I always support powerful people!");
    } else if (message.includes("time")) {
        const time = new Date().toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
        speak(`The time is ${time}`);
    } else if (message.includes("date")) {
        const date = new Date().toLocaleString("en-US", { day: "numeric", month: "short" });
        speak(`Today is ${date}`);
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://www.youtube.com", "_blank");
    } else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://www.google.com", "_blank");
    } else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://www.instagram.com", "_blank");
    } else if (message.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://www.facebook.com", "_blank");
    } else if (message.includes("open calculator")) {
        speak("Sorry, I can't open the calculator app directly. Try a web-based calculator.");
        window.open("https://www.google.com/search?q=online+calculator", "_blank");
    } else if (message.includes("open whatsapp")) {
        speak("Trying to open WhatsApp...");
        try {
            window.location.href = "whatsapp://";
        } catch (e) {
            speak("WhatsApp couldn't be opened. Opening the website instead.");
            window.open("https://web.whatsapp.com", "_blank");
        }
    } else {
        const query = encodeURIComponent(message.replace(/shipra|shifra/gi, "").trim());
        speak(`This is what i found on internet for ${message}`);
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
}