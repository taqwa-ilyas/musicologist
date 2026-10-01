/* =========================================================
   MUSICLOGIST
   Main Application JavaScript
   ========================================================= */

"use strict";

/* =========================================================
   DEMO MUSIC DATA
   ========================================================= */

const MUSICLOGIST_SONGS = [
    {
        id: "song-001",
        title: "Midnight Dreams",
        artist: "MUSICLOGIST Studio",
        category: "Chill",
        duration: "3:42",
        color: "purple",
        image:
            "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: "song-002",
        title: "Neon Skyline",
        artist: "Luna Echo",
        category: "Electronic",
        duration: "4:08",
        color: "cyan",
        image:
            "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: "song-003",
        title: "Golden Hour",
        artist: "Nova Lane",
        category: "Pop",
        duration: "3:51",
        color: "orange",
        image:
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: "song-004",
        title: "Electric Hearts",
        artist: "The Frequency",
        category: "Rock",
        duration: "4:21",
        color: "pink",
        image:
            "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: "song-005",
        title: "Ocean Lights",
        artist: "Avery Sky",
        category: "Instrumental",
        duration: "5:12",
        color: "blue",
        image:
            "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: "song-006",
        title: "Afterglow",
        artist: "Velvet Motion",
        category: "Pop",
        duration: "3:37",
        color: "pink",
        image:
            "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: "song-007",
        title: "Lost In Motion",
        artist: "Aria North",
        category: "Trending",
        duration: "3:58",
        color: "purple",
        image:
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: "song-008",
        title: "Night Drive",
        artist: "The Midnight Club",
        category: "Chill",
        duration: "4:44",
        color: "cyan",
        image:
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=85"
    }
];

/* =========================================================
   STORAGE KEYS
   ========================================================= */

const STORAGE_KEYS = {
    favorites: "musiclogistFavorites",
    history: "musiclogistHistory",
    playlists: "musiclogistPlaylists",
    theme: "musiclogistTheme",
    volume: "musiclogistVolume"
};

/* =========================================================
   BACKEND API
   ========================================================= */

const API_BASE_URL = "http://localhost:5000";

async function checkBackendConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);

        if (!response.ok) {
            throw new Error("Backend request failed");
        }

        const data = await response.json();

        console.log("MUSICOLOGIST Backend:", data);

        return data;
    } catch (error) {
        console.error("Backend connection error:", error);

        return null;
    }
}

/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function getStorage(key, fallback = []) {
    try {
        const data = localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        return JSON.parse(data);

    } catch (error) {
        console.error(`Storage read error for ${key}:`, error);
        return fallback;
    }
}

function setStorage(key, value) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {
        console.error(`Storage write error for ${key}:`, error);
        return false;
    }
}

/* =========================================================
   FAVORITES
   ========================================================= */

function getFavorites() {
    return getStorage(
        STORAGE_KEYS.favorites,
        []
    );
}

function isFavorite(songId) {
    return getFavorites().includes(songId);
}

function toggleFavorite(songId) {

    const favorites = getFavorites();

    const index = favorites.indexOf(songId);

    if (index === -1) {

        favorites.push(songId);

        setStorage(
            STORAGE_KEYS.favorites,
            favorites
        );

        showToast(
            "Added to favorites",
            "fa-heart"
        );

        return true;
    }

    favorites.splice(index, 1);

    setStorage(
        STORAGE_KEYS.favorites,
        favorites
    );

    showToast(
        "Removed from favorites",
        "fa-heart"
    );

    return false;
}

/* =========================================================
   HISTORY
   ========================================================= */

function getHistory() {
    return getStorage(
        STORAGE_KEYS.history,
        []
    );
}

function addToHistory(songId) {

    let history = getHistory();

    history = history.filter(
        id => id !== songId
    );

    history.unshift(songId);

    history = history.slice(0, 20);

    setStorage(
        STORAGE_KEYS.history,
        history
    );
}

/* =========================================================
   SONG FINDER
   ========================================================= */

function getSongById(songId) {

    // First check demo songs
    const demoSong =
        MUSICLOGIST_SONGS.find(
            song => song.id === songId
        );

    if (demoSong) {
        return demoSong;
    }


    // Then check saved YouTube songs
    const youtubeSongs =
        getStorage(
            "musicologistYouTubeSongs",
            []
        );

    const youtubeSong =
        youtubeSongs.find(
            song => song.id === songId
        );

    if (youtubeSong) {
        return youtubeSong;
    }


    return null;
}

