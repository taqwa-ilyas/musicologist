/* =========================================================
   MUSICLOGIST
   Downloads Page
   ========================================================= */

"use strict";


/* =========================================================
   DEMO AUTHORIZED DOWNLOAD DATA
   ========================================================= */

const DOWNLOAD_FILES = [

    {
        id: "download-001",
        name: "MUSICLOGIST Demo Track",
        format: "MP3",
        size: "Demo file",
        icon: "fa-file-audio"
    },

    {
        id: "download-002",
        name: "MUSICLOGIST Instrumental",
        format: "WEBM",
        size: "Demo file",
        icon: "fa-file-video"
    },

    {
        id: "download-003",
        name: "MUSICLOGIST Visual Session",
        format: "MP4",
        size: "Demo file",
        icon: "fa-file-video"
    }

];


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeDownloadsPage() {

    renderDownloadFiles();

}


/* =========================================================
   RENDER DOWNLOAD FILES
   ========================================================= */

function renderDownloadFiles() {

    const container =
        document.getElementById(
            "downloadList"
        );

    const count =
        document.getElementById(
            "downloadCount"
        );

    const empty =
        document.getElementById(
            "downloadEmpty"
        );


    if (!container) {
        return;
    }


    /* UPDATE COUNT */

    if (count) {

        const total =
            DOWNLOAD_FILES.length;

        count.textContent =
            `${total} ${total === 1 ? "file" : "files"}`;

    }


    /* EMPTY STATE */

    if (!DOWNLOAD_FILES.length) {

        container.innerHTML = "";

        if (empty) {
            empty.classList.remove("hidden");
        }

        return;
    }


    if (empty) {
        empty.classList.add("hidden");
    }


    /* CREATE DOWNLOAD ITEMS */

    container.innerHTML =
        DOWNLOAD_FILES
            .map(
                file =>
                    createDownloadItem(file)
            )
            .join("");


    attachDownloadEvents(container);

}


/* =========================================================
   DOWNLOAD ITEM
   ========================================================= */

function createDownloadItem(file) {

    return `

        <article
            class="download-item"
            data-download-id="${escapeHtml(file.id)}"
        >

            <div class="download-file-icon">

                <i
                    class="fa-solid ${escapeHtml(file.icon)}"
                ></i>

            </div>


            <div class="download-information">

                <strong>
                    ${escapeHtml(file.name)}
                </strong>

                <span>
                    Authorized demo media
                </span>

            </div>


            <div class="download-meta">

                <span class="download-format">
                    ${escapeHtml(file.format)}
                </span>

                <span class="download-size">
                    ${escapeHtml(file.size)}
                </span>

            </div>


            <button
                type="button"
                class="download-button"
                data-download-action="download"
                data-download-id="${escapeHtml(file.id)}"
            >

                <i class="fa-solid fa-download"></i>

                <span>
                    Download
                </span>

            </button>

        </article>

    `;

}


/* =========================================================
   DOWNLOAD EVENTS
   ========================================================= */

function attachDownloadEvents(container) {

    container
        .querySelectorAll(
            '[data-download-action="download"]'
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const fileId =
                        button.dataset.downloadId;


                    const file =
                        DOWNLOAD_FILES.find(
                            item =>
                                item.id === fileId
                        );


                    if (!file) {
                        return;
                    }


                    showToast(
                        `${file.name} is a demo file`,
                        "fa-circle-info"
                    );

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

        initializeDownloadsPage();

    }
);