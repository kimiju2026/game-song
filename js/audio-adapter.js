/**
 * GameBeat Audio Adapter
 * 현재: Web Audio 신디사이저
 * 향후: Spotify Web Playback SDK / YouTube IFrame API
 */
const SpotifyBridge = {
    play(spotifyId) {
        if (!spotifyId) {
            console.warn('[GameBeat] Spotify track ID not configured');
            return false;
        }
        console.warn('[GameBeat] Spotify API not configured. Track:', spotifyId);
        return false;
    },
    openTrack(spotifyId) {
        if (spotifyId) {
            window.open(`https://open.spotify.com/track/${spotifyId}`, '_blank');
        }
    }
};

const AudioAdapter = {
    mode: 'synth',

    play(track, synthFn) {
        if (!track) return;
        if (this.mode === 'spotify' && track.spotifyId) {
            return SpotifyBridge.play(track.spotifyId);
        }
        if (this.mode === 'youtube' && track.youtubeId) {
            console.warn('[GameBeat] YouTube adapter not configured. ID:', track.youtubeId);
            return false;
        }
        if (typeof synthFn === 'function') {
            synthFn(track);
            return true;
        }
        return false;
    },

    stop(stopFn) {
        if (typeof stopFn === 'function') stopFn();
    }
};

window.SpotifyBridge = SpotifyBridge;
window.AudioAdapter = AudioAdapter;