/* =========================================================
   TOAST
   ========================================================= */

function showToast(message, icon = "fa-circle-check") {

    const container =
        document.getElementById("toastContainer");

    if (!container) {
        return;
    }

    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";
        toast.style.transform = "translateY(8px)";

        setTimeout(() => {
            toast.remove();
        }, 250);

    }, 2500);
}

/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value ?? "");

    return div.innerHTML;
}

/* =========================================================
   SIDEBAR
   ========================================================= */

function initializeSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    const openButton =
        document.getElementById("mobileMenuButton");

    const closeButton =
        document.getElementById("sidebarClose");

    const overlay =
        document.getElementById("sidebarOverlay");

    if (!sidebar) {
        return;
    }

    function openSidebar() {

        sidebar.classList.add("open");

        if (overlay) {
            overlay.classList.add("show");
        }
    }

    function closeSidebar() {

        sidebar.classList.remove("open");

        if (overlay) {
            overlay.classList.remove("show");
        }
    }

    if (openButton) {
        openButton.addEventListener(
            "click",
            openSidebar
        );
    }

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeSidebar
        );
    }

    if (overlay) {
        overlay.addEventListener(
            "click",
            closeSidebar
        );
    }

    document
        .querySelectorAll(".sidebar .nav-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeSidebar
            );
        });
}

/* =========================================================
   THEME
   ========================================================= */

function initializeTheme() {

    const themeButton =
        document.getElementById("themeButton");

    const savedTheme =
        localStorage.getItem(
            STORAGE_KEYS.theme
        );

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }

    if (!themeButton) {
        return;
    }

    themeButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-theme"
            );

            const isLight =
                document.body.classList.contains(
                    "light-theme"
                );

            localStorage.setItem(
                STORAGE_KEYS.theme,
                isLight ? "light" : "dark"
            );

            showToast(
                isLight
                    ? "Light mode enabled"
                    : "Dark mode enabled",
                "fa-circle-half-stroke"
            );
        }
    );
}

/* =========================================================
   ABOUT MODAL
   ========================================================= */

function initializeAboutModal() {

    const openButton =
        document.getElementById("aboutButton");

    const modal =
        document.getElementById("aboutModal");

    const closeButton =
        document.getElementById("aboutModalClose");

    if (!openButton || !modal) {
        return;
    }

    openButton.addEventListener(
        "click",
        () => {
            modal.classList.add("show");
        }
    );

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {
                modal.classList.remove("show");
            }
        );
    }

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {
                modal.classList.remove("show");
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {
                modal.classList.remove("show");
            }
        }
    );
}

/* =========================================================
   KEYBOARD SEARCH
   ========================================================= */

function initializeKeyboardSearch() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                window.location.href =
                    "search.html";
            }
        }
    );
}

/* =========================================================
   HOME MUSIC CARDS
   ========================================================= */

function renderFeaturedMusic() {

    const grid =
        document.getElementById(
            "featuredMusicGrid"
        );

    if (!grid) {
        return;
    }

    grid.innerHTML =
        MUSICLOGIST_SONGS
            .slice(0, 4)
            .map(song => createMusicCard(song))
            .join("");

    attachMusicCardEvents(grid);
}

/* =========================================================
   MUSIC CARD
   ========================================================= */

function createMusicCard(song) {

    const favorite =
        isFavorite(song.id);

    return `
        <article
            class="music-card"
            data-song-id="${escapeHtml(song.id)}"
        >

            <div class="music-art">

                <img
                    src="${escapeHtml(song.image)}"
                    alt="${escapeHtml(song.title)}"
                    loading="lazy"
                >

                <div class="music-overlay">

                    <button
                        class="play-card-button"
                        data-action="play"
                        aria-label="Play ${escapeHtml(song.title)}"
                    >
                        <i class="fa-solid fa-play"></i>
                    </button>

                    <button
                        class="like-card-button ${favorite ? "liked" : ""}"
                        data-action="favorite"
                        aria-label="Favorite ${escapeHtml(song.title)}"
                    >
                        <i class="${favorite ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </button>

                </div>

            </div>

            <div class="music-info">

                <div class="music-title">
                    ${escapeHtml(song.title)}
                </div>

                <div class="music-artist">
                    ${escapeHtml(song.artist)}
                </div>

                <div class="music-meta">

                    <span class="music-category">
                        ${escapeHtml(song.category)}
                    </span>

                    <span class="music-artist">
                        ${escapeHtml(song.duration)}
                    </span>

                </div>

            </div>

        </article>
    `;
}

