/* =========================================================
   MUSICLOGIST
   Library Page
   ========================================================= */

"use strict";

let activeLibraryTab = "favorites";

/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeLibraryPage() {

    const tabs =
        document.querySelectorAll(
            ".library-tab"
        );

    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                tabs.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                tab.classList.add(
                    "active"
                );

                activeLibraryTab =
                    tab.dataset.libraryTab;

                renderLibrary();
            }
        );
    });

    const params =
        new URLSearchParams(
            window.location.search
        );

    if (
        params.get("tab") ===
        "recent"
    ) {

        activeLibraryTab =
            "recent";

        tabs.forEach(tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.libraryTab ===
                    "recent"
            );
        });
    }

    renderLibrary();
}

/* =========================================================
   RENDER LIBRARY
   ========================================================= */

function renderLibrary() {

    const container =
        document.getElementById(
            "librarySongs"
        );

    const empty =
        document.getElementById(
            "libraryEmpty"
        );

    const heading =
        document.getElementById(
            "libraryHeading"
        );

    const kicker =
        document.getElementById(
            "libraryKicker"
        );

    const count =
        document.getElementById(
            "libraryCount"
        );

    if (!container) {
        return;
    }

    let ids = [];

    if (
        activeLibraryTab ===
        "favorites"
    ) {

        ids =
            window.getFavorites();

        if (heading) {
            heading.textContent =
                "Your favorite tracks";
        }

        if (kicker) {
            kicker.textContent =
                "FAVORITES";
        }

    } else {

        ids =
            window.getHistory();

        if (heading) {
            heading.textContent =
                "Recently played";
        }

        if (kicker) {
            kicker.textContent =
                "LISTENING HISTORY";
        }
    }

    const songs =
        ids
            .map(
                id =>
                    window.getSongById(id)
            )
            .filter(Boolean);

    if (count) {

        count.textContent =
            `${songs.length} ${
                songs.length === 1
                    ? "track"
                    : "tracks"
            }`;
    }

    if (!songs.length) {

        container.innerHTML = "";

        if (empty) {
            empty.classList.remove(
                "hidden"
            );
        }

        return;
    }

    if (empty) {
        empty.classList.add(
            "hidden"
        );
    }

   if (
    activeLibraryTab === "recent" ||
    activeLibraryTab === "favorites"
) {

    container.innerHTML =
        songs
            .map(song => `
                <div
                    class="recent-track"
                    data-song-id="${window.escapeHtml(song.id)}"
                >

                    <div class="recent-track-image">

                        <img
                            src="${window.escapeHtml(song.image || "")}"
                            alt="${window.escapeHtml(song.title || "Song")}"
                        >

                    </div>

                    <div class="recent-track-info">

                        <h3>
                            ${window.escapeHtml(
                                song.title || "Unknown Song"
                            )}
                        </h3>

                        <p>
                            ${window.escapeHtml(
                                song.artist || "Unknown Artist"
                            )}
                        </p>

                    </div>

                    <div class="recent-track-category">
                        ${window.escapeHtml(
                            song.category || "YouTube"
                        )}
                    </div>

                    <button
                        type="button"
                        class="recent-track-play"
                        data-recent-song="${window.escapeHtml(song.id)}"
                        title="Play song"
                    >
                        <i class="fa-solid fa-play"></i>
                    </button>

                </div>
            `)
            .join("");


    container
        .querySelectorAll(".recent-track-play")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    const songId =
                        button.dataset.recentSong;

                    const song =
                        window.getSongById(songId);

                    if (!song) {
                        console.error(
                            "Library song not found:",
                            songId
                        );
                        return;
                    }


                    /* YouTube Song */

                    if (
                        song.youtubeId &&
                        typeof window.playYouTubeSong ===
                            "function"
                    ) {

                        window.playYouTubeSong(
                            song
                        );

                        return;
                    }


                    /* Demo Song */

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

        });

    return;
} {

    container.innerHTML =
        songs
            .map(song => `
                <div
                    class="recent-track"
                    data-song-id="${window.escapeHtml(song.id)}"
                >

                    <div class="recent-track-image">

                        <img
                            src="${window.escapeHtml(song.image || "")}"
                            alt="${window.escapeHtml(song.title || "Song")}"
                        >

                    </div>

                    <div class="recent-track-info">

                        <h3>
                            ${window.escapeHtml(
                                song.title || "Unknown Song"
                            )}
                        </h3>

                        <p>
                            ${window.escapeHtml(
                                song.artist || "Unknown Artist"
                            )}
                        </p>

                    </div>

                    <div class="recent-track-category">
                        ${window.escapeHtml(
                            song.category || "YouTube"
                        )}
                    </div>

                    <button
                        type="button"
                        class="recent-track-play"
                        data-recent-song="${window.escapeHtml(song.id)}"
                        title="Play song"
                    >
                        <i class="fa-solid fa-play"></i>
                    </button>

                </div>
            `)
            .join("");

    container
        .querySelectorAll(".recent-track-play")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    const songId =
                        button.dataset.recentSong;

                    const song =
                        window.getSongById(songId);

                    if (!song) {
                        console.error(
                            "Recent song not found:",
                            songId
                        );
                        return;
                    }

                    console.log(
                        "Playing recent song:",
                        song
                    );

                    if (
                        song.youtubeId &&
                        typeof window.playYouTubeSong ===
                            "function"
                    ) {

                        window.playYouTubeSong(
                            song
                        );

                        return;
                    }

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

        });

    return;
}


/* FAVORITES */

container.innerHTML =
    songs
        .map(
            song =>
                window.createMusicCard(
                    song
                )
        )
        .join("");

window.attachMusicCardEvents(
    container
);
}

/* =========================================================
   REFRESH WHEN WINDOW FOCUSES
   ========================================================= */

window.addEventListener(
    "focus",
    () => {
        renderLibrary();
    }
);

/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeLibraryPage();
    }
);