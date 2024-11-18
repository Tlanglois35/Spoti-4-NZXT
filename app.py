from flask import Flask, jsonify, render_template
import time as t
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Retrieve authentication information from environment variables
SPOTIPY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
SPOTIPY_REDIRECT_URI = os.getenv('SPOTIFY_REDIRECT_URI')

scope = 'user-read-playback-state'
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=SPOTIPY_CLIENT_ID,
                                               client_secret=SPOTIPY_CLIENT_SECRET,
                                               redirect_uri=SPOTIPY_REDIRECT_URI,
                                               scope=scope))

# Converts milliseconds to min:sec format
def ConvertTime(time):
    ms = time
    sec = ms // 1000
    min = sec // 60
    sec = sec % 60
    return min, sec

# Returns information about the track currently playing
def get_current_track():
    current_playback = sp.current_playback()

    if current_playback is not None:
        track = current_playback['item']
        if track is not None:
            track_name = track['name']
            track_artists = ', '.join([artist['name'] for artist in track['artists']])
            track_time = current_playback['progress_ms']
            track_time_min, track_time_sec = ConvertTime(track_time)
            track_duration = track['duration_ms']
            track_duration_min, track_duration_sec = ConvertTime(track_duration)
            album_image_url = track['album']['images'][0]['url']  # Takes the first image (the largest)
            is_playing = current_playback['is_playing']  # Indicates whether music is playing

            return {
                "track_name": track_name,
                "track_artists": track_artists,
                "track_time": f"{track_time_min:02d}:{track_time_sec:02d}",
                "track_duration": f"{track_duration_min:02d}:{track_duration_sec:02d}",
                "album_image_url" : album_image_url,
                "is_playing": is_playing,
            }
    return None

# API route to obtain the current runway
@app.route('/current_track')
def current_track():
    track_info = get_current_track()
    if track_info:
        return jsonify(track_info)
    else:
        return jsonify({"error": "Aucune piste en cours de lecture."})

# Main route for index.html
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