/* =========================================================
   CARD EVENTS
   ========================================================= */

function attachMusicCardEvents(container) {

    container
        .querySelectorAll(".music-card")
        .forEach(card => {

            const songId =
                card.dataset.songId;

            const playButton =
                card.querySelector(
                    '[data-action="play"]'
                );

            const favoriteButton =
                card.querySelector(
                    '[data-action="favorite"]'
                );

            if (playButton) {

                playButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        if (
                            typeof window.playSong ===
                            "function"
                        ) {
                            window.playSong(
                                songId
                            );
                        }
                    }
                );
            }

            if (favoriteButton) {

                favoriteButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        const liked =
                            toggleFavorite(
                                songId
                            );

                        favoriteButton.classList.toggle(
                            "liked",
                            liked
                        );

                        favoriteButton.innerHTML = `
                            <i class="${
                                liked
                                    ? "fa-solid"
                                    : "fa-regular"
                            } fa-heart"></i>
                        `;
                    }
                );
            }

        });
}

/* =========================================================
   RECENTLY PLAYED
   ========================================================= */

function renderRecentSongs() {

    const list =
        document.getElementById(
            "recentList"
        );

    if (!list) {
        return;
    }

    const history =
        getHistory();

    if (!history.length) {

        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                </div>

                <h3>No listening history yet</h3>

                <p>
                    Play a song and it will appear here.
                </p>
            </div>
        `;

        return;
    }

    const songs =
        history
            .map(getSongById)
            .filter(Boolean)
            .slice(0, 5);

    list.innerHTML =
        songs
            .map(song => `
                <div class="recent-item">

                    <img
                        class="recent-art"
                        src="${escapeHtml(song.image)}"
                        alt="${escapeHtml(song.title)}"
                    >

                    <div class="recent-details">

                        <strong>
                            ${escapeHtml(song.title)}
                        </strong>

                        <span>
                            ${escapeHtml(song.artist)}
                        </span>

                    </div>

                    <div class="recent-actions">

                        <button
                            class="small-icon-button"
                            data-recent-play="${escapeHtml(song.id)}"
                        >
                            <i class="fa-solid fa-play"></i>
                        </button>

                    </div>

                </div>
            `)
            .join("");

    list
        .querySelectorAll(
            "[data-recent-play]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (
                        typeof window.playSong ===
                        "function"
                    ) {
                        window.playSong(
                            button.dataset.recentPlay
                        );
                    }
                }
            );
        });
}

/* =========================================================
   CATEGORY BUTTONS ON HOME
   ========================================================= */

function initializeHomeCategories() {

    document
        .querySelectorAll(
            ".category-card[data-category]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const category =
                        button.dataset.category;

                    window.location.href =
                        `search.html?category=${encodeURIComponent(category)}`;
                }
            );
        });
}

/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeSidebar();

        initializeTheme();

        initializeAboutModal();

        initializeKeyboardSearch();

        renderFeaturedMusic();

        renderRecentSongs();

        initializeHomeCategories();

        checkBackendConnection();

    }
);

/* =========================================================
   GLOBAL EXPORTS
   ========================================================= */

window.MUSICLOGIST_SONGS =
    MUSICLOGIST_SONGS;

window.STORAGE_KEYS =
    STORAGE_KEYS;

window.getStorage =
    getStorage;

window.setStorage =
    setStorage;

window.getFavorites =
    getFavorites;

window.isFavorite =
    isFavorite;

window.toggleFavorite =
    toggleFavorite;

window.getHistory =
    getHistory;

window.addToHistory =
    addToHistory;

window.getSongById =
    getSongById;

window.showToast =
    showToast;

window.escapeHtml =
    escapeHtml;

window.createMusicCard =
    createMusicCard;

window.attachMusicCardEvents =
    attachMusicCardEvents;

    /* =========================================================
   PLAYLIST SYSTEM
   ========================================================= */

function getPlaylists() {

    return getStorage(
        "musicologistPlaylists",
        []
    );
}


function savePlaylists(playlists) {

    localStorage.setItem(
        "musicologistPlaylists",
        JSON.stringify(playlists)
    );
}


function createPlaylist(name) {

    const cleanName =
        String(name || "").trim();

    if (!cleanName) {
        return false;
    }

    const playlists =
        getPlaylists();

    const alreadyExists =
        playlists.some(
            playlist =>
                playlist.name.toLowerCase() ===
                cleanName.toLowerCase()
        );

    if (alreadyExists) {
        return false;
    }

    const newPlaylist = {

        id:
            "playlist-" +
            Date.now(),

        name:
            cleanName,

        songs:
            [],

        createdAt:
            new Date().toISOString()
    };

    playlists.push(
        newPlaylist
    );

    savePlaylists(
        playlists
    );

    return true;
}


function deletePlaylist(playlistId) {

    const playlists =
        getPlaylists();

    const updatedPlaylists =
        playlists.filter(
            playlist =>
                playlist.id !== playlistId
        );

    savePlaylists(
        updatedPlaylists
    );
}


function getPlaylistById(playlistId) {

    const playlists =
        getPlaylists();

    return playlists.find(
        playlist =>
            playlist.id === playlistId
    ) || null;
}


function addSongToPlaylist(
    playlistId,
    songId
) {

    const playlists =
        getPlaylists();

    const playlist =
        playlists.find(
            item =>
                item.id === playlistId
        );

    if (!playlist) {
        return false;
    }

    if (
        !playlist.songs.includes(
            songId
        )
    ) {

        playlist.songs.push(
            songId
        );
    }

    savePlaylists(
        playlists
    );

    return true;
}


function removeSongFromPlaylist(
    playlistId,
    songId
) {

    const playlists =
        getPlaylists();

    const playlist =
        playlists.find(
            item =>
                item.id === playlistId
        );

    if (!playlist) {
        return false;
    }

    playlist.songs =
        playlist.songs.filter(
            id =>
                id !== songId
        );

    savePlaylists(
        playlists
    );

    return true;
}


/* =========================================================
   PLAYLIST GLOBAL FUNCTIONS
   ========================================================= */

window.getPlaylists =
    getPlaylists;

window.createPlaylist =
    createPlaylist;

window.deletePlaylist =
    deletePlaylist;

window.getPlaylistById =
    getPlaylistById;

window.addSongToPlaylist =
    addSongToPlaylist;

window.removeSongFromPlaylist =
    removeSongFromPlaylist;

    /* =========================================================
   MUSICOLOGIST
   ABOUT MODAL
   ========================================================= */

"use strict";


/* =========================================================
   ABOUT ELEMENTS
   ========================================================= */

const aboutButton =
    document.getElementById("aboutButton");

const aboutModal =
    document.getElementById("aboutModal");

const aboutModalClose =
    document.getElementById("aboutModalClose");


/* =========================================================
   OPEN ABOUT MODAL
   ========================================================= */

if (aboutButton && aboutModal) {

    aboutButton.addEventListener("click", function () {

        aboutModal.classList.add("show");

        document.body.classList.add("modal-open");

    });

}


/* =========================================================
   CLOSE ABOUT MODAL
   ========================================================= */

if (aboutModalClose && aboutModal) {

    aboutModalClose.addEventListener("click", function () {

        aboutModal.classList.remove("show");

        document.body.classList.remove("modal-open");

    });

}


/* =========================================================
   CLOSE WHEN CLICKING OUTSIDE
   ========================================================= */

if (aboutModal) {

    aboutModal.addEventListener("click", function (event) {

        if (event.target === aboutModal) {

            aboutModal.classList.remove("show");

            document.body.classList.remove("modal-open");

        }

    });

}


/* =========================================================
   CLOSE WITH ESCAPE
   ========================================================= */

document.addEventListener("keydown", function (event) {

    if (
        event.key === "Escape" &&
        aboutModal &&
        aboutModal.classList.contains("show")
    ) {

        aboutModal.classList.remove("show");

        document.body.classList.remove("modal-open");

    }

});