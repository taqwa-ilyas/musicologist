/* =========================================================
   MUSICOLOGIST - SEARCH
   YouTube Search API + Add To Playlist
   ========================================================= */

"use strict";


/* =========================================================
   API
   ========================================================= */

const SEARCH_API_URL =
    "http://localhost:5000/api/search";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const searchInput =
    document.getElementById("searchInput");

const searchResults =
    document.getElementById("searchResults");


/* =========================================================
   SEARCH STATE
   ========================================================= */

let currentSearchResults = [];

let selectedSongForPlaylist = null;


/* =========================================================
   SEARCH SONGS
   ========================================================= */

async function searchSongs(query) {

    query = String(query || "").trim();


    if (!query) {

        if (searchResults) {

            searchResults.innerHTML = `

                <div class="search-empty">

                    <i class="fa-solid fa-magnifying-glass"></i>

                    <h3>Search for music</h3>

                    <p>
                        Enter a song, artist, or category.
                    </p>

                </div>

            `;

        }

        return;
    }


    if (searchResults) {

        searchResults.innerHTML = `

            <div class="search-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <p>Searching YouTube...</p>

            </div>

        `;

    }


    try {

        const response = await fetch(
            `${SEARCH_API_URL}?q=${encodeURIComponent(query)}`
        );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        currentSearchResults =
            Array.isArray(data.results)
                ? data.results
                : [];


        window.currentSearchResults =
            currentSearchResults;


        console.log(
            "MUSICOLOGIST SEARCH RESULTS:",
            currentSearchResults
        );


        displaySearchResults(
            currentSearchResults
        );


    } catch (error) {

        console.error(
            "MUSICOLOGIST SEARCH ERROR:",
            error
        );


        if (searchResults) {

            searchResults.innerHTML = `

                <div class="search-empty">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    <h3>Search failed</h3>

                    <p>
                        Unable to connect to MUSICOLOGIST server.
                    </p>

                </div>

            `;

        }

    }

}


/* =========================================================
   DISPLAY SEARCH RESULTS
   ========================================================= */

function displaySearchResults(results) {

    if (!searchResults) {

        console.error(
            "searchResults element not found."
        );

        return;

    }


    if (
        !Array.isArray(results) ||
        results.length === 0
    ) {

        searchResults.innerHTML = `

            <div class="search-empty">

                <i class="fa-solid fa-music"></i>

                <h3>No music found</h3>

                <p>
                    Try another song, artist, or category.
                </p>

            </div>

        `;

        return;

    }


    searchResults.innerHTML = results.map(
        function(song) {

            const songId =
                String(song.id || song.youtubeId || "");


            return `

                <div
                    class="search-result-card"
                    data-song-id="${escapeSearchAttribute(songId)}"
                >

                    <div class="search-result-image">

                        <img
                            src="${escapeSearchAttribute(song.image || "")}"
                            alt="${escapeSearchAttribute(song.title || "Song")}"
                        >

                    </div>


                    <div class="search-result-info">

                        <h3>
                            ${escapeSearchText(
                                song.title || "Unknown Song"
                            )}
                        </h3>


                        <p>
                            ${escapeSearchText(
                                song.artist || "Unknown Artist"
                            )}
                        </p>


                        <span>
                            YouTube
                        </span>

                    </div>


                    <div class="search-result-actions">

                        <button
                            type="button"
                            class="search-play-btn"
                            data-song-id="${escapeSearchAttribute(songId)}"
                            title="Play song"
                        >

                            <i class="fa-solid fa-play"></i>

                        </button>


                        <button
                            type="button"
                            class="search-add-playlist-btn"
                            data-song-id="${escapeSearchAttribute(songId)}"
                            title="Add to playlist"
                        >

                            <i class="fa-solid fa-plus"></i>

                        </button>

                    </div>

                </div>

            `;

        }
    ).join("");


    console.log(
        "SEARCH RESULTS RENDERED:",
        results.length
    );

}


/* =========================================================
   ESCAPE TEXT
   ========================================================= */

function escapeSearchText(text) {

    const div =
        document.createElement("div");


    div.textContent =
        String(text ?? "");


    return div.innerHTML;

}


/* =========================================================
   ESCAPE ATTRIBUTE
   ========================================================= */

