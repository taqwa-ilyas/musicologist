/* =========================================================
   MUSICOLOGIST
   Playlist Page
   ========================================================= */

"use strict";


/* =========================================================
   ELEMENTS
   ========================================================= */

const playlistGrid =
    document.getElementById("playlistGrid");

const playlistEmpty =
    document.getElementById("playlistEmpty");

const playlistCount =
    document.getElementById("playlistCount");

const createPlaylistButton =
    document.getElementById("createPlaylistButton");

const emptyCreatePlaylist =
    document.getElementById("emptyCreatePlaylist");

const playlistModal =
    document.getElementById("playlistModal");

const playlistModalClose =
    document.getElementById("playlistModalClose");

const cancelPlaylist =
    document.getElementById("cancelPlaylist");

const playlistForm =
    document.getElementById("playlistForm");

const playlistName =
    document.getElementById("playlistName");


/* =========================================================
   GET CURRENT PLAYLIST ID
   ========================================================= */

function getCurrentPlaylistId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");
}


/* =========================================================
   PLAYLIST LIST VISIBILITY
   ========================================================= */

function updatePlaylistListVisibility() {

    const playlistId =
        getCurrentPlaylistId();


    if (playlistId) {

        if (playlistGrid) {
            playlistGrid.style.display = "none";
        }

        if (playlistEmpty) {
            playlistEmpty.style.display = "none";
        }

        if (playlistCount) {
            playlistCount.style.display = "none";
        }

        if (createPlaylistButton) {
            createPlaylistButton.style.display = "none";
        }

        if (emptyCreatePlaylist) {
            emptyCreatePlaylist.style.display = "none";
        }

        return;
    }


    if (playlistGrid) {
        playlistGrid.style.display = "";
    }

    if (playlistCount) {
        playlistCount.style.display = "";
    }

    if (createPlaylistButton) {
        createPlaylistButton.style.display = "";
    }

    if (emptyCreatePlaylist) {
        emptyCreatePlaylist.style.display = "";
    }
}


/* =========================================================
   OPEN CREATE PLAYLIST MODAL
   ========================================================= */

function openPlaylistModal() {

    if (!playlistModal) {
        return;
    }

    playlistModal.classList.add("active");

    if (playlistName) {

        playlistName.value = "";

        setTimeout(function() {

            playlistName.focus();

        }, 100);
    }
}


/* =========================================================
   CLOSE CREATE PLAYLIST MODAL
   ========================================================= */

function closePlaylistModal() {

    if (!playlistModal) {
        return;
    }

    playlistModal.classList.remove("active");
}


/* =========================================================
   RENDER PLAYLISTS
   ========================================================= */

function renderPlaylists() {

    if (!playlistGrid) {
        return;
    }


    const currentPlaylistId =
        getCurrentPlaylistId();


    if (currentPlaylistId) {

        updatePlaylistListVisibility();

        return;
    }


    const playlists =
        window.getPlaylists
            ? window.getPlaylists()
            : [];


    if (playlistCount) {

        playlistCount.textContent =
            `${playlists.length} ${
                playlists.length === 1
                    ? "playlist"
                    : "playlists"
            }`;
    }


    if (!playlists.length) {

        playlistGrid.innerHTML = "";

        if (playlistEmpty) {
            playlistEmpty.classList.remove("hidden");
        }

        return;
    }


    if (playlistEmpty) {
        playlistEmpty.classList.add("hidden");
    }


    playlistGrid.style.display = "";


    playlistGrid.innerHTML =
        playlists
            .map(function(playlist) {

                const songCount =
                    Array.isArray(playlist.songs)
                        ? playlist.songs.length
                        : 0;


                return `

                    <div
                        class="playlist-card"
                        data-playlist-id="${playlist.id}"
                    >

                        <div class="playlist-card-cover">

                            <div class="playlist-cover-icon">

                                <i class="fa-solid fa-music"></i>

                            </div>

                        </div>


                        <div class="playlist-card-content">

                            <h3>
                                ${escapePlaylistText(
                                    playlist.name
                                )}
                            </h3>

                            <p>

                                ${songCount}

                                ${
                                    songCount === 1
                                        ? "song"
                                        : "songs"
                                }

                            </p>

                        </div>


                        <button
                            class="playlist-delete-button"
                            data-playlist-id="${playlist.id}"
                            title="Delete playlist"
                            type="button"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                `;

            })
            .join("");


    attachPlaylistEvents();
}


/* =========================================================
   PLAYLIST EVENTS
   ========================================================= */

function attachPlaylistEvents() {

    const playlistCards =
        document.querySelectorAll(
            ".playlist-card"
        );


    playlistCards.forEach(function(card) {

        card.addEventListener(
            "click",
            function(event) {

                if (
                    event.target.closest(
                        ".playlist-delete-button"
                    )
                ) {
                    return;
                }


                const playlistId =
                    card.dataset.playlistId;


                openPlaylistDetails(
                    playlistId
                );
            }
        );

    });


    const deleteButtons =
        document.querySelectorAll(
            ".playlist-delete-button"
        );


    deleteButtons.forEach(function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();
                event.stopPropagation();


                const playlistId =
                    button.dataset.playlistId;


                deletePlaylistFromPage(
                    playlistId
                );
            }
        );

    });
}


