/* =========================================================
   MUSICOLOGIST
   Frontend Music Player
   ========================================================= */

"use strict";


/* =========================================================
   YOUTUBE PLAYER VARIABLES
   ========================================================= */

let youtubePlayer = null;
let youtubePlayerReady = false;
let pendingYoutubeVideoId = null;
let youtubeInitializationStarted = false;


/* =========================================================
   PLAYER VARIABLES
   ========================================================= */

let currentSongIndex = -1;
let isPlaying = false;
let isShuffle = false;
let repeatMode = false;
let currentActiveSong = null;
let playerTimer = null;
let playerCurrentSeconds = 0;
let playerDurationSeconds = 0;


/* =========================================================
   YOUTUBE API READY
   ========================================================= */

function onYouTubeIframeAPIReady() {

    console.log("YouTube API is ready.");

    tryInitializeYouTubePlayer();
}


/* =========================================================
   TRY INITIALIZE YOUTUBE PLAYER
   ========================================================= */

function tryInitializeYouTubePlayer() {

    if (youtubePlayer) {
        return;
    }

    if (
        typeof YT === "undefined" ||
        typeof YT.Player === "undefined"
    ) {
        console.log("Waiting for YouTube API...");

        setTimeout(
            tryInitializeYouTubePlayer,
            500
        );

        return;
    }

    const container =
        document.getElementById(
            "youtubePlayerContainer"
        );

    if (!container) {

        console.log(
            "YouTube container is not created yet."
        );

        return;
    }

    initializeYouTubePlayer();
}


/* =========================================================
   INITIALIZE YOUTUBE PLAYER
   ========================================================= */

function initializeYouTubePlayer() {

    if (youtubePlayer) {
        return;
    }

    const container =
        document.getElementById(
            "youtubePlayerContainer"
        );

    if (!container) {

        console.log(
            "YouTube container is missing."
        );

        return;
    }

    if (
        typeof YT === "undefined" ||
        typeof YT.Player === "undefined"
    ) {

        console.log(
            "YouTube API is not ready yet."
        );

        return;
    }

    if (youtubeInitializationStarted) {
        return;
    }

    youtubeInitializationStarted = true;

    console.log(
        "Creating YouTube Player..."
    );

    youtubePlayer =
        new YT.Player(
            "youtubePlayerContainer",
            {
                width: "200",
                height: "200",

                videoId: "",

                playerVars: {
                    controls: 0,
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1
                },

                events: {
                    onReady:
                        onYouTubePlayerReady,

                    onStateChange:
                        onYouTubePlayerStateChange
                }
            }
        );
}


/* =========================================================
   YOUTUBE PLAYER READY
   ========================================================= */

function onYouTubePlayerReady(event) {

    youtubePlayerReady = true;

    console.log(
        "YouTube Player is ready."
    );

    event.target.setVolume(75);

    if (pendingYoutubeVideoId) {

        const videoId =
            pendingYoutubeVideoId;

        pendingYoutubeVideoId = null;

        console.log(
            "Loading pending YouTube video:",
            videoId
        );

        event.target.loadVideoById(
            videoId
        );
    }
}


/* =========================================================
   YOUTUBE STATE CHANGE
   ========================================================= */

function onYouTubePlayerStateChange(event) {

    if (
        !window.YT ||
        !window.YT.PlayerState
    ) {
        return;
    }


    /* =====================================================
       PLAYING
       ===================================================== */

    if (
        event.data ===
        YT.PlayerState.PLAYING
    ) {

        isPlaying = true;

        updatePlayButton();

        startDemoProgress();
    }


    /* =====================================================
       PAUSED
       ===================================================== */

    else if (
        event.data ===
        YT.PlayerState.PAUSED
    ) {

        isPlaying = false;

        updatePlayButton();

        stopDemoProgress();
    }


    /* =====================================================
       ENDED
       ===================================================== */

    else if (
        event.data ===
        YT.PlayerState.ENDED
    ) {

        isPlaying = false;

        updatePlayButton();

        stopDemoProgress();

        if (repeatMode) {

            if (
                youtubePlayerReady &&
                youtubePlayer
            ) {

                youtubePlayer.seekTo(
                    0,
                    true
                );

                youtubePlayer.playVideo();
            }

        } else {

            nextSong();
        }
    }
}


/* =========================================================
   PLAYER HTML
   ========================================================= */