function escapeSearchAttribute(text) {

    return String(text ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   FIND SEARCH SONG
   ========================================================= */

function getSearchSongById(songId) {

    const cleanId =
        String(songId || "");


    return currentSearchResults.find(
        function(song) {

            const id =
                String(
                    song.id ||
                    song.youtubeId ||
                    ""
                );


            return id === cleanId;

        }
    ) || null;

}


/* =========================================================
   PLAY SEARCH SONG
   ========================================================= */

function playSearchSong(songId) {

    const song =
        getSearchSongById(songId);


    if (!song) {

        console.error(
            "SEARCH SONG NOT FOUND:",
            songId
        );

        return;

    }


    console.log(
        "YouTube song selected:",
        song
    );


    if (
        typeof window.playYouTubeSong ===
        "function"
    ) {

        window.playYouTubeSong(song);

    } else {

        console.error(
            "playYouTubeSong() is not available."
        );

    }

}


/* =========================================================
   GET CURRENT PLAYLISTS
   ========================================================= */

function getCurrentPlaylists() {

    let playlists = [];


    try {

        const stored =
            localStorage.getItem(
                "musicologistPlaylists"
            );


        if (stored) {

            playlists =
                JSON.parse(stored);

        }

    } catch (error) {

        console.error(
            "Could not read playlists:",
            error
        );

        playlists = [];

    }


    if (!Array.isArray(playlists)) {

        playlists = [];

    }


    return playlists;

}


/* =========================================================
   SHOW ADD TO PLAYLIST MODAL
   ========================================================= */

function showAddToPlaylist(songId) {

    console.log(
        "================================="
    );

    console.log(
        "PLUS BUTTON CLICKED"
    );

    console.log(
        "SONG ID:",
        songId
    );


    /* =====================================================
       FIND SONG
       ===================================================== */

    const song =
        getSearchSongById(songId);


    if (!song) {

        console.error(
            "SONG NOT FOUND:",
            songId
        );

        alert(
            "Song information could not be found."
        );

        return;

    }


    selectedSongForPlaylist =
        song;


    console.log(
        "SELECTED SONG:",
        selectedSongForPlaylist
    );


    /* =====================================================
       GET PLAYLISTS
       ===================================================== */

    const playlists =
        getCurrentPlaylists();


    console.log(
        "AVAILABLE PLAYLISTS:",
        playlists
    );


    if (playlists.length === 0) {

        alert(
            "Please create a playlist first."
        );

        return;

    }


    /* =====================================================
       REMOVE OLD MODAL
       ===================================================== */

    const oldModal =
        document.getElementById(
            "addToPlaylistModal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    /* =====================================================
       CREATE MODAL
       ===================================================== */

    const modal =
        document.createElement("div");


    modal.id =
        "addToPlaylistModal";


    modal.className =
        "modal-overlay";


    /*
       IMPORTANT:
       These inline styles force the modal above
       the sidebar and music player.
    */

    modal.style.position =
        "fixed";

    modal.style.top =
        "0";

    modal.style.left =
        "0";

    modal.style.right =
        "0";

    modal.style.bottom =
        "0";

    modal.style.width =
        "100vw";

    modal.style.height =
        "100vh";

    modal.style.display =
        "flex";

    modal.style.alignItems =
        "center";

    modal.style.justifyContent =
        "center";

    modal.style.padding =
        "20px";

    modal.style.background =
        "rgba(0, 0, 0, 0.72)";

    modal.style.backdropFilter =
        "blur(10px)";

    modal.style.webkitBackdropFilter =
        "blur(10px)";

    modal.style.zIndex =
        "99999";

    modal.style.visibility =
        "visible";

    modal.style.opacity =
        "1";


    modal.innerHTML = `

        <div
            class="modal-card add-playlist-modal"
            style="
                position: relative;
                z-index: 100000;
                width: min(460px, calc(100vw - 40px));
                max-height: calc(100vh - 40px);
                overflow: hidden;
                padding: 32px;
                border-radius: 20px;
                background: #14141f;
                border: 1px solid rgba(255,255,255,0.12);
                box-shadow: 0 30px 100px rgba(0,0,0,0.65);
            "
        >

            <button
                type="button"
                class="modal-close"
                id="closePlaylistModal"
                title="Close"
                style="
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    border-radius: 50%;
                    color: #ffffff;
                    background: rgba(255,255,255,0.07);
                    cursor: pointer;
                    z-index: 100001;
                "
            >

                <i class="fa-solid fa-xmark"></i>

            </button>


            <div
                class="modal-logo purple"
                style="
                    width: 52px;
                    height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 14px;
                    border-radius: 15px;
                    color: #ffffff;
                    background: linear-gradient(
                        135deg,
                        #8b5cf6,
                        #06b6d4
                    );
                "
            >

                <i class="fa-solid fa-music"></i>

            </div>


            <span
                class="section-kicker"
                style="
                    display: block;
                    margin-bottom: 5px;
                "
            >
                SAVE MUSIC
            </span>


            <h2>
                Add to playlist
            </h2>


            <p class="add-playlist-song-name">

                ${escapeSearchText(
                    song.title || "Selected Song"
                )}

            </p>


            <div
                id="playlistSelection"
                class="playlist-selection"
                style="
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    max-height: 280px;
                    overflow-y: auto;
                    margin-bottom: 18px;
                "
            ></div>


            <button
                type="button"
                id="cancelAddPlaylist"
                class="secondary-button"
                style="
                    width: 100%;
                    min-height: 42px;
                    border: 1px solid rgba(255,255,255,0.10);
                    border-radius: 10px;
                    color: #ffffff;
                    background: rgba(255,255,255,0.06);
                    cursor: pointer;
                "
            >

                Cancel

            </button>

        </div>

    `;


    document.body.appendChild(modal);


    /* =====================================================
       GET PLAYLIST CONTAINER
       ===================================================== */

    const playlistSelection =
        document.getElementById(
            "playlistSelection"
        );


    if (!playlistSelection) {

        console.error(
            "playlistSelection element missing."
        );

        return;

    }


    /* =====================================================
       CREATE PLAYLIST BUTTONS
       ===================================================== */

    playlists.forEach(
        function(playlist) {

            const playlistId =
                String(playlist.id || "");


            const playlistName =
                String(
                    playlist.name ||
                    "Unnamed Playlist"
                );


            console.log(
                "CREATING PLAYLIST BUTTON:",
                {
                    id: playlistId,
                    name: playlistName
                }
            );


            if (
                !playlistId ||
                playlistId === "null" ||
                playlistId === "undefined"
            ) {

                console.error(
                    "INVALID PLAYLIST ID:",
                    playlist
                );

                return;

            }


            const playlistButton =
                document.createElement("button");


            playlistButton.type =
                "button";


            playlistButton.className =
                "playlist-selection-item";


            playlistButton.dataset.playlistId =
                playlistId;


            playlistButton.style.width =
                "100%";

            playlistButton.style.minHeight =
                "66px";

            playlistButton.style.display =
                "flex";

            playlistButton.style.alignItems =
                "center";

            playlistButton.style.gap =
                "12px";

            playlistButton.style.padding =
                "12px";

            playlistButton.style.border =
                "1px solid rgba(255,255,255,0.10)";

            playlistButton.style.borderRadius =
                "12px";

            playlistButton.style.color =
                "#ffffff";

            playlistButton.style.background =
                "rgba(255,255,255,0.05)";

            playlistButton.style.textAlign =
                "left";

            playlistButton.style.cursor =
                "pointer";

            playlistButton.style.pointerEvents =
                "auto";

            playlistButton.style.visibility =
                "visible";

            playlistButton.style.opacity =
                "1";

            playlistButton.style.position =
                "relative";

            playlistButton.style.zIndex =
                "100002";


            const songCount =
                Array.isArray(playlist.songs)
                    ? playlist.songs.length
                    : 0;


            playlistButton.innerHTML = `

                <span
                    class="playlist-selection-icon"
                    style="
                        width: 42px;
                        height: 42px;
                        flex-shrink: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 10px;
                        color: #ffffff;
                        background: linear-gradient(
                            135deg,
                            #8b5cf6,
                            #06b6d4
                        );
                    "
                >

                    <i class="fa-solid fa-music"></i>

                </span>


                <span
                    class="playlist-selection-info"
                    style="
                        min-width: 0;
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    "
                >

                    <strong
                        style="
                            color: #ffffff;
                            font-size: 14px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        "
                    >
                        ${escapeSearchText(playlistName)}
                    </strong>


                    <small
                        style="
                            color: #a1a1aa;
                            font-size: 12px;
                        "
                    >

                        ${songCount}

                        ${
                            songCount === 1
                                ? "song"
                                : "songs"
                        }

                    </small>

                </span>


                <i
                    class="fa-solid fa-chevron-right"
                    style="
                        color: #a1a1aa;
                        font-size: 12px;
                    "
                ></i>

            `;


            /* =================================================
               CLICK PLAYLIST
               ================================================= */

            playlistButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const selectedPlaylistId =
                        String(
                            playlistButton.dataset.playlistId ||
                            ""
                        );


                    console.log(
                        "================================="
                    );

                    console.log(
                        "PLAYLIST BUTTON CLICKED"
                    );

                    console.log(
                        "PLAYLIST ID:",
                        selectedPlaylistId
                    );

                    console.log(
                        "SONG:",
                        selectedSongForPlaylist
                    );


                    if (
                        !selectedPlaylistId ||
                        selectedPlaylistId === "null" ||
                        selectedPlaylistId === "undefined"
                    ) {

                        console.error(
                            "INVALID PLAYLIST ID"
                        );

                        alert(
                            "Playlist ID is missing."
                        );

                        return;

                    }


                    addSongToSelectedPlaylist(
                        selectedPlaylistId
                    );

                }
            );


            playlistSelection.appendChild(
                playlistButton
            );

        }
    );


    /* =====================================================
       VERIFY CREATED BUTTONS
       ===================================================== */

    console.log(
        "PLAYLIST BUTTONS CREATED:",
        playlistSelection.children.length
    );


    /* =====================================================
       CLOSE BUTTON
       ===================================================== */

    const closeButton =
        document.getElementById(
            "closePlaylistModal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                closeAddPlaylistModal();

            }
        );

    }


    /* =====================================================
       CANCEL BUTTON
       ===================================================== */

    const cancelButton =
        document.getElementById(
            "cancelAddPlaylist"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                closeAddPlaylistModal();

            }
        );

    }


    /* =====================================================
       OUTSIDE CLICK
       ===================================================== */

    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {

                closeAddPlaylistModal();

            }

        }
    );


    /* =====================================================
       SHOW MODAL
       ===================================================== */

    modal.classList.add(
        "active"
    );


    console.log(
        "ADD TO PLAYLIST MODAL OPENED"
    );

}


