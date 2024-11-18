const progressBar = document.getElementById("progress-bar");
let lastTime = 0;
let lastTimestamp = 0;
let animationFrameId;

// Progress bar update function
function updateProgressBar(rtime, duration, timestamp) {

    const percent = rtime / duration;
    const angle = percent * 360;

    // Update progress bar angle
    progressBar.style.setProperty('--progress-angle', `${angle}deg`);

    animationFrameId = requestAnimationFrame((ts) => updateProgressBar(rtime, duration, ts));
}

// Converts a string in “MM:SS” format into seconds
function timeToSeconds(time) {
    const parts = time.split(':'); // Separates the string into minutes and seconds
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return (minutes * 60 + seconds) * 1000; // Convert to milliseconds
}

// // Function to construct RVB values from image data array
function buildRgb(imageData) {
    const rgbValues = [];
    for (let i = 0; i < imageData.length; i += 4) {
        const rgb = {
            r: imageData[i],
            g: imageData[i + 1],
            b: imageData[i + 2],
        };
        rgbValues.push(rgb);
    }
    return rgbValues;
}

// Color quantization function (simplified)
function quantization(rgbValues, depth) {
    if (rgbValues.length === 0) return [];
    
    const total = rgbValues.reduce((acc, curr) => {
        acc.r += curr.r;
        acc.g += curr.g;
        acc.b += curr.b;
        return acc;
    }, { r: 0, g: 0, b: 0 });

    const count = rgbValues.length;
    const averageColor = {
        r: Math.round(total.r / count),
        g: Math.round(total.g / count),
        b: Math.round(total.b / count),
    };
    return [averageColor]; // Returns the average color
}

function updateTrackInfo() {
    fetch('/current_track')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('track-name').textContent = "Aucune piste en cours";
                document.getElementById('track-artist').textContent = "Aucun";
                document.getElementById('track-time').textContent = "00:00";
                document.getElementById('track-duration').textContent = "00:00";
                document.getElementById('album-image').src = "";  // Delete image
                document.body.style.backgroundColor = "#000000";
            } else {
                const imgElement = document.getElementById('album-image');  // Update image
                imgElement.src = data.album_image_url;

                // Load image into canvas to analyze pixel data
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.crossOrigin = "Anonymous";

                img.onload = function() {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    // Extract pixel data
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const rgbValues = buildRgb(imageData.data); // Function to construct RVB values

                    const palette = quantization(rgbValues, 0); // Implement quantization here

                    if (palette.length > 0) {
                        const color1 = `rgb(${palette[0].r}, ${palette[0].g}, ${palette[0].b})`;// Dominant color
                        const color2 = "rgba(0, 0, 0, 1)"; // Black with opacity
                        document.body.style.background = `radial-gradient(circle, ${color1}, ${color2})`;
                        imgElement.style.border = `4px solid ${color1}`;
                        progressBar.style.backgroundImage = `conic-gradient(#ffffff17 0deg, ${color1} var(--progress-angle, 0deg), transparent 0)`;
                    }
                };

                img.onerror = function() {
                    console.error("Erreur lors du chargement de l'image :", img.src);
                };

                img.src = data.album_image_url;

                // Update progress bar with track duration and current time
                const currentTimeInSeconds = timeToSeconds(data.track_time);
                const durationInSeconds = timeToSeconds(data.track_duration);
                const time = durationInSeconds - currentTimeInSeconds
                const rtime = durationInSeconds - time

                if (currentTimeInSeconds !== lastTime) {
                    requestAnimationFrame((timestamp) => updateProgressBar(rtime, durationInSeconds, timestamp));
                    lastTime = rtime;
                }
            }
        })
        .catch(error => console.error('Erreur:', error));
}

// Update interface every second
setInterval(updateTrackInfo, 600);

// Initialize update on page load
window.onload = updateTrackInfo;