/* =========================================================
   OPEN PLAYLIST DETAILS
   ========================================================= */

function openPlaylistDetails(
    playlistId
) {

    if (!playlistId) {
        return;
    }


    window.location.href =
        `playlist.html?id=${encodeURIComponent(
            playlistId
        )}`;
}


/* =========================================================
   CREATE PLAYLIST
   ========================================================= */

function handleCreatePlaylist(event) {

    event.preventDefault();


    if (!playlistName) {
        return;
    }


    const name =
        playlistName.value.trim();


    if (!name) {

        alert(
            "Please enter a playlist name."
        );

        return;
    }


    if (
        typeof window.createPlaylist !==
        "function"
    ) {

        console.error(
            "createPlaylist() is not available."
        );

        return;
    }


    const created =
        window.createPlaylist(name);


    if (!created) {

        alert(
            "A playlist with this name already exists."
        );

        return;
    }


    closePlaylistModal();

    renderPlaylists();
}


/* =========================================================
   DELETE PLAYLIST
   ========================================================= */

function deletePlaylistFromPage(
    playlistId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this playlist?"
        );


    if (!confirmed) {
        return;
    }


    if (
        typeof window.deletePlaylist ===
        "function"
    ) {

        window.deletePlaylist(
            playlistId
        );
    }


    renderPlaylists();
}


/* =========================================================
   ESCAPE TEXT
   ========================================================= */

function escapePlaylistText(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================================
   GET SONG BY ID
   ========================================================= */

function getPlaylistSongById(songId) {

    if (!songId) {
        return null;
    }


    /* =====================================================
       DEMO SONGS
       ===================================================== */

    if (
        Array.isArray(
            window.MUSICLOGIST_SONGS
        )
    ) {

        const demoSong =
            window.MUSICLOGIST_SONGS.find(
                function(song) {

                    return String(song.id) ===
                        String(songId);

                }
            );


        if (demoSong) {
            return demoSong;
        }
    }


    /* =====================================================
       YOUTUBE SONGS
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


    const youtubeSong =
        youtubeSongs.find(
            function(song) {

                return String(song.id) ===
                    String(songId);

            }
        );


    if (youtubeSong) {

        /*
           Make sure the player has youtubeId.
        */

        if (!youtubeSong.youtubeId) {

            youtubeSong.youtubeId =
                youtubeSong.id;
        }


        return youtubeSong;
    }


    return null;
}


/* =========================================================
   CREATE PLAYLIST SONG CARD
   ========================================================= */

function createPlaylistSongCard(song) {

    const songId =
        song.youtubeId || song.id;


    return `

        <article
            class="music-card playlist-song-card"
            data-song-id="${songId}"
        >

            <div class="music-card-image">

                <img
                    src="${song.image || ""}"
                    alt="${escapePlaylistText(
                        song.title || "Song"
                    )}"
                >


                <button
                    type="button"
                    class="playlist-song-play"
                    data-song-id="${songId}"
                    title="Play song"
                >

                    <i class="fa-solid fa-play"></i>

                </button>

                <button
    type="button"
    class="playlist-song-remove"
    data-song-id="${song.id}"
    title="Remove from playlist"
>
    <i class="fa-solid fa-trash"></i>
</button>

            </div>


            <div class="music-card-content">

                <h3>
                    ${escapePlaylistText(
                        song.title || "Unknown Song"
                    )}
                </h3>


                <p>
                    ${escapePlaylistText(
                        song.artist || "Unknown Artist"
                    )}
                </p>


                <span>
                    ${escapePlaylistText(
                        song.category || "YouTube"
                    )}
                </span>

            </div>

        </article>

    `;
}


/* =========================================================
   PLAY PLAYLIST SONG
   ========================================================= */

function playPlaylistSong(song) {

    if (!song) {

        console.error(
            "Playlist song is missing."
        );

        return;
    }


    console.log(
        "PLAYLIST SONG SELECTED:",
        song
    );


    /* =====================================================
       YOUTUBE SONG
       ===================================================== */

    if (song.youtubeId) {

        console.log(
            "Playing YouTube playlist song:",
            song.youtubeId
        );


        if (
            typeof window.playYouTubeSong ===
            "function"
        ) {

            window.playYouTubeSong({

                id: song.id,

                youtubeId: song.youtubeId,

                title: song.title,

                artist: song.artist,

                category: song.category || "YouTube",

                image: song.image || ""

            });

            return;
        }


        console.error(
            "playYouTubeSong() is not available."
        );

        return;
    }


    /* =====================================================
       NORMAL SONG
       ===================================================== */

    if (
        typeof window.playSong ===
        "function"
    ) {

        window.playSong(song);

        return;
    }


    console.error(
        "No player function available."
    );
}


/* =========================================================
   ATTACH PLAYLIST SONG EVENTS
   ========================================================= */