/* =========================================================
   ADD SONG TO SELECTED PLAYLIST
   ========================================================= */

function addSongToSelectedPlaylist(
    playlistId
) {

    console.log(
        "================================="
    );

    console.log(
        "ADDING SONG TO PLAYLIST"
    );


    const cleanPlaylistId =
        String(playlistId || "");


    if (
        !cleanPlaylistId ||
        cleanPlaylistId === "null" ||
        cleanPlaylistId === "undefined"
    ) {

        console.error(
            "INVALID PLAYLIST ID:",
            playlistId
        );

        alert(
            "Playlist ID is missing."
        );

        return;

    }


    console.log(
        "PLAYLIST ID:",
        cleanPlaylistId
    );


    if (!selectedSongForPlaylist) {

        console.error(
            "NO SONG SELECTED"
        );

        alert(
            "Please select a song first."
        );

        return;

    }


    const song =
        selectedSongForPlaylist;


    const songId =
        String(
            song.id ||
            song.youtubeId ||
            ""
        );


    if (!songId) {

        console.error(
            "SONG ID IS MISSING:",
            song
        );

        alert(
            "Song ID is missing."
        );

        return;

    }


    console.log(
        "SONG ID:",
        songId
    );


    const playlists =
        getCurrentPlaylists();


    console.log(
        "PLAYLISTS FROM STORAGE:",
        playlists
    );


    const playlist =
        playlists.find(
            function(item) {

                return String(item.id) ===
                    cleanPlaylistId;

            }
        );


    if (!playlist) {

        console.error(
            "PLAYLIST NOT FOUND:",
            cleanPlaylistId
        );

        console.error(
            "AVAILABLE PLAYLIST IDS:",
            playlists.map(
                function(item) {
                    return item.id;
                }
            )
        );

        alert(
            "Playlist not found."
        );

        return;

    }


    console.log(
        "FOUND PLAYLIST:",
        playlist
    );


    if (
        !Array.isArray(
            playlist.songs
        )
    ) {

        playlist.songs = [];

    }


    const alreadyExists =
        playlist.songs.some(
            function(existingSongId) {

                return String(existingSongId) ===
                    songId;

            }
        );


    if (alreadyExists) {

        alert(
            "This song is already in this playlist."
        );

        closeAddPlaylistModal();

        return;

    }


    playlist.songs.push(
        songId
    );


    console.log(
        "UPDATED PLAYLIST:",
        playlist
    );


    try {

        localStorage.setItem(
            "musicologistPlaylists",
            JSON.stringify(playlists)
        );

    } catch (error) {

        console.error(
            "FAILED TO SAVE PLAYLIST:",
            error
        );

        alert(
            "Could not save playlist."
        );

        return;

    }


    /* =====================================================
       SAVE YOUTUBE SONG
       ===================================================== */

    let youtubeSongs = [];


    try {

        youtubeSongs =
            JSON.parse(
                localStorage.getItem(
                    "musicologistYouTubeSongs"
                )
            ) || [];

    } catch (error) {

        console.error(
            "Could not read YouTube songs:",
            error
        );

        youtubeSongs = [];

    }


    if (!Array.isArray(youtubeSongs)) {

        youtubeSongs = [];

    }


    const alreadySaved =
        youtubeSongs.some(
            function(item) {

                return String(
                    item.id ||
                    item.youtubeId ||
                    ""
                ) === songId;

            }
        );


    if (!alreadySaved) {

        youtubeSongs.push({
            ...song,
            id: songId,
            youtubeId:
                song.youtubeId ||
                songId
        });


        localStorage.setItem(
            "musicologistYouTubeSongs",
            JSON.stringify(youtubeSongs)
        );


        console.log(
            "YOUTUBE SONG SAVED"
        );

    }


    /* =====================================================
       SUCCESS
       ===================================================== */

    console.log(
        "================================="
    );

    console.log(
        "SONG SUCCESSFULLY ADDED"
    );

    console.log(
        "SONG:",
        song.title
    );

    console.log(
        "PLAYLIST:",
        playlist.name
    );


    alert(
        `"${song.title}" added to "${playlist.name}"`
    );


    closeAddPlaylistModal();

}