function createPlayerHTML() {

    return `
        <div class="music-player">

            <!-- YOUTUBE PLAYER -->

            <div
                id="youtubePlayerContainer"
                class="youtube-player-container"
            ></div>


            <!-- SONG INFORMATION -->

            <div class="player-song">

                <div class="player-cover">

                    <img
                        id="playerCover"
                        src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=300&q=80"
                        alt="Current song"
                    >

                </div>


                <div class="player-song-info">

                    <div
                        class="player-song-title"
                        id="playerTitle"
                    >
                        Nothing playing
                    </div>


                    <div
                        class="player-song-artist"
                        id="playerArtist"
                    >
                        Choose a song to begin
                    </div>

                </div>


                <button
                    class="player-like"
                    id="playerLike"
                    title="Favorite"
                >
                    <i class="fa-regular fa-heart"></i>
                </button>

            </div>


            <!-- CENTER CONTROLS -->

            <div class="player-center">

                <div class="player-controls">

                    <button
                        class="player-control"
                        id="shuffleButton"
                        title="Shuffle"
                    >
                        <i class="fa-solid fa-shuffle"></i>
                    </button>


                    <button
                        class="player-control"
                        id="previousButton"
                        title="Previous"
                    >
                        <i class="fa-solid fa-backward-step"></i>
                    </button>


                    <button
                        class="player-control main"
                        id="mainPlayButton"
                        title="Play"
                    >
                        <i class="fa-solid fa-play"></i>
                    </button>


                    <button
                        class="player-control"
                        id="nextButton"
                        title="Next"
                    >
                        <i class="fa-solid fa-forward-step"></i>
                    </button>


                    <button
                        class="player-control"
                        id="repeatButton"
                        title="Repeat"
                    >
                        <i class="fa-solid fa-repeat"></i>
                    </button>

                </div>


                <div class="player-progress-row">

                    <span
                        class="player-time"
                        id="currentTime"
                    >
                        0:00
                    </span>


                    <div
                        class="progress-container"
                        id="progressContainer"
                    >

                        <div
                            class="progress-bar"
                            id="progressBar"
                        ></div>


                        <div
                            class="progress-dot"
                            id="progressDot"
                        ></div>

                    </div>


                    <span
                        class="player-time"
                        id="durationTime"
                    >
                        0:00
                    </span>

                </div>

            </div>


            <!-- RIGHT CONTROLS -->

            <div class="player-right">

                <button
                    class="player-extra-button"
                    id="queueButton"
                    title="Queue"
                >
                    <i class="fa-solid fa-list"></i>
                </button>


                <div class="queue-indicator">

                    <i class="fa-solid fa-music"></i>

                    <span id="queueCount">
                        0
                    </span>

                </div>


                <button
                    class="player-extra-button"
                    id="muteButton"
                    title="Mute"
                >
                    <i class="fa-solid fa-volume-high"></i>
                </button>


                <div class="volume-wrapper">

                    <input
                        type="range"
                        id="volumeSlider"
                        class="volume-slider"
                        min="0"
                        max="100"
                        value="75"
                    >

                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   INITIALIZE PLAYER
   ========================================================= */

function initializePlayer() {

    const container =
        document.getElementById(
            "musicPlayerContainer"
        );

    if (!container) {

        console.log(
            "musicPlayerContainer not found."
        );

        return;
    }


    /*
       IMPORTANT:

       First create the complete player HTML.
       This creates youtubePlayerContainer.
    */

    container.innerHTML =
        createPlayerHTML();


    console.log(
        "MUSICOLOGIST player HTML created."
    );


    /*
       Now the YouTube container definitely exists.
    */

    initializePlayerControls();

    updateQueueCount();

    restoreVolume();


    /*
       Start YouTube initialization.
    */

    if (
        typeof YT !== "undefined" &&
        typeof YT.Player !== "undefined"
    ) {

        initializeYouTubePlayer();

    } else {

        console.log(
            "YouTube API is still loading..."
        );
    }
}


/* =========================================================
   LOAD SONG
   ========================================================= */

function loadSong(song) {

    if (!song) {
        return;
    }


    const cover =
        document.getElementById(
            "playerCover"
        );


    const title =
        document.getElementById(
            "playerTitle"
        );


    const artist =
        document.getElementById(
            "playerArtist"
        );


    const duration =
        document.getElementById(
            "durationTime"
        );


    if (cover) {

        cover.src =
            song.image || "";

        cover.alt =
            song.title || "Current song";
    }


    if (title) {

        title.textContent =
            song.title || "Unknown song";
    }


    if (artist) {

        artist.textContent =
            song.artist || "Unknown artist";
    }


    if (duration) {

        duration.textContent =
            song.duration || "0:00";
    }

playerDurationSeconds =
    convertTimeToSeconds(
        song.duration
    );

    if (
    youtubePlayerReady &&
    youtubePlayer
) {

    const youtubeDuration =
        youtubePlayer.getDuration();

    if (youtubeDuration > 0) {

        playerDurationSeconds =
            youtubeDuration;
    }
}


    playerCurrentSeconds = 0;


    updateProgress();


    updatePlayerFavoriteState(
        song.id
    );
}


/* =========================================================
   PLAY SONG
   ========================================================= */

function playSong(songId) {

    const songs =
        window.MUSICLOGIST_SONGS || [];


    const index =
        songs.findIndex(
            song =>
                song.id === songId
        );


    if (index === -1) {

        console.log(
            "Song not found:",
            songId
        );

        return;
    }


    currentSongIndex =
        index;


    const song =
        songs[index];


    loadSong(song);


    isPlaying = true;


    updatePlayButton();


    addToHistory(songId);


    updateQueueCount();


    /*
       YouTube playback
    */

    if (song.youtubeId) {

        if (
            youtubePlayerReady &&
            youtubePlayer
        ) {

            console.log(
                "Loading YouTube video:",
                song.youtubeId
            );

            youtubePlayer.loadVideoById(
                song.youtubeId
            );

        } else {

            console.log(
                "YouTube player is not ready. Video queued."
            );

            pendingYoutubeVideoId =
                song.youtubeId;
        }
    }


    startDemoProgress();


    showToast(
        `Playing ${song.title}`,
        "fa-play"
    );
}


/* =========================================================
   PAUSE
   ========================================================= */

function pauseSong() {

    if (
        currentSongIndex === -1
    ) {
        return;
    }


    isPlaying = false;


    if (
        youtubePlayerReady &&
        youtubePlayer
    ) {

        youtubePlayer.pauseVideo();
    }


    updatePlayButton();


    stopDemoProgress();


    showToast(
        "Playback paused",
        "fa-pause"
    );
}


/* =========================================================
   TOGGLE PLAY
   ========================================================= */

function togglePlay() {

    /* Search / YouTube song is active */

    if (currentActiveSong) {

        if (
            youtubePlayerReady &&
            youtubePlayer
        ) {

            if (isPlaying) {

                youtubePlayer.pauseVideo();

            } else {

                youtubePlayer.playVideo();

            }

            return;
        }
    }


    /* Normal songs */

    if (
        currentSongIndex === -1
    ) {

        const songs =
            window.MUSICLOGIST_SONGS || [];


        if (songs.length) {

            playSong(
                songs[0].id
            );
        }

        return;
    }


    if (isPlaying) {

        pauseSong();

    } else {

        isPlaying = true;


        if (
            youtubePlayerReady &&
            youtubePlayer
        ) {

            youtubePlayer.playVideo();
        }


        updatePlayButton();


        startDemoProgress();
    }
}


/* =========================================================
   NEXT
   ========================================================= */

function nextSong() {

    const songs =
        window.MUSICLOGIST_SONGS || [];


    /* Search result queue */

    if (
        currentActiveSong &&
        window.currentSearchResults &&
        window.currentSearchResults.length
    ) {

        const searchSongs =
            window.currentSearchResults;


        const currentIndex =
            searchSongs.findIndex(
                song =>
                    song.id ===
                    currentActiveSong.id
            );


        let nextIndex =
            currentIndex + 1;


        if (
            nextIndex >=
            searchSongs.length
        ) {

            nextIndex = 0;
        }


        playYouTubeSong(
            searchSongs[nextIndex]
        );

        return;
    }


    /* Normal queue */

    if (!songs.length) {
        return;
    }


    let nextIndex;


    if (isShuffle) {

        nextIndex =
            Math.floor(
                Math.random() *
                songs.length
            );

    } else {

        nextIndex =
            currentSongIndex + 1;


        if (
            nextIndex >=
            songs.length
        ) {

            nextIndex = 0;
        }
    }


    playSong(
        songs[nextIndex].id
    );
}


/* =========================================================
   PREVIOUS
   ========================================================= */

function previousSong() {

    const songs =
        window.MUSICLOGIST_SONGS || [];


    /* Search result queue */

    if (
        currentActiveSong &&
        window.currentSearchResults &&
        window.currentSearchResults.length
    ) {

        const searchSongs =
            window.currentSearchResults;


        const currentIndex =
            searchSongs.findIndex(
                song =>
                    song.id ===
                    currentActiveSong.id
            );


        let previousIndex =
            currentIndex - 1;


        if (
            previousIndex < 0
        ) {

            previousIndex =
                searchSongs.length - 1;
        }


        playYouTubeSong(
            searchSongs[previousIndex]
        );

        return;
    }


    /* Normal queue */

    if (!songs.length) {
        return;
    }


    let previousIndex =
        currentSongIndex - 1;


    if (
        previousIndex < 0
    ) {

        previousIndex =
            songs.length - 1;
    }


    playSong(
        songs[previousIndex].id
    );
}

/* =========================================================
   SHUFFLE
   ========================================================= */

function toggleShuffle() {

    isShuffle =
        !isShuffle;


    const button =
        document.getElementById(
            "shuffleButton"
        );


    if (button) {

        button.classList.toggle(
            "active",
            isShuffle
        );
    }


    showToast(
        isShuffle
            ? "Shuffle enabled"
            : "Shuffle disabled",
        "fa-shuffle"
    );
}


/* =========================================================
   REPEAT
   ========================================================= */

function toggleRepeat() {

    repeatMode =
        !repeatMode;


    const button =
        document.getElementById(
            "repeatButton"
        );


    if (button) {

        button.classList.toggle(
            "active",
            repeatMode
        );
    }


    showToast(
        repeatMode
            ? "Repeat enabled"
            : "Repeat disabled",
        "fa-repeat"
    );
}


/* =========================================================
   PLAY BUTTON
   ========================================================= */

function updatePlayButton() {

    const button =
        document.getElementById(
            "mainPlayButton"
        );


    if (!button) {
        return;
    }


    button.innerHTML = `
        <i class="fa-solid ${
            isPlaying
                ? "fa-pause"
                : "fa-play"
        }"></i>
    `;


    button.title =
        isPlaying
            ? "Pause"
            : "Play";
}


/* =========================================================
   DEMO PROGRESS
   ========================================================= */

/* =========================================================
   YOUTUBE REAL PROGRESS
   ========================================================= */

function startDemoProgress() {

    stopDemoProgress();

    playerTimer = setInterval(() => {

        if (
            !isPlaying ||
            !youtubePlayerReady ||
            !youtubePlayer
        ) {
            return;
        }

        try {

            playerCurrentSeconds =
                youtubePlayer.getCurrentTime();

            playerDurationSeconds =
                youtubePlayer.getDuration();

            updateProgress();

        } catch (error) {

            console.log(
                "YouTube progress error:",
                error
            );
        }

    }, 500);
}

function stopDemoProgress() {

    if (playerTimer) {

        clearInterval(
            playerTimer
        );


        playerTimer = null;
    }
}


/* =========================================================
   PROGRESS
   ========================================================= */

function updateProgress() {

    const bar =
        document.getElementById(
            "progressBar"
        );


    const dot =
        document.getElementById(
            "progressDot"
        );


    const currentTime =
        document.getElementById(
            "currentTime"
        );


    const percentage =
        playerDurationSeconds > 0
            ? (
                playerCurrentSeconds /
                playerDurationSeconds
            ) * 100
            : 0;


    if (bar) {

        bar.style.width =
            `${Math.min(
                100,
                percentage
            )}%`;
    }


    if (dot) {

        dot.style.left =
            `${Math.min(
                100,
                percentage
            )}%`;
    }


    if (currentTime) {

        currentTime.textContent =
            formatSeconds(
                playerCurrentSeconds
            );
    }
}


/* =========================================================
   SEEK
   ========================================================= */

function seekPlayer(event) {

    const container =
        document.getElementById(
            "progressContainer"
        );


    if (
        !container ||
        playerDurationSeconds <= 0
    ) {
        return;
    }


    const rect =
        container.getBoundingClientRect();


    const clickPosition =
        event.clientX -
        rect.left;


    const percentage =
        Math.max(
            0,
            Math.min(
                1,
                clickPosition /
                rect.width
            )
        );


    playerCurrentSeconds =
        Math.floor(
            playerDurationSeconds *
            percentage
        );


    if (
        youtubePlayerReady &&
        youtubePlayer
    ) {

        youtubePlayer.seekTo(
            playerCurrentSeconds,
            true
        );
    }


    updateProgress();
}


/* =========================================================
   VOLUME
   ========================================================= */

function setVolume(value) {

    const volume =
        Number(value);


    localStorage.setItem(
        window.STORAGE_KEYS.volume,
        String(volume)
    );


    if (
        youtubePlayerReady &&
        youtubePlayer
    ) {

        youtubePlayer.setVolume(
            volume
        );
    }


    updateVolumeIcon(
        volume
    );
}


function restoreVolume() {

    const saved =
        localStorage.getItem(
            window.STORAGE_KEYS.volume
        );


    const volume =
        saved !== null
            ? Number(saved)
            : 75;


    const slider =
        document.getElementById(
            "volumeSlider"
        );


    if (slider) {

        slider.value =
            volume;
    }


    updateVolumeIcon(
        volume
    );
}


function updateVolumeIcon(
    volume
) {

    const button =
        document.getElementById(
            "muteButton"
        );


    if (!button) {
        return;
    }


    let icon =
        "fa-volume-high";


    if (
        volume === 0
    ) {

        icon =
            "fa-volume-xmark";

    } else if (
        volume < 40
    ) {

        icon =
            "fa-volume-low";
    }


    button.innerHTML = `
        <i class="fa-solid ${icon}"></i>
    `;
}


/* =========================================================
   MUTE
   ========================================================= */

let previousVolume = 75;


function toggleMute() {

    const slider =
        document.getElementById(
            "volumeSlider"
        );


    if (!slider) {
        return;
    }


    const current =
        Number(slider.value);


    if (current > 0) {

        previousVolume =
            current;


        slider.value =
            0;


        setVolume(0);

    } else {

        slider.value =
            previousVolume ||
            75;


        setVolume(
            Number(
                slider.value
            )
        );
    }
}


/* =========================================================
   PLAYER FAVORITE
   ========================================================= */

function updatePlayerFavoriteState(
    songId
) {

    const button =
        document.getElementById(
            "playerLike"
        );


    if (!button) {
        return;
    }


    const liked =
        window.isFavorite
            ? window.isFavorite(songId)
            : false;


    button.innerHTML = `
        <i class="${
            liked
                ? "fa-solid"
                : "fa-regular"
        } fa-heart"></i>
    `;


    button.style.color =
        liked
            ? "#fb7185"
            : "";
}


/* =========================================================
   PLAYER FAVORITE CLICK
   ========================================================= */

function handlePlayerFavorite() {

    /* Search / YouTube song */

    if (currentActiveSong) {

        if (
            window.toggleFavorite
        ) {

            window.toggleFavorite(
                currentActiveSong.id
            );

            updatePlayerFavoriteState(
                currentActiveSong.id
            );

        }

        return;
    }


    /* Normal song */

    if (
        currentSongIndex === -1
    ) {

        showToast(
            "Play a song first",
            "fa-music"
        );

        return;
    }


    const songs =
        window.MUSICLOGIST_SONGS || [];


    const song =
        songs[currentSongIndex];


    if (!song) {
        return;
    }


    window.toggleFavorite(
        song.id
    );


    updatePlayerFavoriteState(
        song.id
    );
}


/* =========================================================
   QUEUE COUNT
   ========================================================= */

function updateQueueCount() {

    const element =
        document.getElementById(
            "queueCount"
        );


    if (!element) {
        return;
    }


    const songs =
        window.MUSICLOGIST_SONGS || [];


    element.textContent =
        songs.length;
}


/* =========================================================
   FORMAT TIME
   ========================================================= */

function convertTimeToSeconds(
    time
) {

    if (!time) {
        return 0;
    }


    const parts =
        time
            .split(":")
            .map(Number);


    if (
        parts.length === 2
    ) {

        return (
            parts[0] * 60 +
            parts[1]
        );
    }


    return 0;
}


function formatSeconds(
    seconds
) {

    seconds =
        Math.max(
            0,
            Math.floor(seconds)
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        seconds % 60;


    return `${minutes}:${String(
        remaining
    ).padStart(2, "0")}`;
}


/* =========================================================
   CONTROLS
   ========================================================= */

function initializePlayerControls() {

    const playButton =
        document.getElementById(
            "mainPlayButton"
        );


    const nextButton =
        document.getElementById(
            "nextButton"
        );


    const previousButton =
        document.getElementById(
            "previousButton"
        );


    const shuffleButton =
        document.getElementById(
            "shuffleButton"
        );


    const repeatButton =
        document.getElementById(
            "repeatButton"
        );


    const progress =
        document.getElementById(
            "progressContainer"
        );


    const volume =
        document.getElementById(
            "volumeSlider"
        );


    const mute =
        document.getElementById(
            "muteButton"
        );


    const like =
        document.getElementById(
            "playerLike"
        );


    if (playButton) {

        playButton.addEventListener(
            "click",
            togglePlay
        );
    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            nextSong
        );
    }


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            previousSong
        );
    }


    if (shuffleButton) {

        shuffleButton.addEventListener(
            "click",
            toggleShuffle
        );
    }


    if (repeatButton) {

        repeatButton.addEventListener(
            "click",
            toggleRepeat
        );
    }


    if (progress) {

        progress.addEventListener(
            "click",
            seekPlayer
        );
    }


    if (volume) {

        volume.addEventListener(
            "input",
            event => {

                setVolume(
                    event.target.value
                );
            }
        );
    }


    if (mute) {

        mute.addEventListener(
            "click",
            toggleMute
        );
    }


    if (like) {

        like.addEventListener(
            "click",
            handlePlayerFavorite
        );
    }
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializePlayer();
    }
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.playSong =
    playSong;


window.pauseSong =
    pauseSong;


window.togglePlay =
    togglePlay;


window.nextSong =
    nextSong;


window.previousSong =
    previousSong;

    /* =========================================================
   PLAY YOUTUBE SEARCH SONG
   ========================================================= */

/* =========================================================
   PLAY YOUTUBE SEARCH SONG
   ========================================================= */

function playYouTubeSong(song) {

    if (!song) {

        console.error(
            "Invalid YouTube song: song is missing."
        );

        return;
    }


    /* =====================================================
       GET YOUTUBE VIDEO ID
       ===================================================== */

    const youtubeId =
        String(
            song.youtubeId ||
            song.id ||
            ""
        ).trim();


    if (!youtubeId) {

        console.error(
            "YouTube video ID is missing:",
            song
        );

        return;
    }


    console.log(
        "Playing YouTube search song:",
        song.title
    );

    console.log(
        "YouTube Video ID:",
        youtubeId
    );


    /* =====================================================
       NORMALIZE SONG
       ===================================================== */

    const normalizedSong = {

        ...song,

        id:
            song.id ||
            youtubeId,

        youtubeId:
            youtubeId

    };


    /* =====================================================
       STORE ACTIVE SEARCH SONG
       ===================================================== */

    currentActiveSong =
        normalizedSong;


    /* =====================================================
       SAVE YOUTUBE SONG
       ===================================================== */

    let savedYoutubeSongs = [];


    try {

        savedYoutubeSongs =
            JSON.parse(
                localStorage.getItem(
                    "musicologistYouTubeSongs"
                )
            ) || [];

    } catch (error) {

        console.error(
            "Could not read saved YouTube songs:",
            error
        );

        savedYoutubeSongs = [];

    }


    if (!Array.isArray(savedYoutubeSongs)) {

        savedYoutubeSongs = [];

    }


    const alreadySaved =
        savedYoutubeSongs.some(
            function(item) {

                return String(
                    item.id ||
                    item.youtubeId ||
                    ""
                ) === youtubeId;

            }
        );


    if (!alreadySaved) {

        savedYoutubeSongs.push(
            normalizedSong
        );


        localStorage.setItem(
            "musicologistYouTubeSongs",
            JSON.stringify(
                savedYoutubeSongs
            )
        );

    }


    /* =====================================================
       ADD TO HISTORY
       ===================================================== */

    addToHistory(
        normalizedSong.id
    );


    /* =====================================================
       UPDATE PLAYER INFORMATION
       ===================================================== */

    loadSong(
        normalizedSong
    );


    /* =====================================================
       PLAY YOUTUBE VIDEO
       ===================================================== */

    if (
        youtubePlayerReady &&
        youtubePlayer
    ) {

        console.log(
            "Loading YouTube video:",
            youtubeId
        );


        youtubePlayer.loadVideoById(
            youtubeId
        );


        isPlaying = true;


        updatePlayButton();


    } else {

        console.log(
            "YouTube player is not ready. Video queued:",
            youtubeId
        );


        pendingYoutubeVideoId =
            youtubeId;

    }


    /* =====================================================
       UPDATE QUEUE
       ===================================================== */

    updateQueueCount();


    /* =====================================================
       TOAST
       ===================================================== */

    showToast(
        `Playing ${normalizedSong.title || "song"}`,
        "fa-play"
    );

}