function attachPlaylistSongEvents(
    container
) {

    if (!container) {
        return;
    }


    const playButtons =
        container.querySelectorAll(
            ".playlist-song-play"
        );

        


    playButtons.forEach(function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();
                event.stopPropagation();


                const songId =
                    button.dataset.songId;


                console.log(
                    "PLAYLIST PLAY BUTTON CLICKED:",
                    songId
                );


                const song =
                    getPlaylistSongById(
                        songId
                    );


                if (!song) {

                    console.error(
                        "Song not found in storage:",
                        songId
                    );

                    return;
                }


                playPlaylistSong(song);

            }
        );

    });

    const removeButtons =
    container.querySelectorAll(".playlist-song-remove");

removeButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();
                event.stopPropagation();

                const songId =
                    button.dataset.songId;

                const playlistId =
                    getCurrentPlaylistId();

                if (!playlistId || !songId) {
                    return;
                }

                const removed =
                    window.removeSongFromPlaylist(
                        playlistId,
                        songId
                    );

                if (removed) {

                    console.log(
                        "Song removed from playlist:",
                        songId
                    );

                    renderPlaylistDetails();
                }
            }
        );
    }
);
}


/* =========================================================
   RENDER PLAYLIST DETAILS
   ========================================================= */

function renderPlaylistDetails() {

    const playlistId =
        getCurrentPlaylistId();


    if (!playlistId) {
        return;
    }


    console.log(
        "PLAYLIST ID:",
        playlistId
    );


    updatePlaylistListVisibility();


    const playlist =
        window.getPlaylistById
            ? window.getPlaylistById(
                playlistId
            )
            : null;


    if (!playlist) {

        console.error(
            "Playlist not found:",
            playlistId
        );

        return;
    }


    console.log(
        "Opening playlist:",
        playlist
    );


    const songs =
        Array.isArray(playlist.songs)
            ? playlist.songs
            : [];


    console.log(
        "Songs in playlist:",
        songs
    );


    const title =
        document.getElementById(
            "playlistDetailsTitle"
        );


    if (title) {

        title.textContent =
            playlist.name;
    }


    const count =
        document.getElementById(
            "playlistDetailsCount"
        );


    if (count) {

        count.textContent =
            `${songs.length} ${
                songs.length === 1
                    ? "song"
                    : "songs"
            }`;
    }


    const container =
        document.getElementById(
            "playlistSongs"
        );


    if (!container) {

        console.error(
            "Playlist songs container not found."
        );

        return;
    }


    /* =====================================================
       EMPTY PLAYLIST
       ===================================================== */

    if (!songs.length) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i class="fa-solid fa-music"></i>

                </div>

                <h3>
                    No songs yet
                </h3>

                <p>
                    Add songs to this playlist from Search.
                </p>

            </div>

        `;

        return;
    }


    /* =====================================================
       GET ACTUAL SONG DATA
       ===================================================== */

    const playlistSongs =
        songs
            .map(function(songId) {

                return getPlaylistSongById(
                    songId
                );

            })
            .filter(function(song) {

                return song !== null;

            });


    console.log(
        "Playlist song details:",
        playlistSongs
    );


    if (!playlistSongs.length) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                </div>

                <h3>
                    Songs could not be loaded
                </h3>

                <p>
                    The saved songs are not available.
                </p>

            </div>

        `;

        return;
    }


    /* =====================================================
       RENDER SONG CARDS
       ===================================================== */

    container.innerHTML =
        playlistSongs
            .map(function(song) {

                return createPlaylistSongCard(
                    song
                );

            })
            .join("");


    attachPlaylistSongEvents(
        container
    );
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

if (createPlaylistButton) {

    createPlaylistButton.addEventListener(
        "click",
        openPlaylistModal
    );
}


if (emptyCreatePlaylist) {

    emptyCreatePlaylist.addEventListener(
        "click",
        openPlaylistModal
    );
}


if (playlistModalClose) {

    playlistModalClose.addEventListener(
        "click",
        closePlaylistModal
    );
}


if (cancelPlaylist) {

    cancelPlaylist.addEventListener(
        "click",
        closePlaylistModal
    );
}


if (playlistForm) {

    playlistForm.addEventListener(
        "submit",
        handleCreatePlaylist
    );
}


/* =========================================================
   CLOSE MODAL OUTSIDE CLICK
   ========================================================= */

if (playlistModal) {

    playlistModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                playlistModal
            ) {

                closePlaylistModal();
            }

        }
    );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updatePlaylistListVisibility();

        renderPlaylists();

        renderPlaylistDetails();

    }
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.renderPlaylists =
    renderPlaylists;

window.openPlaylistModal =
    openPlaylistModal;

window.closePlaylistModal =
    closePlaylistModal;

window.deletePlaylistFromPage =
    deletePlaylistFromPage;

window.openPlaylistDetails =
    openPlaylistDetails;

window.renderPlaylistDetails =
    renderPlaylistDetails;

window.getPlaylistSongById =
    getPlaylistSongById;

window.createPlaylistSongCard =
    createPlaylistSongCard;

window.playPlaylistSong =
    playPlaylistSong;


/* =========================================================
   LOADED
   ========================================================= */

console.log(
    "MUSICOLOGIST playlist.js loaded successfully."
);