/* =========================================================
   CLOSE ADD PLAYLIST MODAL
   ========================================================= */

function closeAddPlaylistModal() {

    const modal =
        document.getElementById(
            "addToPlaylistModal"
        );


    if (modal) {

        modal.remove();

    }


    selectedSongForPlaylist =
        null;


    console.log(
        "ADD TO PLAYLIST MODAL CLOSED"
    );

}


/* =========================================================
   SEARCH ENTER KEY
   ========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();


                searchSongs(
                    searchInput.value
                );

            }

        }
    );

}


/* =========================================================
   SEARCH RESULT BUTTONS
   ========================================================= */

if (searchResults) {

    searchResults.addEventListener(
        "click",
        function(event) {

            /* =============================================
               ADD TO PLAYLIST BUTTON
               ============================================= */

            const addButton =
                event.target.closest(
                    ".search-add-playlist-btn"
                );


            if (addButton) {

                event.preventDefault();

                event.stopPropagation();


                const songId =
                    String(
                        addButton.dataset.songId ||
                        ""
                    );


                console.log(
                    "================================="
                );

                console.log(
                    "PLUS BUTTON CLICKED"
                );

                console.log(
                    "SONG ID:",
                    songId
                );


                if (!songId) {

                    console.error(
                        "SONG ID MISSING"
                    );

                    return;

                }


                showAddToPlaylist(
                    songId
                );


                return;

            }


            /* =============================================
               PLAY BUTTON
               ============================================= */

            const playButton =
                event.target.closest(
                    ".search-play-btn"
                );


            if (playButton) {

                event.preventDefault();

                event.stopPropagation();


                const songId =
                    String(
                        playButton.dataset.songId ||
                        ""
                    );


                console.log(
                    "PLAY BUTTON CLICKED:",
                    songId
                );


                if (!songId) {

                    console.error(
                        "SONG ID MISSING"
                    );

                    return;

                }


                playSearchSong(
                    songId
                );


                return;

            }

        }
    );

}


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.searchSongs =
    searchSongs;

window.displaySearchResults =
    displaySearchResults;

window.playSearchSong =
    playSearchSong;

window.showAddToPlaylist =
    showAddToPlaylist;

window.addSongToSelectedPlaylist =
    addSongToSelectedPlaylist;

window.closeAddPlaylistModal =
    closeAddPlaylistModal;


/* =========================================================
   LOADED
   ========================================================= */

console.log(
    "MUSICOLOGIST search.js loaded successfully."
);