# Spoti-4-NZXT 🎵💻

**Spoti-4-NZXT** is a web application that integrates Spotify with NZXT Kraken Z3 Series LCD displays, allowing users to display the currently playing track directly on their device. This provides a seamless and visually appealing way to personalize your Kraken LCD experience.

---

## Features ✨

- Display the currently playing Spotify track on your NZXT Kraken Z3 LCD.
- Adaptive background colors based on the album artwork.
- Fully responsive design for the Kraken's 320x320 resolution display.
- Simple setup using Spotify API and NZXT CAM's Web Integration feature.

---

## Installation 📦

### Prerequisites
- [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/) installed.
- A [Spotify Developer Account](https://developer.spotify.com/) to set up API credentials.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Tlanglois35/Spoti-4-NZXT.git
   cd Spoti-4-NZXT
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your .env file with the following:
   ```bash
   SPOTIFY_CLIENT_ID=<your-client-id>
   SPOTIFY_CLIENT_SECRET=<your-client-secret>
   FLASK_APP=app.py
   ```
   Replace <your-client-id> and <your-client-secret> with your Spotify API credentials.
   
4. Run the application:
   ```bash
   flask run
   ```
---

## Setup for NZXT CAM 📺

1. Open NZXT CAM.
2. Navigate to Lighting and select Web Integration.
3. Click Custom and add the URL where your application is hosted (e.g., http://localhost:5000).
4. Save and configure as needed.

---

### Screenshots 🖼️

Exemples:
![Capture d'écran 2024-11-18 190347](https://github.com/user-attachments/assets/e5ede1cc-16d7-455a-a36d-ce91e4f85844)
![Capture d'écran 2024-11-18 195616](https://github.com/user-attachments/assets/3e74c4a7-b65d-4ccf-a9ad-4cb671546c1b)

---

## Contributing 🤝

Contributions are welcome! Feel free to fork the repository, make your changes, and open a pull request.

---

##  License 📜

This is free and unencumbered software released into the public domain.


