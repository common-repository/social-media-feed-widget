//Reload page function 
function reload() {
    window.location.reload(true);
}

//Format numbers for instagram post like,comments
function formatNumber(num) {
    if (num === undefined || num === null) {
        return '0';
    }

    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1) + 'b';
    } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + 'm';
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + 'k';
    } else {
        return num.toString();
    }
}

// This object is used to keep track of the current slide index for multiple images in one post.
let slideIndex = {};

// Function to initialize slides for a specific post
function initSlides(postId, len) {
    slideIndex[postId] = 1;
    showSlides(postId, slideIndex[postId], len);
}

// Function to handle next/prev slide for a specific post
function plusSlides(postId, n, len) {
    showSlides(postId, slideIndex[postId] += n, len);
}

// Function to show slides for a specific post
function showSlides(postId, n, len) {
    let slides = document.querySelectorAll(`.post-${postId} .lwip-slides`);

    if (n > len) {
        slideIndex[postId] = 1;
    }

    if (n < 1) {
        slideIndex[postId] = len;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex[postId] - 1].style.display = "block";

    let nextButton = document.querySelector(`.post-${postId} .popup-children-next`);
    let prevButton = document.querySelector(`.post-${postId} .popup-children-prev`);

    if (slideIndex[postId] === 1) {
        prevButton.style.display = 'none';
    } else {
        prevButton.style.display = 'block';
    }

    if (slideIndex[postId] === len) {
        nextButton.style.display = 'none';
    } else {
        nextButton.style.display = 'block';
    }
}

//Function to handle gap and gutter between post cards
function calculateGutter(borderWidth, gapValueGlobal) {
    // Define gutter increments based on border width
    const baseGutter = 2; // Base gutter for border width 1
    const increment = 2;  // Increment in gutter for each additional border width

    // Calculate the gutter based on border width
    let gutterAtBorderWidth = baseGutter + (borderWidth - 1) * increment;

    // If gapValueGlobal is 0, return the gutter value for the given border width
    if (gapValueGlobal === 0) {
        return gutterAtBorderWidth;
    }

    // Otherwise, add gapValueGlobal to the gutter value for a given border width
    return gapValueGlobal + gutterAtBorderWidth;
}

// Function to get the baseWidth for a given column number
function getBaseWidth(columnNumber) {

    //Return width according to column value
    const columnToBaseWidth = {
        1: 700,
        2: 500,
        3: 350,
        4: 300,
        5: 250,
        6: 200,
        7: 180,
        8: 150,
        9: 130,
        10: 120
    };

    // Get the base width from columnToBaseWidth or default to 300
    let baseWidth = columnToBaseWidth[columnNumber] || 300;

    // Adjust baseWidth if gap is provided
    if (gapValueGlobal) {
        baseWidth -= gapValueGlobal; // Subtract the gap from baseWidth
    }

    return baseWidth;
}

// Global variables for handling various tasks related to user settings, UI state, and application configuration
let isLifetimeDeal;
let defaultSelectedSourceType;
let styleType;
let userDataGlobal;
let gapValueGlobal;
let widthValueGlobal;
let sourceIdGlobal;
let selectedAccountType;
let columnValueGlobal;
let rowValueGlobal;
let postProfilePicture;
let arrowControlGlobal, dragControlGlobal, animationSpeedGlobal, autoPlayGlobal;
let headerProfilePicture, headerFName, headerUName, headerVBadge, headerPCount, headerFollowingsCount, headerFollowersCount, headerFButton;
var offset = 0;
let globalColumnValue
let globalRowValue;
let isMasonryStyle = false;
let masonryLayout;

/**
 * Renders a media post for the user interface.
 *
 * This function is responsible for generating and displaying a media post
 * on the user interface. It collects all relevant post data and integrates
 * it into a specified HTML template, which is then presented to the user.
 * 
 */
function renderMediaPosts(userData, appendPosts) {

    if (userData === undefined) {
        return;
    }
    // Set Data for popup element
    userDataGlobal = JSON.stringify(userData);
    userDataGlobal = JSON.parse(userDataGlobal);

    window.loadTranslation(selectedLanguageGlobal);

    //check layout style and display cards according to that.
    if (styleType === 'GRID' || styleType === 'MASONRY') {

        document.getElementById('lwip-modal-preview-grid').innerHTML = '';
        document.getElementById('lwip-modal-preview-slider').innerHTML = '';

        if (gapValueGlobal) {
            document.querySelectorAll('.lwip-post-wrapper').forEach(function (element) {
                element.style.gap = gapValueGlobal + 'px';
            });
        }

        if (typeof widthValueGlobal !== 'undefined' && widthValueGlobal !== null) {
            document.querySelectorAll('.lwip-post-wrapper').forEach(function (element) {
                element.style.width = widthValueGlobal;
            });
        }

        if (styleType === 'GRID') {
            document.querySelectorAll('.lwip-grid-svg').forEach(function (element) {
                element.style.fill = '#27c4cf';
            });

            document.querySelectorAll('.lwip-grid-span').forEach(function (element) {
                element.style.fill = '#27c4cf';
            });
        } else {
            jQuery("#lwip-side-menu-layout-slider").hide();
            document.querySelectorAll('.lwip-masonry-view-cls .lwip-svg-img-fill').forEach(function (element) {
                element.style.fill = '#27c4cf';
            });

            document.querySelectorAll(' .lwip-masonry-view-cls span').forEach(function (element) {
                element.style.fill = '#27c4cf';
            });
        }

        const postWrapper = document.getElementById('lwip-modal-preview-grid');

        if (!userData || userData.length === 0) {
            postWrapper.innerHTML = '';
            return;
        }

        if (!appendPosts) {
            postWrapper.innerHTML = '';
        }
        userData.forEach(media => {
            const post = document.createElement('div');
            post.classList.add('lwip-cards');
            post.classList.add('masonry-active');
            const profileHeader = document.createElement('div');
            profileHeader.classList.add('lwip-cards-header');

            // Format the date from timestamp
            const date = new Date(media.timestamp);
            const options = { month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);

            const profilePicHtml = postProfilePicture ?
                `<div class="profile-pic"><img src="${postProfilePicture}" alt="Profile Picture"></div>` : '';

            profileHeader.innerHTML = `
            <div class="actions lwip-card-content-header">
                <div class="header-info">
                ${profilePicHtml}
                    <div class="lwip-card-content-user-detail">
                        <h2 id="card-username" class="lwip-header-card-username">${media.username}</h2>
                        <span id="card-date" class="lwip-header-card-date">${formattedDate}</span></div>
                    </div>
                <div class="instalogo lwip-card-instagram-link" id="card-instagram-link">   
                    <button class="lwip-popup-instagram-button" onclick="window.open('${media.permalink}', '_blank')">
                        <svg class="lwip-card-custom-color" viewBox="64 64 896 896" focusable="false" data-icon="instagram" width="1.5em" height="1.5em" fill="currentColor" aria-hidden="true" style="color:black" >
                        <path d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9zm0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zm213.5-394.6c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9a47.84 47.84 0 00-47.9-47.9zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zm-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z"></path>
                        </svg>
                    </button>
                </div>
            </div>`;
            post.appendChild(profileHeader);


            if (media.mediaUrl) {
                const mediaContainer = document.createElement('div');
                mediaContainer.classList.add('lwip-cards-image');
                if (media.mediaType === 'VIDEO') {
                    mediaContainer.innerHTML = `
                <div class="video-container lwip-video-container-icon">
                <div class="lwip-video-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M23.467,5.762c-0.118-0.045-0.232-0.068-0.342-0.068c-0.246,0-0.451,0.087-0.615,0.26l-3.76,3.217v5.766l3.76,3.578c0.164,0.173,0.369,0.26,0.615,0.26c0.109,0,0.223-0.023,0.342-0.068C23.822,18.552,24,18.284,24,17.901V6.57C24,6.186,23.822,5.917,23.467,5.762z"></path><path d="M16.33,4.412c-0.77-0.769-1.696-1.154-2.78-1.154H3.934c-1.084,0-2.01,0.385-2.78,1.154C0.385,5.182,0,6.108,0,7.192v9.616c0,1.084,0.385,2.01,1.154,2.78c0.77,0.77,1.696,1.154,2.78,1.154h9.616c1.084,0,2.01-0.385,2.78-1.154c0.77-0.77,1.154-1.696,1.154-2.78v-3.076v-3.478V7.192C17.484,6.108,17.099,5.182,16.33,4.412z M8.742,17.229c-2.888,0-5.229-2.341-5.229-5.229c0-2.888,2.341-5.229,5.229-5.229S13.971,9.112,13.971,12C13.971,14.888,11.63,17.229,8.742,17.229z"></path><circle cx="8.742" cy="12" r="3.5"></circle>
                        </svg>
                    </div>
                    ${popupDisplay === 'POPUP' ? `
                    <div class="image-popup-trigger" data-url="${media.mediaUrl}" onclick="openPopupModal()">
                        <video controls>
                            <source src="${media.mediaUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div> ` : popupDisplay === 'NONE' ? `
                    <video controls>
                        <source src="${media.mediaUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>` : `
                    <a href="${media.permalink}" target="_blank">
                        <video controls>
                            <source src="${media.mediaUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </a>`}

                  <div class="lwip-display-hover-overlay video-hover" id="video-hover-display-div" onclick="checkAndOpenPopupModal('${media.permalink}')">
                        <div class="lwip-display-hover-text">
                            <div class="lwip-caption-action">

                                ${media.likeCount !== undefined ? `
                                <div class="lwip-card-likes">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color">
                                            <path d="M17.7,1.5c-2,0-3.3,0.5-4.9,2.1c0,0-0.4,0.4-0.7,0.7c-0.3-0.3-0.7-0.7-0.7-0.7c-1.6-1.6-3-2.1-5-2.1C2.6,1.5,0,4.6,0,8.3c0,4.2,3.4,7.1,8.6,11.5c0.9,0.8,1.9,1.6,2.9,2.5c0.1,0.1,0.3,0.2,0.5,0.2s0.3-0.1,0.5-0.2c1.1-1,2.1-1.8,3.1-2.7c4.8-4.1,8.5-7.1,8.5-11.4C24,4.6,21.4,1.5,17.7,1.5z M14.6,18.6c-0.8,0.7-1.7,1.5-2.6,2.3c-0.9-0.7-1.7-1.4-2.5-2.1c-5-4.2-8.1-6.9-8.1-10.5c0-3.1,2.1-5.5,4.9-5.5c1.5,0,2.6,0.3,3.8,1.5c1,1,1.2,1.2,1.2,1.2C11.6,5.9,11.7,6,12,6.1c0.3,0,0.5-0.2,0.7-0.4c0,0,0.2-0.2,1.2-1.3c1.3-1.3,2.1-1.5,3.8-1.5c2.8,0,4.9,2.4,4.9,5.5C22.6,11.9,19.4,14.6,14.6,18.6z"></path>
                                        </svg>
                                    </div>
                                    <p>${formatNumber(media.likeCount)}</p>
                                </div>
                                ` : ''}
                                
                                 ${media.commentsCount !== undefined ? `
                                <div class="comments">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color">
                                            <title>3.9K</title>
                                            <path d="M1,11.9C1,17.9,5.8,23,12,23c1.9,0,3.7-1,5.3-1.8l5,1.3l0,0c0.1,0,0.1,0,0.2,0c0.4,0,0.6-0.3,0.6-0.6c0-0.1,0-0.1,0-0.2 l-1.3-4.9c0.9-1.6,1.4-2.9,1.4-4.8C23,5.8,18,1,12,1C5.9,1,1,5.9,1,11.9z M2.4,11.9c0-5.2,4.3-9.5,9.5-9.5c5.3,0,9.6,4.2,9.6,9.5 c0,1.7-0.5,3-1.3,4.4l0,0c-0.1,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.1,0,0.1l0,0l1.1,4.1l-4.1-1.1l0,0c-0.1,0-0.1,0-0.2,0 c-0.1,0-0.2,0-0.3,0.1l0,0c-1.4,0.8-3.1,1.8-4.8,1.8C6.7,21.6,2.4,17.2,2.4,11.9z"></path>
                                        </svg>
                                    </div>
                                    <p>${formatNumber(media.commentsCount)}</p>
                                </div>
                                ` : ''}
                            </div>
                            <div class="lwip-card-caption">
                                <span class="lwip-content-display-card">${media.caption !== null ? media.caption : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                } else {
                    mediaContainer.innerHTML = `
                <div class="image-container">
                ${popupDisplay === 'POPUP' ? `
                <div class="image-popup-trigger" data-url="${media.mediaUrl}" onclick="openPopupModal()">
                    <img src="${media.mediaUrl}" alt="Thumbnail">
                </div>` : popupDisplay === 'NONE' ? `
                <img src="${media.mediaUrl}" alt="Thumbnail">` : `
                <a href="${media.permalink}" target="_blank">
                    <img src="${media.mediaUrl}" alt="Thumbnail">
                </a>`}

                ${media.children ? `
                    <div class="lwip-image-overlay-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" aria-label="Carousel" class="x1lliihq x1n2onr6" role="img" viewBox="0 0 48 48">
                            <title>Carousel</title>
                            <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>
                        </svg>
                    </div>` : ''}

                <div class="lwip-display-hover-overlay image-hover" id="image-hover-display-div" onclick="checkAndOpenPopupModal('${media.permalink}')">
                    <div class="lwip-display-hover-text">
                        <div class="lwip-caption-action">

                            ${media.likeCount !== undefined ? `
                            <div id="card-likes" class="lwip-card-likes">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color">
                                        <path d="M17.7,1.5c-2,0-3.3,0.5-4.9,2.1c0,0-0.4,0.4-0.7,0.7c-0.3-0.3-0.7-0.7-0.7-0.7c-1.6-1.6-3-2.1-5-2.1C2.6,1.5,0,4.6,0,8.3c0,4.2,3.4,7.1,8.6,11.5c0.9,0.8,1.9,1.6,2.9,2.5c0.1,0.1,0.3,0.2,0.5,0.2s0.3-0.1,0.5-0.2c1.1-1,2.1-1.8,3.1-2.7c4.8-4.1,8.5-7.1,8.5-11.4C24,4.6,21.4,1.5,17.7,1.5z M14.6,18.6c-0.8,0.7-1.7,1.5-2.6,2.3c-0.9-0.7-1.7-1.4-2.5-2.1c-5-4.2-8.1-6.9-8.1-10.5c0-3.1,2.1-5.5,4.9-5.5c1.5,0,2.6,0.3,3.8,1.5c1,1,1.2,1.2,1.2,1.2C11.6,5.9,11.7,6,12,6.1c0.3,0,0.5-0.2,0.7-0.4c0,0,0.2-0.2,1.2-1.3c1.3-1.3,2.1-1.5,3.8-1.5c2.8,0,4.9,2.4,4.9,5.5C22.6,11.9,19.4,14.6,14.6,18.6z"></path>
                                    </svg>
                                </div>
                                <p class="lwip-card-custom-color">${formatNumber(media.likeCount)}</p>
                            </div>
                            ` : ''}

                             ${media.commentsCount !== undefined ? `
                            <div id="card-comments" class="comments">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color">
                                        <title>3.9K</title>
                                        <path d="M1,11.9C1,17.9,5.8,23,12,23c1.9,0,3.7-1,5.3-1.8l5,1.3l0,0c0.1,0,0.1,0,0.2,0c0.4,0,0.6-0.3,0.6-0.6c0-0.1,0-0.1,0-0.2 l-1.3-4.9c0.9-1.6,1.4-2.9,1.4-4.8C23,5.8,18,1,12,1C5.9,1,1,5.9,1,11.9z M2.4,11.9c0-5.2,4.3-9.5,9.5-9.5c5.3,0,9.6,4.2,9.6,9.5 c0,1.7-0.5,3-1.3,4.4l0,0c-0.1,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.1,0,0.1l0,0l1.1,4.1l-4.1-1.1l0,0c-0.1,0-0.1,0-0.2,0 c-0.1,0-0.2,0-0.3,0.1l0,0c-1.4,0.8-3.1,1.8-4.8,1.8C6.7,21.6,2.4,17.2,2.4,11.9z"></path>
                                    </svg>
                                </div>
                                <p class="lwip-card-custom-color">${formatNumber(media.commentsCount)}</p>
                            </div>
                             ` : ''}
                             
                        </div>
                        <div class="lwip-card-caption">
                            <span class="lwip-content-display-card">${media.caption !== null ? media.caption : ''}</span>
                        </div>
                    </div>
                </div>
                </div>
                `;
                }

                post.appendChild(mediaContainer);

                const postFooter = document.createElement('div');
                postFooter.classList.add('lwip-cards-footer');
                postFooter.innerHTML = `
                <div class="actions">
                    <div class="lwip-caption-action">

                        ${media.likeCount !== undefined ? `
                            <div id="card-likes" class="lwip-card-likes lwip-card-like-footer">
                                <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color"><path d="M17.7,1.5c-2,0-3.3,0.5-4.9,2.1c0,0-0.4,0.4-0.7,0.7c-0.3-0.3-0.7-0.7-0.7-0.7c-1.6-1.6-3-2.1-5-2.1C2.6,1.5,0,4.6,0,8.3c0,4.2,3.4,7.1,8.6,11.5c0.9,0.8,1.9,1.6,2.9,2.5c0.1,0.1,0.3,0.2,0.5,0.2s0.3-0.1,0.5-0.2c1.1-1,2.1-1.8,3.1-2.7c4.8-4.1,8.5-7.1,8.5-11.4C24,4.6,21.4,1.5,17.7,1.5z M14.6,18.6c-0.8,0.7-1.7,1.5-2.6,2.3c-0.9-0.7-1.7-1.4-2.5-2.1c-5-4.2-8.1-6.9-8.1-10.5c0-3.1,2.1-5.5,4.9-5.5c1.5,0,2.6,0.3,3.8,1.5c1,1,1.2,1.2,1.2,1.2C11.6,5.9,11.7,6,12,6.1c0.3,0,0.5-0.2,0.7-0.4c0,0,0.2-0.2,1.2-1.3c1.3-1.3,2.1-1.5,3.8-1.5c2.8,0,4.9,2.4,4.9,5.5C22.6,11.9,19.4,14.6,14.6,18.6z"></path></svg></div>
                                <p class="lwip-card-custom-color">${formatNumber(media.likeCount)}</p>
                            </div>
                        ` : ''}

                        ${media.commentsCount !== undefined ? `
                            <div id="card-comments" class="comments lwip-card-comment-footer">
                                <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color"><title>3.9K</title><path d="M1,11.9C1,17.9,5.8,23,12,23c1.9,0,3.7-1,5.3-1.8l5,1.3l0,0c0.1,0,0.1,0,0.2,0c0.4,0,0.6-0.3,0.6-0.6c0-0.1,0-0.1,0-0.2         l-1.3-4.9c0.9-1.6,1.4-2.9,1.4-4.8C23,5.8,18,1,12,1C5.9,1,1,5.9,1,11.9z M2.4,11.9c0-5.2,4.3-9.5,9.5-9.5c5.3,0,9.6,4.2,9.6,9.5         c0,1.7-0.5,3-1.3,4.4l0,0c-0.1,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.1,0,0.1l0,0l1.1,4.1l-4.1-1.1l0,0c-0.1,0-0.1,0-0.2,0         c-0.1,0-0.2,0-0.3,0.1l0,0c-1.4,0.8-3.1,1.8-4.8,1.8C6.7,21.6,2.4,17.2,2.4,11.9z"></path></svg></div>
                                <p class="lwip-card-custom-color">${formatNumber(media.commentsCount)}</p>
                            </div>
                        ` : ''}

                    </div>

                    <div class="lwip-caption-action" id="lwip-card-footer-share-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="text-22 lwip-card-custom-color-fill">
                            <path
                                d="M22.8,10.5l-9.8-7.9c-0.2-0.2-0.5-0.2-0.7-0.1c-0.2,0.1-0.4,0.4-0.4,0.6v3.7C6.5,7,4.5,8.9,2.6,12.4C1,15.4,1,18.9,1,21.3   c0,0.2,0,0.4,0,0.5c0,0.3,0.2,0.6,0.5,0.7c0.1,0,0.1,0,0.2,0c0.2,0,0.5-0.1,0.6-0.3c3.7-6.5,5.5-6.8,9.5-6.8V19   c0,0.3,0.2,0.5,0.4,0.6s0.5,0.1,0.7-0.1l9.8-8c0.2-0.1,0.2-0.3,0.2-0.5S22.9,10.7,22.8,10.5z M13.2,17.6v-2.9   c0-0.2-0.1-0.4-0.2-0.5c-0.1-0.1-0.3-0.2-0.5-0.2c-2.7,0-3.8,0-5.9,0.9c-1.8,0.8-2.8,2.3-4.2,4.5c0.1-2,0.3-4.4,1.4-6.4   c1.7-3.2,3.5-4.8,8.7-4.8c0.4,0,0.7-0.3,0.7-0.7V4.6l8.1,6.5L13.2,17.6z">
                            </path>
                        </svg>
                        <p class="lwip-content-display-card lwip-insta-post-card-footer-share popup-toggle-btn lwip-card-custom-color">Share</p>
                        <div class="lwip-popup-container-share">
                            <div class="lwip-popup-share lwip-hidden-share">
                                <ul>
                                    <li class="lwip-popup-share-hover-fb">

                                        <svg class="lwip-share-svgs lwip-card-custom-color" viewBox="64 64 896 896" focusable="false" data-icon="facebook" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-92.4 233.5h-63.9c-50.1 0-59.8 23.8-59.8 58.8v77.1h119.6l-15.6 120.7h-104V912H539.2V602.2H434.9V481.4h104.3v-89c0-103.3 63.1-159.6 155.3-159.6 44.2 0 82.1 3.3 93.2 4.8v107.9z"></path>
                                        </svg>
                                        
                                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(media.permalink)}"
                                                target="_blank"
                                                onclick="window.open(this.href, 'facebookShare', 'width=600,height=400'); return false;">

                                                <span class="lwip-insta-post-card-footer-facebook-share lwip-card-custom-color">Share on Facebook</span>
                                        </a>
                                    </li>
                                                
                                    <li class="lwip-popup-share-hover-tw">

                                        <svg class="lwip-share-svgs lwip-card-custom-color"  viewBox="64 64 896 896" focusable="false" data-icon="twitter" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4a170.1 170.1 0 0075-94 336.64 336.64 0 01-108.2 41.2A170.1 170.1 0 00672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5a169.32 169.32 0 00-23.2 86.1c0 59.2 30.1 111.4 76 142.1a172 172 0 01-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4a180.6 180.6 0 01-44.9 5.8c-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z"></path>
                                        </svg>

                                        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(media.caption)}&url=${encodeURIComponent(media.permalink)}" "target="
                                                _blank"
                                                onclick="window.open(this.href, 'facebookShare', 'width=600,height=400'); return false;">
                                                <i class="fas fa-sign-out-alt"></i> 
                                                <span class="lwip-insta-post-card-footer-twitter-share lwip-card-custom-color">Share on Twitter</span>
                                        </a>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lwip-card-caption lwip-card-caption-footer" id="card-caption"><span class="lwip-content-display-card">${media.caption !== null ? media.caption : ''}</span></div>
            `;
                post.appendChild(postFooter);
            }


            postWrapper.appendChild(post);
            const footer = post.querySelector('.lwip-cards-footer');
            const header = post.querySelector('.lwip-cards-header');

            const hoverButton = document.getElementById("lwip-post-style-hover-btn");
            const simpleButton = document.getElementById("lwip-post-style-simple-btn");

            function toggleHoverEffect(enable) {
                if (isLifetimeDeal === true) {
                    const hoverOverlays = document.querySelectorAll(".lwip-display-hover-overlay");
                    hoverOverlays.forEach(function (overlay) {
                        overlay.style.display = enable ? "block" : "none";
                    });

                    // Toggle the visibility of footer and header
                    footer.style.display = enable ? "none" : "block";
                    header.style.display = enable ? "none" : "block";
                }
            }

            // Add event listener for the Hover button
            hoverButton.addEventListener("click", function () {
                if (isLifetimeDeal === true) {
                    toggleHoverEffect(true);
                }
            });

            // Add event listener for the Simple button
            simpleButton.addEventListener("click", function () {
                toggleHoverEffect(false);
            });

            if (hoverOrSimpleStyle === 'SIMPLE') {
                toggleHoverEffect(false);
            } else {
                toggleHoverEffect(true);
            }

            hoverButton.addEventListener("click", function () {
                // Hide footer and header of this post
                if (isLifetimeDeal === true) {
                    footer.style.display = "none";
                    header.style.display = "none";
                }
            });

            simpleButton.addEventListener("click", function () {
                // Show footer and header of this post
                footer.style.display = "block";
                header.style.display = "block";
            });

            var profilePicInsta = post.querySelector('.profile-pic');
            var cardUsername = post.querySelector('.lwip-header-card-username');
            var IuserCheckbox = document.getElementById('lwip-insta-post-user');

            var cardDate = post.querySelector('.lwip-header-card-date');
            var IdateCheckbox = document.getElementById('lwip-insta-post-date');

            var cardInstagramLink = post.querySelector('.lwip-card-instagram-link');
            var IlinkCheckbox = document.getElementById('lwip-insta-post-link');

            var cardShare = post.querySelector('#lwip-card-footer-share-container');
            var IshareCheckbox = document.getElementById('lwip-insta-post-share');

            var cardLikes = post.querySelector('.lwip-card-likes');
            var cardLikesFooter = post.querySelector('.lwip-card-like-footer');
            var IlikeCheckbox = document.getElementById('lwip-insta-post-likes');

            var cardComments = post.querySelector('.comments');
            var cardCommentsFooter = post.querySelector('.lwip-card-comment-footer');
            var IcommentsCheckbox = document.getElementById('lwip-insta-post-comments');

            var cardCaption = post.querySelector('.lwip-card-caption');
            var cardcaptionFooter = post.querySelector('.lwip-card-caption-footer');
            var ItextCheckbox = document.getElementById('lwip-insta-post-texts');

            // Function to toggle visibility based on checkbox state
            function setupCheckboxEventListeners(checkbox, cardElement) {
                if (checkbox && cardElement) {

                    checkbox.addEventListener('change', function () {
                        if (this.checked) {
                            cardElement.style.display = 'flex';
                        } else {
                            cardElement.style.display = 'none';
                        }
                    });

                    // Set the initial visibility based on the checkbox state
                    if (checkbox.checked) {
                        cardElement.style.display = 'flex';
                    } else {
                        cardElement.style.display = 'none';
                    }
                }
            }

            function setupCheckboxEventListenersPremium(checkbox, cardElement) {
                if (checkbox && cardElement) {
                    if (isLifetimeDeal === true) {
                        checkbox.addEventListener('change', function () {
                            if (this.checked) {
                                cardElement.style.display = 'flex';
                            } else {
                                cardElement.style.display = 'none';
                            }
                        });
                    }
                    // Set the initial visibility based on the checkbox state
                    if (checkbox.checked) {
                        cardElement.style.display = 'flex';
                    } else {
                        cardElement.style.display = 'none';
                    }
                }
            }

            function setupCheckboxEventListenersUsername(checkbox, cardElement) {
                if (checkbox && cardElement) {
                    checkbox.addEventListener('change', function () {
                        if (this.checked) {
                            cardElement.style.display = 'block';
                        } else {
                            cardElement.style.display = 'none';
                        }
                    });

                    // Set the initial visibility based on the checkbox state
                    if (checkbox.checked) {
                        cardElement.style.display = 'block';
                    } else {
                        cardElement.style.display = 'none';
                    }
                }
            }

            // Call the function for each checkbox and card pair

            setupCheckboxEventListenersUsername(IuserCheckbox, cardUsername);
            setupCheckboxEventListeners(IuserCheckbox, profilePicInsta);
            setupCheckboxEventListeners(IdateCheckbox, cardDate);
            setupCheckboxEventListeners(IlinkCheckbox, cardInstagramLink);
            setupCheckboxEventListenersPremium(IshareCheckbox, cardShare);
            setupCheckboxEventListenersPremium(IlikeCheckbox, cardLikes);
            setupCheckboxEventListenersPremium(IcommentsCheckbox, cardComments);

            setupCheckboxEventListeners(ItextCheckbox, cardCaption);
            setupCheckboxEventListeners(ItextCheckbox, cardcaptionFooter);

            setupCheckboxEventListenersPremium(IcommentsCheckbox, cardCommentsFooter);
            setupCheckboxEventListenersPremium(IlikeCheckbox, cardLikesFooter);

            let currentDisplayedCards = 0;
            document.querySelector('.lwip-post-wrapper').style.gridTemplateColumns = `repeat(${columnValueGlobal}, 1fr)`;
            const maxCards = columnValueGlobal * rowValueGlobal;
            const cards = document.querySelectorAll('.lwip-post-wrapper .lwip-cards');
            const loadMoreButton = document.getElementById('lwip-load-more-btn');

            Array.from(cards).forEach((card, index) => {
                if (index < maxCards) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                currentDisplayedCards = maxCards;
            });

            if (cards.length > maxCards) {
                loadMoreButton.style.display = 'block';
            } else {
                loadMoreButton.style.display = 'none';
            }

        });

        if (globalCustomStyleSelection) {
            updateCustomStyleSection(globalCustomStyleSelection);
        }

        //Handle Masonry layout
        if (styleType === 'MASONRY') {

            isMasonryStyle = true;
            var columnNumber = columnValueGlobal;
            var baseWidth = getBaseWidth(columnNumber);

            //Select masonry elements
            const masonryWrapper = document.querySelector('.masonry');
            const masnoryActive = document.querySelector('.masonry-active');

            //Update css to display masnory cards
            if (masonryWrapper) {
                jQuery('.lwip-post-wrapper').css('display', 'block',
                    'grid-template-columns', '',
                    'grid-auto-rows', 'max-content',
                );

                jQuery('.lwip-post-wrapper .lwip-cards-image').css('padding-top', '0', 'width', '0', 'overflow', 'none');
                jQuery('.lwip-post-wrapper .lwip-cards-image img').css('position', 'relative');
                jQuery('.lwip-post-wrapper .lwip-cards-image video').css('position', 'relative');
            }

            if (masnoryActive) {
                jQuery('.masonry-active').css('position', 'absolute');
            }

            const gutterY = calculateGutter(globalBorderWidth, gapValueGlobal);
            //Used MiniMasonry for achieve masnory layout
            masonryLayout = new MiniMasonry({
                container: '.masonry',
                baseWidth: baseWidth,
                surroundingGutter: false,
                minify: false,
                gutterX: gapValueGlobal,
                gutterY: gutterY
            });

            setTimeout(() => {
                masonryLayout.layout();
            }, 300);

        } else {
            // update global variable to false
            isMasonryStyle = false;
        }

    }
    else {
        document.getElementById('lwip-modal-preview-grid').innerHTML = '';
        document.getElementById('lwip-modal-preview-slider').innerHTML = '';

        document.querySelectorAll('.svg-slider').forEach(function (element) {
            element.style.fill = '#27c4cf';
        });
        document.querySelectorAll('.span-slider').forEach(function (element) {
            element.style.fill = '#27c4cf';
        });

        document.getElementById('lwip-modal-preview-grid').style.display = 'none';
        document.getElementById('lwip-load-more-post-container').style.display = 'none';
        const postWrapper = document.getElementById('lwip-modal-preview-slider');

        if (!userData || userData.length === 0) {
            postWrapper.innerHTML = '';
            return;
        }

        if (!appendPosts) {
            postWrapper.innerHTML = '';
        }

        const section = document.createElement('div');
        section.classList.add('section');

        // Create and append the previous and next buttons
        const list = document.createElement('div');
        list.classList.add('list');
        section.appendChild(list);

        userData.forEach(media => {

            const post = document.createElement('div');
            post.classList.add('lwip-cards', 'item');
            list.appendChild(post);

            const profileHeader = document.createElement('div');
            profileHeader.classList.add('lwip-cards-header');
            const date = new Date(media.timestamp);
            const options = { month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);

            const profilePicHtml = postProfilePicture ?
                `<div class="profile-pic" ><img src="${postProfilePicture}" alt="Profile Picture"></div>` : '';

            profileHeader.innerHTML = `
               
                <div class="actions lwip-card-content-header">
                    <div class="header-info">
                     ${profilePicHtml}
                       <div class="lwip-card-content-user-detail"> <h2 id="card-username" class="lwip-header-card-username" >${media.username}</h2>
                            <span id="card-date" class="lwip-header-card-date">${formattedDate}</span></div>
                    </div>
                    <div class="instalogo lwip-card-instagram-link" id="card-instagram-link">  
                        <a href="${media.permalink}" target="_blank">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="instagram" width="1.5em" height="1.5em" fill="currentColor" aria-hidden="true" style="color:black"><path d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9zm0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zm213.5-394.6c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9a47.84 47.84 0 00-47.9-47.9zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zm-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z"></path>
                            </svg>
                        </a>
                    </div>
                </div>`;
            post.appendChild(profileHeader);

            if (media.mediaUrl) {
                const mediaContainer = document.createElement('div');
                mediaContainer.classList.add('lwip-cards-image');
                if (media.mediaType === 'VIDEO') {
                    mediaContainer.innerHTML = `
                <div class="video-container lwip-video-container-icon">
                    <div class="lwip-video-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M23.467,5.762c-0.118-0.045-0.232-0.068-0.342-0.068c-0.246,0-0.451,0.087-0.615,0.26l-3.76,3.217v5.766l3.76,3.578c0.164,0.173,0.369,0.26,0.615,0.26c0.109,0,0.223-0.023,0.342-0.068C23.822,18.552,24,18.284,24,17.901V6.57C24,6.186,23.822,5.917,23.467,5.762z"></path><path d="M16.33,4.412c-0.77-0.769-1.696-1.154-2.78-1.154H3.934c-1.084,0-2.01,0.385-2.78,1.154C0.385,5.182,0,6.108,0,7.192v9.616c0,1.084,0.385,2.01,1.154,2.78c0.77,0.77,1.696,1.154,2.78,1.154h9.616c1.084,0,2.01-0.385,2.78-1.154c0.77-0.77,1.154-1.696,1.154-2.78v-3.076v-3.478V7.192C17.484,6.108,17.099,5.182,16.33,4.412z M8.742,17.229c-2.888,0-5.229-2.341-5.229-5.229c0-2.888,2.341-5.229,5.229-5.229S13.971,9.112,13.971,12C13.971,14.888,11.63,17.229,8.742,17.229z"></path><circle cx="8.742" cy="12" r="3.5"></circle>
                        </svg>
                    </div>
                 ${popupDisplay === 'POPUP' ? `
                <div class="image-popup-trigger" data-url="${media.mediaUrl}" onclick="openPopupModal()">
                    <video controls>
                        <source src="${media.mediaUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>` : popupDisplay === 'NONE' ? `
                <video controls>
                    <source src="${media.mediaUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>` : `
                <a href="${media.permalink}" target="_blank">
                    <video controls>
                        <source src="${media.mediaUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </a>`}

                 <div class="lwip-display-hover-overlay video-hover" id="video-hover-display-div" onclick="checkAndOpenPopupModal('${media.permalink}')">
                    <div class="lwip-display-hover-text">
                        <div class="lwip-caption-action">
                            ${media.likeCount !== undefined ? `
                                <div class="lwip-card-likes">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color">
                                            <path d="M17.7,1.5c-2,0-3.3,0.5-4.9,2.1c0,0-0.4,0.4-0.7,0.7c-0.3-0.3-0.7-0.7-0.7-0.7c-1.6-1.6-3-2.1-5-2.1C2.6,1.5,0,4.6,0,8.3c0,4.2,3.4,7.1,8.6,11.5c0.9,0.8,1.9,1.6,2.9,2.5c0.1,0.1,0.3,0.2,0.5,0.2s0.3-0.1,0.5-0.2c1.1-1,2.1-1.8,3.1-2.7c4.8-4.1,8.5-7.1,8.5-11.4C24,4.6,21.4,1.5,17.7,1.5z M14.6,18.6c-0.8,0.7-1.7,1.5-2.6,2.3c-0.9-0.7-1.7-1.4-2.5-2.1c-5-4.2-8.1-6.9-8.1-10.5c0-3.1,2.1-5.5,4.9-5.5c1.5,0,2.6,0.3,3.8,1.5c1,1,1.2,1.2,1.2,1.2C11.6,5.9,11.7,6,12,6.1c0.3,0,0.5-0.2,0.7-0.4c0,0,0.2-0.2,1.2-1.3c1.3-1.3,2.1-1.5,3.8-1.5c2.8,0,4.9,2.4,4.9,5.5C22.6,11.9,19.4,14.6,14.6,18.6z"></path>
                                        </svg>
                                    </div>
                                    <p class="lwip-card-custom-color">${formatNumber(media.likeCount)}</p>
                                </div>
                                ` : ''}
                            ${media.commentsCount !== undefined ? `
                            <div class="comments">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color">
                                            <title>3.9K</title>
                                            <path d="M1,11.9C1,17.9,5.8,23,12,23c1.9,0,3.7-1,5.3-1.8l5,1.3l0,0c0.1,0,0.1,0,0.2,0c0.4,0,0.6-0.3,0.6-0.6c0-0.1,0-0.1,0-0.2 l-1.3-4.9c0.9-1.6,1.4-2.9,1.4-4.8C23,5.8,18,1,12,1C5.9,1,1,5.9,1,11.9z M2.4,11.9c0-5.2,4.3-9.5,9.5-9.5c5.3,0,9.6,4.2,9.6,9.5 c0,1.7-0.5,3-1.3,4.4l0,0c-0.1,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.1,0,0.1l0,0l1.1,4.1l-4.1-1.1l0,0c-0.1,0-0.1,0-0.2,0 c-0.1,0-0.2,0-0.3,0.1l0,0c-1.4,0.8-3.1,1.8-4.8,1.8C6.7,21.6,2.4,17.2,2.4,11.9z"></path>
                                        </svg>
                                    </div>
                                    <p class="lwip-card-custom-color">${formatNumber(media.commentsCount)}</p>
                                </div>
                            ` : ''}
                        </div>
                        <div class="lwip-card-caption">
                            <span class="lwip-content-display-card">${media.caption !== null ? media.caption : ''}</span>
                        </div>
                    </div>
                </div>
                </div>
                `;
                } else {
                    mediaContainer.innerHTML = `
                <div class="image-container">
                ${popupDisplay === 'POPUP' ? `
                <div class="image-popup-trigger" data-url="${media.mediaUrl}" onclick="openPopupModal()">
                    <img src="${media.mediaUrl}" alt="Thumbnail">
                </div>` : popupDisplay === 'NONE' ? `
                <img src="${media.mediaUrl}" alt="Thumbnail">` : `
                <a href="${media.permalink}" target="_blank">
                    <img src="${media.mediaUrl}" alt="Thumbnail">
                </a>`}
            
                ${media.children ? `
                    <div class="lwip-image-overlay-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" aria-label="Carousel" class="x1lliihq x1n2onr6" role="img" viewBox="0 0 48 48">
                            <title>Carousel</title>
                            <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>
                        </svg>
                    </div>` : ''}

                <div class="lwip-display-hover-overlay image-hover" id="image-hover-display-div" onclick="checkAndOpenPopupModal('${media.permalink}')">
                    <div class="lwip-display-hover-text">
                        <div class="lwip-caption-action">
                            ${media.likeCount !== undefined ? `
                                <div class="lwip-card-likes">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color">
                                            <path d="M17.7,1.5c-2,0-3.3,0.5-4.9,2.1c0,0-0.4,0.4-0.7,0.7c-0.3-0.3-0.7-0.7-0.7-0.7c-1.6-1.6-3-2.1-5-2.1C2.6,1.5,0,4.6,0,8.3c0,4.2,3.4,7.1,8.6,11.5c0.9,0.8,1.9,1.6,2.9,2.5c0.1,0.1,0.3,0.2,0.5,0.2s0.3-0.1,0.5-0.2c1.1-1,2.1-1.8,3.1-2.7c4.8-4.1,8.5-7.1,8.5-11.4C24,4.6,21.4,1.5,17.7,1.5z M14.6,18.6c-0.8,0.7-1.7,1.5-2.6,2.3c-0.9-0.7-1.7-1.4-2.5-2.1c-5-4.2-8.1-6.9-8.1-10.5c0-3.1,2.1-5.5,4.9-5.5c1.5,0,2.6,0.3,3.8,1.5c1,1,1.2,1.2,1.2,1.2C11.6,5.9,11.7,6,12,6.1c0.3,0,0.5-0.2,0.7-0.4c0,0,0.2-0.2,1.2-1.3c1.3-1.3,2.1-1.5,3.8-1.5c2.8,0,4.9,2.4,4.9,5.5C22.6,11.9,19.4,14.6,14.6,18.6z"></path>
                                        </svg>
                                    </div>
                                    <p class="lwip-card-custom-color">${formatNumber(media.likeCount)}</p>
                                </div>
                                ` : ''}
                            ${media.commentsCount !== undefined ? `
                            <div class="comments">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color">
                                        <title>3.9K</title>
                                        <path d="M1,11.9C1,17.9,5.8,23,12,23c1.9,0,3.7-1,5.3-1.8l5,1.3l0,0c0.1,0,0.1,0,0.2,0c0.4,0,0.6-0.3,0.6-0.6c0-0.1,0-0.1,0-0.2 l-1.3-4.9c0.9-1.6,1.4-2.9,1.4-4.8C23,5.8,18,1,12,1C5.9,1,1,5.9,1,11.9z M2.4,11.9c0-5.2,4.3-9.5,9.5-9.5c5.3,0,9.6,4.2,9.6,9.5 c0,1.7-0.5,3-1.3,4.4l0,0c-0.1,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.1,0,0.1l0,0l1.1,4.1l-4.1-1.1l0,0c-0.1,0-0.1,0-0.2,0 c-0.1,0-0.2,0-0.3,0.1l0,0c-1.4,0.8-3.1,1.8-4.8,1.8C6.7,21.6,2.4,17.2,2.4,11.9z"></path>
                                    </svg>
                                </div>
                                <p class="lwip-card-custom-color">${formatNumber(media.commentsCount)}</p>
                            </div>
                            ` : ''}
                        </div>
                        <div class="lwip-card-caption">
                            <span class="lwip-content-display-card">${media.caption !== null ? media.caption : ''}</span>
                        </div>
                    </div>
                </div>
                </div>
                `;
                }

                post.appendChild(mediaContainer);

                const postFooter = document.createElement('div');
                postFooter.classList.add('lwip-cards-footer');
                postFooter.innerHTML = `
                <div class="actions">
                    <div class="lwip-caption-action">
                      ${media.likeCount !== undefined ? `
                        <div id="card-likes" class="lwip-card-likes lwip-card-like-footer">
                            <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color"><path d="M17.7,1.5c-2,0-3.3,0.5-4.9,2.1c0,0-0.4,0.4-0.7,0.7c-0.3-0.3-0.7-0.7-0.7-0.7c-1.6-1.6-3-2.1-5-2.1C2.6,1.5,0,4.6,0,8.3c0,4.2,3.4,7.1,8.6,11.5c0.9,0.8,1.9,1.6,2.9,2.5c0.1,0.1,0.3,0.2,0.5,0.2s0.3-0.1,0.5-0.2c1.1-1,2.1-1.8,3.1-2.7c4.8-4.1,8.5-7.1,8.5-11.4C24,4.6,21.4,1.5,17.7,1.5z M14.6,18.6c-0.8,0.7-1.7,1.5-2.6,2.3c-0.9-0.7-1.7-1.4-2.5-2.1c-5-4.2-8.1-6.9-8.1-10.5c0-3.1,2.1-5.5,4.9-5.5c1.5,0,2.6,0.3,3.8,1.5c1,1,1.2,1.2,1.2,1.2C11.6,5.9,11.7,6,12,6.1c0.3,0,0.5-0.2,0.7-0.4c0,0,0.2-0.2,1.2-1.3c1.3-1.3,2.1-1.5,3.8-1.5c2.8,0,4.9,2.4,4.9,5.5C22.6,11.9,19.4,14.6,14.6,18.6z"></path></svg></div>
                            <p class="lwip-card-custom-color">${formatNumber(media.likeCount)}</p>
                        </div>
                          ` : ''}
                             ${media.commentsCount !== undefined ? `
                        <div id="card-comments" class="comments lwip-card-comment-footer">
                            <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color"><title>3.9K</title><path d="M1,11.9C1,17.9,5.8,23,12,23c1.9,0,3.7-1,5.3-1.8l5,1.3l0,0c0.1,0,0.1,0,0.2,0c0.4,0,0.6-0.3,0.6-0.6c0-0.1,0-0.1,0-0.2         l-1.3-4.9c0.9-1.6,1.4-2.9,1.4-4.8C23,5.8,18,1,12,1C5.9,1,1,5.9,1,11.9z M2.4,11.9c0-5.2,4.3-9.5,9.5-9.5c5.3,0,9.6,4.2,9.6,9.5         c0,1.7-0.5,3-1.3,4.4l0,0c-0.1,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.1,0,0.1l0,0l1.1,4.1l-4.1-1.1l0,0c-0.1,0-0.1,0-0.2,0         c-0.1,0-0.2,0-0.3,0.1l0,0c-1.4,0.8-3.1,1.8-4.8,1.8C6.7,21.6,2.4,17.2,2.4,11.9z"></path></svg></div>
                            <p class="lwip-card-custom-color">${formatNumber(media.commentsCount)}</p>
                        </div>
                          ` : ''}
                    </div>
                        <div class="lwip-caption-action" id="lwip-card-footer-share-container">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="text-22 lwip-card-custom-color-fill">
                                <path
                                    d="M22.8,10.5l-9.8-7.9c-0.2-0.2-0.5-0.2-0.7-0.1c-0.2,0.1-0.4,0.4-0.4,0.6v3.7C6.5,7,4.5,8.9,2.6,12.4C1,15.4,1,18.9,1,21.3   c0,0.2,0,0.4,0,0.5c0,0.3,0.2,0.6,0.5,0.7c0.1,0,0.1,0,0.2,0c0.2,0,0.5-0.1,0.6-0.3c3.7-6.5,5.5-6.8,9.5-6.8V19   c0,0.3,0.2,0.5,0.4,0.6s0.5,0.1,0.7-0.1l9.8-8c0.2-0.1,0.2-0.3,0.2-0.5S22.9,10.7,22.8,10.5z M13.2,17.6v-2.9   c0-0.2-0.1-0.4-0.2-0.5c-0.1-0.1-0.3-0.2-0.5-0.2c-2.7,0-3.8,0-5.9,0.9c-1.8,0.8-2.8,2.3-4.2,4.5c0.1-2,0.3-4.4,1.4-6.4   c1.7-3.2,3.5-4.8,8.7-4.8c0.4,0,0.7-0.3,0.7-0.7V4.6l8.1,6.5L13.2,17.6z">
                                </path>
                            </svg>
                             <p class="lwip-content-display-card lwip-insta-post-card-footer-share popup-toggle-btn lwip-card-custom-color">Share</p>
                            <div class="lwip-popup-container-share">
                                <div class="lwip-popup-share lwip-hidden-share">
                                     <ul>
                                        <li class="lwip-popup-share-hover-fb">

                                            <svg class="lwip-share-svgs lwip-card-custom-color" viewBox="64 64 896 896" focusable="false" data-icon="facebook" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-92.4 233.5h-63.9c-50.1 0-59.8 23.8-59.8 58.8v77.1h119.6l-15.6 120.7h-104V912H539.2V602.2H434.9V481.4h104.3v-89c0-103.3 63.1-159.6 155.3-159.6 44.2 0 82.1 3.3 93.2 4.8v107.9z"></path>
                                            </svg>

                                            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(media.permalink)}"
                                                    target="_blank"
                                                    onclick="window.open(this.href, 'facebookShare', 'width=600,height=400'); return false;">
                                                    <span class="lwip-insta-post-card-footer-facebook-share lwip-card-custom-color">Share on Facebook</span>
                                            </a>

                                        </li>
                                                    
                                        <li class="lwip-popup-share-hover-tw">

                                            <svg class="lwip-share-svgs lwip-card-custom-color"  viewBox="64 64 896 896" focusable="false" data-icon="twitter" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4a170.1 170.1 0 0075-94 336.64 336.64 0 01-108.2 41.2A170.1 170.1 0 00672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5a169.32 169.32 0 00-23.2 86.1c0 59.2 30.1 111.4 76 142.1a172 172 0 01-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4a180.6 180.6 0 01-44.9 5.8c-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z"></path>
                                            </svg>

                                            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(media.caption)}&url=${encodeURIComponent(media.permalink)}" "target="
                                                    _blank"
                                                    onclick="window.open(this.href, 'facebookShare', 'width=600,height=400'); return false;">
                                                    <i class="fas fa-sign-out-alt"></i>
                                                    <span class="lwip-insta-post-card-footer-twitter-share lwip-card-custom-color">Share on Twitter</span>
                                            </a>

                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                </div>
                <div class="lwip-card-caption lwip-card-caption-footer" id="card-caption"><span class="lwip-content-display-card">${media.caption !== null ? media.caption : ''}</span></div>
            `;
                post.appendChild(postFooter);
            }

            postWrapper.appendChild(section);

            const footer = post.querySelector('.lwip-cards-footer');
            const header = post.querySelector('.lwip-cards-header');

            const hoverButton = document.getElementById("lwip-post-style-hover-btn");
            const simpleButton = document.getElementById("lwip-post-style-simple-btn");

            // Function to toggle hover effect on/off
            function toggleHoverEffect(enable) {
                if (isLifetimeDeal === true) {
                    const hoverOverlays = document.querySelectorAll(".lwip-display-hover-overlay");

                    // Toggle the visibility based on the 'enable' parameter for each card
                    hoverOverlays.forEach(function (overlay) {
                        overlay.style.display = enable ? "block" : "none";
                    });

                    // Toggle the visibility of footer and header
                    footer.style.display = enable ? "none" : "block";
                    header.style.display = enable ? "none" : "block";
                }
            }

            // Add event listener for the Hover button
            hoverButton.addEventListener("click", function () {
                if (isLifetimeDeal === true) {
                    toggleHoverEffect(true);
                }
            });

            // Add event listener for the Simple button
            simpleButton.addEventListener("click", function () {
                toggleHoverEffect(false);
            });

            if (hoverOrSimpleStyle === 'SIMPLE') {
                toggleHoverEffect(false);
            } else {
                toggleHoverEffect(true);
            }

            hoverButton.addEventListener("click", function () {
                if (isLifetimeDeal === true) {
                    footer.style.display = "none";
                    header.style.display = "none";
                }
            });

            simpleButton.addEventListener("click", function () {
                footer.style.display = "block";
                header.style.display = "block";
            });

            var profilePicInsta = post.querySelector('.profile-pic');
            var cardUsername = post.querySelector('.lwip-header-card-username');
            var IuserCheckbox = document.getElementById('lwip-insta-post-user');

            var cardDate = post.querySelector('.lwip-header-card-date');
            var IdateCheckbox = document.getElementById('lwip-insta-post-date');

            var cardInstagramLink = post.querySelector('.lwip-card-instagram-link');
            var IlinkCheckbox = document.getElementById('lwip-insta-post-link');

            var cardShare = post.querySelector('#lwip-card-footer-share-container');
            var IshareCheckbox = document.getElementById('lwip-insta-post-share');

            var cardLikes = post.querySelector('.lwip-card-likes');
            var cardLikesFooter = post.querySelector('.lwip-card-like-footer');
            var IlikeCheckbox = document.getElementById('lwip-insta-post-likes');

            var cardComments = post.querySelector('.comments');
            var cardCommentsFooter = post.querySelector('.lwip-card-comment-footer');
            var IcommentsCheckbox = document.getElementById('lwip-insta-post-comments');

            var cardCaption = post.querySelector('.lwip-card-caption');
            var cardcaptionFooter = post.querySelector('.lwip-card-caption-footer');
            var ItextCheckbox = document.getElementById('lwip-insta-post-texts');


            function setupCheckboxEventListenersPremium(checkbox, cardElement) {

                if (checkbox && cardElement) {
                    if (isLifetimeDeal === true) {
                        checkbox.addEventListener('change', function () {
                            if (this.checked) {
                                cardElement.style.display = 'flex';
                            } else {
                                cardElement.style.display = 'none';
                            }
                        });
                    }

                    // Set the initial visibility based on the checkbox state
                    if (checkbox.checked) {
                        cardElement.style.display = 'flex';
                    } else {
                        cardElement.style.display = 'none';
                    }
                }
            }

            function setupCheckboxEventListeners(checkbox, cardElement) {

                if (checkbox && cardElement) {

                    checkbox.addEventListener('change', function () {
                        if (this.checked) {
                            cardElement.style.display = 'flex';
                        } else {
                            cardElement.style.display = 'none';
                        }
                    });

                    // Set the initial visibility based on the checkbox state
                    if (checkbox.checked) {
                        cardElement.style.display = 'flex';
                    } else {
                        cardElement.style.display = 'none';
                    }
                }
            }

            function setupCheckboxEventListenersUsername(checkbox, cardElement) {

                if (checkbox && cardElement) {
                    if (isLifetimeDeal === true) {
                        checkbox.addEventListener('change', function () {
                            if (this.checked) {
                                cardElement.style.display = 'block';
                            } else {
                                cardElement.style.display = 'none';
                            }
                        });
                    }

                    // Set the initial visibility based on the checkbox state
                    if (checkbox.checked) {
                        cardElement.style.display = 'block';
                    } else {
                        cardElement.style.display = 'none';
                    }
                }
            }

            // Call the function for each checkbox and card pair
            setupCheckboxEventListenersUsername(IuserCheckbox, cardUsername);

            setupCheckboxEventListeners(IuserCheckbox, profilePicInsta);
            setupCheckboxEventListeners(IdateCheckbox, cardDate);
            setupCheckboxEventListeners(IlinkCheckbox, cardInstagramLink);

            setupCheckboxEventListenersPremium(IshareCheckbox, cardShare);
            setupCheckboxEventListenersPremium(IlikeCheckbox, cardLikes);
            setupCheckboxEventListenersPremium(IcommentsCheckbox, cardComments);

            setupCheckboxEventListeners(ItextCheckbox, cardCaption);
            setupCheckboxEventListeners(ItextCheckbox, cardcaptionFooter);

            setupCheckboxEventListenersPremium(IcommentsCheckbox, cardCommentsFooter);
            setupCheckboxEventListenersPremium(IlikeCheckbox, cardLikesFooter);

            if (gapValueGlobal) {
                document.querySelectorAll('.lwip-post-wrapper-slider .lwip-cards').forEach(function (element) {
                    element.style.setProperty('padding', gapValueGlobal + 'px', 'important');
                });
            }

            if (widthValueGlobal) {
                document.querySelectorAll('.lwip-post-wrapper-slider .section').forEach(function (element) {
                    element.style.setProperty('width', widthValueGlobal, 'important');
                });
            }
        });

        initializeSlick();
        if (globalCustomStyleSelection) {
            updateCustomStyleSection(globalCustomStyleSelection);
        }

    }
}

//Function to check popup action on click for hover
function checkAndOpenPopupModal(mediaPermaLink) {
    if (popupDisplay === 'POPUP') {
        openPopupModal();
    } else if (popupDisplay === 'NONE') {
        //do nothing 
    } else {
        window.open(mediaPermaLink, '_blank');
    }
}

// This function will handle slider posts
function initializeSlick() {
    jQuery(document).ready(function ($) {
        $('.list').slick({
            infinite: true,
            slidesToShow: parseInt($('#lwip-manuall-column-counter').val()),
            slidesToScroll: parseInt($('#lwip-manuall-column-counter').val()),
            rows: parseInt($('#lwip-manuall-row-counter').val()),
            speed: 2000,
            draggable: $('#lwip-slider-drag-controll').prop('checked'),
            autoplay: parseInt($('#lwip-slider-auto-play-counter').val()) > 0,
            autoplaySpeed: 3000
        });
    });

    // Function to update slider options
    function updateSliderOptions() {

        if (setView === 'DesktopView') {
            jQuery(document).ready(function ($) {
                var slidesToShowValue = parseInt($('#lwip-manuall-column-counter').val());
                var rowsValue = parseInt($('#lwip-manuall-row-counter').val());
                var draggableValue = $('#lwip-slider-drag-controll').prop('checked');
                var animation = parseInt($('#lwip-slider-animation-counter').val());
                var animationValue = animation > 0 ? animation * 1000 : 2000;

                var autoplayValue = parseInt($('#lwip-slider-auto-play-counter').val());
                var autoplaySpeedValue = autoplayValue * 1000;

                $('.list').slick('unslick');
                $('.list').slick({
                    infinite: true,
                    slidesToShow: slidesToShowValue,
                    slidesToScroll: slidesToShowValue,
                    rows: rowsValue,
                    speed: animationValue,
                    draggable: draggableValue,
                    autoplay: autoplayValue > 0,
                    autoplaySpeed: autoplaySpeedValue
                });
            });
        } else {
            jQuery(document).ready(function ($) {
                var slidesToShowValue = parseInt($('#lwip-manuall-column-counter').val());
                var rowsValue = parseInt($('#lwip-manuall-row-counter').val());
                var multiplyRowandcolumn = slidesToShowValue * rowsValue;
                var draggableValue = $('#lwip-slider-drag-controll').prop('checked');
                var animation = parseInt($('#lwip-slider-animation-counter').val());
                var animationValue = animation > 0 ? animation * 1000 : 2000;

                var autoplayValue = parseInt($('#lwip-slider-auto-play-counter').val());
                var autoplaySpeedValue = autoplayValue * 1000;

                $('.list').slick('unslick');
                $('.list').slick({
                    infinite: true,
                    rows: rowsValue,
                    speed: animationValue,
                    draggable: draggableValue,
                    autoplay: autoplayValue > 0,
                    autoplaySpeed: autoplaySpeedValue
                });
            });
        }

        if (arrowControlGlobal === false) {
            jQuery('.list').addClass('lwip-hide-slick-arrows').removeClass('lwip-show-slick-arrows');
        } else {
            jQuery('.list').addClass('lwip-show-slick-arrows').removeClass('lwip-hide-slick-arrows');
        }
        jQuery('#lwip-slider-auto-play-counter').text(autoPlayGlobal.toString());
        jQuery('#lwip-slider-animation-counter').text(animationSpeedGlobal.toString());
    }
    updateSliderOptions();

    jQuery('#lwip-slider-range-controller').val(animationSpeedGlobal);

    jQuery(document).ready(function ($) {
        // Function to set inline CSS on .slick-slide elements
        function setInlineCSSOnSlickSlides() {
            $('.slick-slide').each(function () {
                this.style.setProperty('width', '154px', 'important');
                this.style.setProperty('display', 'flex', 'important');
                this.style.setProperty('flex-direction', 'column', 'important');
                this.style.setProperty('gap', gapValueGlobal + 'px');
            });
            $('.slick-track').each(function () {
                this.style.setProperty('gap', gapValueGlobal + 'px');
            });

        }
        setInlineCSSOnSlickSlides();
    });

    jQuery(document).ready(function (jQuery) {

        jQuery("#lwip-slider-animation-counter").on('input', function () {
            updateSliderOptions();
        });

        jQuery("#lwip-manuall-row-counter").on('input', function () {
            var counterValue = parseInt(jQuery(this).val());
            if (counterValue < 1 || counterValue > 5) {
                return;
            }
            updateSliderOptions();
        });

        jQuery("#lwip-manuall-column-counter").on('input', function () {
            var counterValue = parseInt(jQuery(this).val());
            if (counterValue < 1 || counterValue > 10) {
                return;
            }
            updateSliderOptions();
        });

        jQuery("#lwip-slider-drag-controll").on('change', function () {
            updateSliderOptions();
        });

        jQuery("#lwip-slider-drag-controll").on('change', function () {
            updateSliderOptions();
        });

        jQuery("#lwip-slider-auto-play-counter").on('change', function () {
            updateSliderOptions();
        });
    });
}

// Get the element by its ID
var arrowControl = document.getElementById('lwip-slider-arrow-control-btn');

// Check if the element exists before adding an event listener
if (arrowControl) {
    arrowControl.addEventListener('change', function () {
        if (this.checked) {
            document.querySelector('.slick-prev').style.setProperty('display', 'block', 'important');
            document.querySelector('.slick-next').style.setProperty('display', 'block', 'important');
        } else {
            document.querySelector('.slick-prev').style.setProperty('display', 'none', 'important');
            document.querySelector('.slick-next').style.setProperty('display', 'none', 'important');
        }
    });
}

/**
 * Displays a message to the user, either as an error or success notification.
 *
 * This function handles the presentation of messages to the user interface,
 * depending on the type of message specified. It can display messages to
 * indicate either errors or successful operations.
 *
 */
function showMessage(message, type) {
    const notification = document.createElement('div');
    notification.className = `lwip-notification lwip-notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    notification.style.animation = 'slideDown 0.5s ease forwards';
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

/**
 * Retrieves the default layout data from the API.
 *
 * This function is responsible for fetching the default layout configuration or
 * settings from the server via an API call. 
 */
function getDefaultLayout() {
    const accessToken = getAccessToken();
    const widgetId = getWidgetId();

    if (!accessToken || !widgetId) {
        return;
    }

    const apiUrl = lwip_connect.graphqlEndpoint;
    const query = `
    query GetLayout($where: GetLayoutWhere!) {
        getLayout(where: $where) {
          type
          sliderSettings {
            arrowControl
            dragControl
            animationSpeed
            autoPlay
          }
          columnsAndRows {
            mode
            config {
              columns
              rows
              gap
              width
            }
          }
          feedTitle
          headers {
            showHeaders
            config {
                profilePicture
                fullName
                userName
                verifiedBadge
                postsCount
                followersCount
                followingCount
                followButton
            }
          }
        }
      }
    `;

    const variables = {
        where: {
            widgetId: widgetId
        }
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };
    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                showMessage(data.errors[0].message, 'error');
                return;
            } else {
                styleType = data.data.getLayout.type;

                if (styleType === 'GRID') {
                    jQuery('#lwip-side-menu-layout-slider').hide();
                }

                var getColumnValue = data.data.getLayout.columnsAndRows.config.columns;
                columnValueGlobal = getColumnValue;

                var getRowValue = data.data.getLayout.columnsAndRows.config.rows;
                rowValueGlobal = getRowValue;

                var getgapValue = data.data.getLayout.columnsAndRows.config.gap;
                gapValueGlobal = getgapValue;

                var getwidthValue = data.data.getLayout.columnsAndRows.config.width;
                widthValueGlobal = getwidthValue;

                var profilePictureValue = data.data.getLayout.headers.config.profilePicture;
                headerProfilePicture = profilePictureValue;

                var userNameValue = data.data.getLayout.headers.config.userName;
                headerUName = userNameValue;

                var verifiedBadgeValue = data.data.getLayout.headers.config.verifiedBadge;
                headerVBadge = verifiedBadgeValue;

                var postsCountValue = data.data.getLayout.headers.config.postsCount;
                headerPCount = postsCountValue;

                var fullNameValue = data.data.getLayout.headers.config.fullName;
                headerFName = fullNameValue;

                var followersCountValue = data.data.getLayout.headers.config.followersCount;
                headerFollowersCount = followersCountValue;

                var followingCountValue = data.data.getLayout.headers.config.followingCount;
                headerFollowingsCount = followingCountValue;

                var followButtonValue = data.data.getLayout.headers.config.followButton;
                headerFButton = followButtonValue;

                var arrowControl = data.data.getLayout.sliderSettings.arrowControl;
                arrowControlGlobal = arrowControl;

                var dragControl = data.data.getLayout.sliderSettings.dragControl;
                dragControlGlobal = dragControl;

                var animationSpeed = data.data.getLayout.sliderSettings.animationSpeed;
                animationSpeedGlobal = animationSpeed;

                var autoPlay = data.data.getLayout.sliderSettings.autoPlay;
                autoPlayGlobal = autoPlay;

                var Getfeedtitle = data.data.getLayout.feedTitle;
                var ColumnRowMode = data.data.getLayout.columnsAndRows.mode;

                document.getElementById("lwip-slider-arrow-control-btn").checked = arrowControl;
                document.getElementById("lwip-slider-drag-controll").checked = dragControl;
                document.getElementById("lwip-slider-animation-counter").value = animationSpeed;
                document.getElementById("lwip-slider-auto-play-counter").value = autoPlay;

                if (ColumnRowMode === 'MANUAL') {
                    document.querySelectorAll('.column-row-container-lwip').forEach(function (element) {
                        element.style.height = '370px';
                    });
                    document.getElementById('lwip-side-menu-manuall-btn').style.backgroundColor = '#27c4cf';
                    document.getElementById('lwip-side-menu-manuall-btn').style.color = 'white';
                } else {
                    document.getElementById('lwip-column-btn').style.display = 'none';
                    document.getElementById('lwip-side-menu-auto-btn').style.backgroundColor = '#27c4cf';
                    document.getElementById('lwip-side-menu-auto-btn').style.color = 'white';
                    document.querySelectorAll('.column-row-container-lwip').forEach(function (element) {
                        element.style.height = '305px';
                    });
                }

                // Function to format text with clickable links
                function formatText(text) {
                    var urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                    var hashtagPattern = /#(\w+)/g;
                    var mentionPattern = /@(\w+)/g;
                    text = text.replace(urlPattern, '<a class="lwip-card-custom-color" href="$1" target="_blank">$1</a>');
                    text = text.replace(hashtagPattern, '<a class="lwip-card-custom-color" href="https://www.instagram.com/explore/tags/$1" target="_blank">#$1</a>');
                    text = text.replace(mentionPattern, '<a class="lwip-card-custom-color" href="https://www.instagram.com/$1" target="_blank">@$1</a>');
                    return text;
                }

                // Set feed title
                document.getElementById("lwip-feed-title").value = Getfeedtitle;
                if (Getfeedtitle && Getfeedtitle.trim() !== "") {
                    var formatedFeedTitle = formatText(Getfeedtitle);
                    document.getElementById("lwip-feed-custom-header-name").innerHTML = formatedFeedTitle;
                } else {
                    document.getElementById("lwip-feed-custom-header-name").innerHTML = Getfeedtitle;
                }

                // Set header
                document.getElementById("lwip-main-header-profile-pic-checkbox").checked = profilePictureValue;
                document.getElementById("lwip-main-header-profile-pic-checkbox").checked = profilePictureValue;
                document.getElementById("lwip-main-header-user-fullname-checkbox").checked = fullNameValue;
                document.getElementById("lwip-main-header-username-checkbox").checked = userNameValue;
                document.getElementById("lwip-main-header-verify-badge-checkbox").checked = verifiedBadgeValue;
                document.getElementById("lwip-main-header-post-count-checkbox").checked = postsCountValue;
                document.getElementById("lwip-main-header-followers-count-checkbox").checked = followersCountValue;
                document.getElementById("lwip-main-header-following-count-checkbox").checked = followingCountValue;
                document.getElementById("lwip-main-header-follow-btn-checkbox").checked = followButtonValue;

                //column and rows
                document.getElementById("lwip-manuall-column-counter").value = getColumnValue;
                document.getElementById("lwip-manuall-row-counter").value = getRowValue;
                document.getElementById("lwip-manuall-gap-counter").value = getgapValue;
                document.getElementById("lwip-width-counter").value = getwidthValue;

                let currentDisplayedCards = 0; // Initialize this variable outside of the function

                function updatePostDisplay() {

                    const columnValue = parseInt(document.getElementById('lwip-manuall-column-counter').value, 10);
                    const rowValue = parseInt(document.getElementById('lwip-manuall-row-counter').value, 10);
                    const postWrapper = document.querySelector('.lwip-post-wrapper');
                    postWrapper.style.gridTemplateColumns = `repeat(${columnValue}, 1fr)`;
                    postWrapper.style.gridAutoRows = `max-content`;

                    const maxCards = columnValue * rowValue;
                    const cards = document.querySelectorAll('.lwip-post-wrapper .lwip-cards');
                    const loadMoreButton = document.getElementById('lwip-load-more-btn');

                    Array.from(cards).forEach((card, index) => {
                        if (index < maxCards) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    currentDisplayedCards = maxCards;

                    if (cards.length > maxCards) {
                        loadMoreButton.style.display = 'block';
                    } else {
                        loadMoreButton.style.display = 'none';
                    }
                }

                document.getElementById('lwip-manuall-column-counter').addEventListener('input', function () {

                    if (isMasonryStyle === 'undefined' || isMasonryStyle === false) {
                        validateAndCallFunctionColumn(this);
                    } else if (isMasonryStyle === true) {

                        if (selectedAccountType === "PERSONAL") {
                            personalAccountData(sourceIdGlobal);
                        } else if (selectedAccountType === "BUSINESS") {
                            businessAccountData(sourceIdGlobal);
                        } else {
                            defaultMediaData();
                        }
                    }

                });

                document.getElementById('lwip-manuall-row-counter').addEventListener('input', function () {
                    validateAndCallFunctionRow(this);
                });

                // Function to validate and call another function based on the value
                function validateAndCallFunctionColumn(element) {
                    var counterValue = parseInt(jQuery(element).val());

                    if (counterValue < 1 || counterValue > 10) {
                        return;
                    }

                    updatePostDisplay();
                }

                function validateAndCallFunctionRow(element) {
                    var counterValue = parseInt(jQuery(element).val());

                    if (counterValue < 1 || counterValue > 5) {
                        return;
                    }

                    updatePostDisplay();
                }

                document.getElementById('lwip-load-more-btn').addEventListener('click', function () {
                    const columnValue = parseInt(document.getElementById('lwip-manuall-column-counter').value, 10);
                    const rowValue = parseInt(document.getElementById('lwip-manuall-row-counter').value, 10);
                    const maxCards = columnValue * rowValue;

                    const cards = document.querySelectorAll('.lwip-post-wrapper .lwip-cards');
                    for (let i = currentDisplayedCards; i < currentDisplayedCards + maxCards && i < cards.length; i++) {
                        cards[i].style.display = 'block';
                    }

                    currentDisplayedCards += maxCards;

                    if (currentDisplayedCards >= cards.length) {
                        this.style.display = 'none';
                    }
                    if (isMasonryStyle === true) {
                        masonryLayout.layout();
                    }

                });

                updatePostDisplay();

            }
        })
        .catch(error => {
            showMessage('An error occurred while fetching data.', 'error');
        });

}
getDefaultLayout();

//Business Profile Data Retrieves the profile data for a business account.
function businessAccountProfileData(sourceId) {
    const accessToken = getAccessToken();
    if (!accessToken) {
        return;
    }

    const apiUrl = lwip_connect.graphqlEndpoint;
    const query = `
        query BusinessProfileData($sourceId: ID!) {
            businessProfileData(sourceId: $sourceId) {
                name
                iGAccount {
                    id
                    name
                    mediaCount
                    username
                    followersCount
                    followsCount
                    website
                    profilePictureUrl
                    biography
                }
            }
        }
    `;

    const variables = {
        sourceId: sourceId
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                const errorMessage = data.errors[0].message;
                showMessage(errorMessage, 'warning');
            } else {
                const profileData = data.data.businessProfileData;
                showMessage(`Business Name: ${profileData.name}`, 'success');

                const followersCount = profileData.iGAccount.followersCount;
                const followingsCount = profileData.iGAccount.followsCount;
                const mediaCount = profileData.iGAccount.mediaCount;
                const profilePictureUrl = profileData.iGAccount.profilePictureUrl;
                const instaUsername = profileData.iGAccount.username;
                const instaUserFullName = profileData.name;
                postProfilePicture = profilePictureUrl;

                if (instaUsername === null) {
                    jQuery("#connected-business-account-name").hide();
                } else {
                    document.getElementById("connected-business-account-name").textContent = '@' + instaUsername;
                }

                if (followingsCount === null) {
                    jQuery("#lwip-main-header-insta-user-following-count").hide();
                } else {
                    document.getElementById("lwip-main-header-insta-user-following-count").textContent = formatNumber(followingsCount);
                }

                if (instaUserFullName === null) {
                    jQuery("#lwip-main-header-insta-user-fullname").hide();
                } else {
                    document.getElementById("lwip-main-header-insta-user-fullname").textContent = instaUserFullName;
                }

                if (profilePictureUrl === null) {
                    jQuery("#lwip-main-header-insta-logo").hide();
                } else {
                    jQuery("#lwip-main-header-insta-logo").show();
                    document.getElementById("lwip-main-header-insta-logo").src = profilePictureUrl;
                }

                if (instaUsername === null) {
                    jQuery("#lwip-insta-username-header").hide();
                } else {
                    document.getElementById("lwip-insta-username-header").textContent = '@' + instaUsername;
                }

                if (mediaCount === null) {
                    jQuery("#lwip-main-header-insta-user-post-count").hide();
                } else {
                    document.getElementById("lwip-main-header-insta-user-post-count").textContent = formatNumber(mediaCount);
                }

                if (followersCount === null) {
                    jQuery("#lwip-main-header-insta-user-followers-count").hide();
                } else {
                    document.getElementById("lwip-main-header-insta-user-followers-count").textContent = formatNumber(followersCount);
                }

                const followBtnLink = document.getElementById("lwip-main-header-insta-user-follow-btn-url");
                followBtnLink.href = `https://www.instagram.com/${instaUsername}`;

                jQuery("#lwip-main-header-insta-user-fullname-container").show();
                jQuery("#lwip-main-header-insta-posts-container").show();
                jQuery("#lwip-main-header-insta-follow-container").show();
                jQuery("#lwip-main-header-insta-following-container").show();

                if (headerFName !== true) {
                    jQuery("#lwip-main-header-insta-user-fullname").hide();
                }

                if (headerProfilePicture !== true) {
                    jQuery("#lwip-main-header-insta-logo").hide();
                }

                if (headerUName !== true) {
                    jQuery("#lwip-insta-username-header").hide();
                }

                if (headerPCount !== true) {
                    jQuery("#lwip-main-header-insta-posts-container").hide();
                }

                if (headerFollowingsCount !== true) {
                    jQuery("#lwip-main-header-insta-following-container").hide();
                }

                if (headerFollowersCount !== true) {
                    jQuery("#lwip-main-header-insta-follow-container").hide();
                }

                if (headerFButton !== true) {
                    jQuery("#lwip-main-header-insta-user-follow-btn-url").hide();
                }

            }
        })
        .catch(error => {
            showMessage('An error occurred while fetching data.', 'error');
        });
}

//Business Media Data Retrieves data related to business accounts.
function businessAccountData(sourceId) {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return;
    }

    const limit = globalColumnValue * globalRowValue;
    selectedAccountType = "BUSINESS";
    sourceIdGlobal = sourceId;

    const apiUrl = lwip_connect.graphqlEndpoint;
    const query = `
        query Data($sourceId: ID!, $pagination: PaginationInput) {
            businessMediaData(sourceId: $sourceId, pagination: $pagination) {
                data {
                    id
                    username
                    thumbnailUrl
                    mediaType
                    mediaUrl
                    permalink
                    commentsCount
                    likeCount
                    caption
                    timestamp
                    children {
                        id
                        thumbnailUrl
                        mediaType
                        mediaUrl
                        permalink
                    }
                }
                count
            }
        }
    `;

    const variables = {
        sourceId: sourceId,
        pagination: {
            offset: null,
            limit: limit
        }
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                const errorMessage = data.errors[0].message;
                showMessage(errorMessage, 'warning');
            } else {
                const mediaData = data.data.businessMediaData.data;
                renderMediaPosts(mediaData, true);
            }
        })
        .catch(error => {
            showMessage('An error occurred while fetching data.', 'error');
        });
}

//Personal Profile Data Retrieves the profile data for a personal account.
function personalAccountData(sourceId) {
    const accessToken = getAccessToken();
    if (!accessToken) {
        return;
    }

    const limit = globalColumnValue * globalRowValue;
    selectedAccountType = "PERSONAL";
    sourceIdGlobal = sourceId;

    const apiUrl = lwip_connect.graphqlEndpoint;
    const query = `
        query GetPersonalMediaData($sourceId: ID!, $pagination: PaginationInput) {
            getPersonalMediaData(sourceId: $sourceId, pagination: $pagination) {
                count
                data {
                    id
                    username
                    thumbnailUrl
                    mediaType
                    mediaUrl
                    permalink
                    caption
                    timestamp
                    children {
                        id
                        thumbnailUrl
                        mediaType
                        mediaUrl
                        permalink
                    }
                }
            }
        }
    `;

    const variables = {
        sourceId: sourceId,
        pagination: {
            limit: limit,
            offset: null
        }
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                const errorMessage = data.errors[0].message;
                showMessage(errorMessage, 'warning');
            } else {
                const mediaData = data.data.getPersonalMediaData.data;
                renderMediaPosts(mediaData, true);
            }
        })
        .catch(error => {
            showMessage('An error occurred while fetching data.', 'error');
        });
}

//Personal Media Data Retrieves data related to personal accounts.
function personalAccountProfileData(sourceId) {

    const accessToken = getAccessToken();
    if (!accessToken) {
        return;
    }

    const apiUrl = lwip_connect.graphqlEndpoint;
    const query = `
        query PersonalProfileData($sourceId: ID!) {
            personalProfileData(sourceId: $sourceId) {
                username
            }
        }
    `;

    const variables = {
        sourceId: sourceId
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {

            if (data.errors) {
                const errorMessage = data.errors[0].message;
                showMessage(errorMessage, 'warning');
            } else {
                const profileData = data.data.personalProfileData;
                showMessage(`Username: ${profileData.username}`, 'success');
                const instaUsername = profileData.username;
                postProfilePicture = null;

                const followBtnLink = document.getElementById("lwip-main-header-insta-user-follow-btn-url");
                followBtnLink.href = `https://www.instagram.com/${instaUsername}`;

                document.getElementById("lwip-insta-username-header").textContent = '@' + instaUsername;
                document.getElementById("connected-personal-account-name").textContent = '@' + instaUsername;

                jQuery("#lwip-main-header-insta-logo").hide();
                jQuery("#lwip-main-header-insta-user-fullname-container").hide();
                jQuery("#lwip-main-header-insta-posts-container").hide();
                jQuery("#lwip-main-header-insta-follow-container").hide();
                jQuery("#lwip-main-header-insta-following-container").hide();
            }
        })
        .catch(error => {
            showMessage('An error occurred while fetching data.', 'error');
        });
}

//Defualt Media Data Retrieves default media data.
function defaultMediaData() {

    const widgetId = getWidgetId()
    const accessToken = getAccessToken();

    if (!accessToken || !widgetId) {
        return;
    }

    const limit = globalColumnValue * globalRowValue;

    const apiUrl = lwip_connect.graphqlEndpoint;
    const query = `
    query DefaultMediaData($widgetId: ID!, $pagination: PaginationInput) {
        defaultMediaData(widgetId: $widgetId, pagination: $pagination) {
            data {
                caption
                id
                mediaType
                mediaUrl
                thumbnailUrl
                permalink
                timestamp
                username
                children {
                    id
                    mediaType
                    mediaUrl
                    thumbnailUrl
                    permalink
                }
                commentsCount
                likeCount
            }
            count
        }
    }
    `;

    const variables = {
        widgetId: widgetId,
        pagination: {
            offset: offset,
            limit: limit
        }
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {

            if (data.errors) {
                return;
            } else {
                const mediaData = data.data.defaultMediaData;
            }

            if (data.data.defaultMediaData && data.data.defaultMediaData.data) {
                var userData = data.data.defaultMediaData.data;
                renderMediaPosts(userData, true);
                offset += limit;
            } else {
                showMessage('No media data available.', 'error');
            }
        })
        .catch(error => {
            showMessage('An error occurred while fetching data.', 'error');
        });
}

//Defualt Media Profile Data Retrieves the profile data for default media.
function defualtMediaProfileData() {

    const accessToken = getAccessToken();
    if (!accessToken) {
        return;
    }

    const apiUrl = lwip_connect.graphqlEndpoint;
    const query = `
      query DefaultProfileData {
        defaultProfileData {
          id
          mediaCount
          username
          followersCount
          followsCount
          website
          profilePictureUrl
          name
          igId
          biography
        }
      }
      `;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: query
        })
    };

    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data) {
            } else {
                showMessage('No media data available.', 'warning');
            }

            if (data.errors) {
                const errorMessage = data.errors[0].message;
                showMessage(errorMessage, 'warning');
            } else {

                const followersCount = data.data.defaultProfileData.followersCount;
                const followingsCount = data.data.defaultProfileData.followsCount;
                const mediaCount = data.data.defaultProfileData.mediaCount;
                const profilePictureUrl = data.data.defaultProfileData.profilePictureUrl;
                const instaUsername = data.data.defaultProfileData.username;
                const instaUserFullName = data.data.defaultProfileData.name;
                postProfilePicture = profilePictureUrl;

                document.getElementById("connected-business-account-name").textContent = '@' + instaUsername;
                document.getElementById("lwip-main-header-insta-user-following-count").textContent = formatNumber(followingsCount);
                document.getElementById("lwip-main-header-insta-user-fullname").textContent = instaUserFullName;
                document.getElementById("lwip-main-header-insta-logo").src = profilePictureUrl;
                document.getElementById("lwip-insta-username-header").textContent = '@' + instaUsername;
                document.getElementById("lwip-main-header-insta-user-post-count").textContent = formatNumber(mediaCount);
                document.getElementById("lwip-main-header-insta-user-followers-count").textContent = formatNumber(followersCount);

                const followBtnLink = document.getElementById("lwip-main-header-insta-user-follow-btn-url");
                followBtnLink.href = `https://www.instagram.com/${instaUsername}`;

                jQuery("#lwip-main-header-insta-logo").show();
                jQuery("#lwip-main-header-insta-user-fullname-container").show();
                jQuery("#lwip-main-header-insta-posts-container").show();
                jQuery("#lwip-main-header-insta-follow-container").show();
                jQuery("#lwip-main-header-insta-following-container").show();

                if (headerFName !== true) {
                    jQuery("#lwip-main-header-insta-user-fullname").hide();
                }

                if (headerProfilePicture !== true) {
                    jQuery("#lwip-main-header-insta-logo").hide();
                }

                if (headerUName !== true) {
                    jQuery("#lwip-insta-username-header").hide();
                }

                if (headerPCount !== true) {
                    jQuery("#lwip-main-header-insta-posts-container").hide();
                }

                if (headerFollowingsCount !== true) {
                    jQuery("#lwip-main-header-insta-following-container").hide();
                }

                if (headerFollowersCount !== true) {
                    jQuery("#lwip-main-header-insta-follow-container").hide();
                }

                if (headerFButton !== true) {
                    jQuery("#lwip-main-header-insta-user-follow-btn-url").hide();
                }

            }
        })
        .catch(error => {
            showMessage('An error occurred while fetching data.', 'error');
        });
}

/**
 * Fetches media data based on the provided source ID and type.
 *
 * This function determines the appropriate data retrieval function to call
 * based on the given source ID and source type. It handles fetching data for
 * different account types and media profiles in a unified manner.
 *
 */
function fetchMediaData(sourceId, sourceType) {
    if (sourceType === 'PERSONAL_ACCOUNT') {
        personalAccountData(sourceId);
        personalAccountProfileData(sourceId);
    } else if (sourceType === 'BUSINESS_ACCOUNT') {
        businessAccountData(sourceId);
        businessAccountProfileData(sourceId);
    } else if (sourceType === 'DEFAULT_ACCOUNT') {
        defaultMediaData();
        defualtMediaProfileData();
    }
}

/**
 * Fetches the source ID based on the provided source type from the API.
 *
 * This function makes an API request to retrieve the source ID that corresponds
 * to the given source type. 
 * 
 */
function fetchSourceId(sourceType) {
    const accessToken = getAccessToken();
    const widgetId = getWidgetId()

    if (!accessToken || !widgetId) {
        return;
    }

    const apiUrl = lwip_connect.graphqlEndpoint;
    const query = `
        query getSource($where: GetSourceInput!) {
            getSource(where: $where) {
                igSources
                sourceId
                sourceType
                businessSources {
                    id
                    isSelected
                    username
                }
                widgetId
            }
        }
    `;

    const variables = {
        where: {
            sourceType: sourceType,
            widgetId: widgetId
        }
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                showMessage(data.errors[0].message, 'warning');
                throw new Error(data.errors[0].message);
            } else {
                const sourceId = data.data.getSource.sourceId;
                fetchMediaData(sourceId, sourceType);
            }
        })
        .catch(error => {
            showMessage('An error occurred while fetching source ID.', 'error');
        });
}

/**
 * Sends an API request to fetch media data based on the selected value.
 *
 * This function retrieves the `sourceId` for the given `selectedValue` and then
 * calls the `fetchMediaData` function using the retrieved `sourceId` to get the media data.
 */
function sendApiRequest(selectedValue) {

    const accessToken = getAccessToken();
    const widgetId = getWidgetId()

    if (!accessToken || !widgetId) {
        return;
    }

    const apiUrl = lwip_connect.graphqlEndpoint;
    const query = ` query GetSource($where: GetSourceInput!) {
                getSource(where: $where) {
                    sourceId
                    sourceType
                    igSources
                    widgetId
                    businessSources {
                    id
                    username
                    isSelected
                    }
                }
                }
            `;

    const variables = {
        where: {
            widgetId: widgetId,
            sourceType: selectedValue
        }
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.errors) {
                // return
            } else {
                const getSourceData = data.data.getSource;
                if (!getSourceData) {

                    if (selectedValue === 'PERSONAL_ACCOUNT') {
                        document.getElementById('personal-account-connect').style.display = 'block';
                    } else if (selectedValue === 'BUSINESS_ACCOUNT') {
                        document.getElementById('lwip-facebook-account-connect').style.display = 'block';
                    } else {
                        showMessage('Something went Wrong', 'error');
                    }

                    const sourceType = 'DEFAULT_ACCOUNT';
                    const sourceId = null;
                    fetchMediaData(sourceId, sourceType);

                } else if (getSourceData.sourceType === 'PERSONAL_ACCOUNT') {
                    const sourceType = getSourceData.sourceType;
                    const sourceId = getSourceData.sourceId;
                    document.getElementById('personal-account-disconnect').style.display = 'block';
                    fetchMediaData(sourceId, sourceType);
                } else if (getSourceData.sourceType === 'BUSINESS_ACCOUNT') {
                    const sourceType = getSourceData.sourceType;
                    const sourceId = getSourceData.sourceId;
                    document.getElementById('lwip-facebook-account-disconnect').style.display = 'block';
                    fetchMediaData(sourceId, sourceType);
                } else {
                    showMessage("Something Went wrong", 'error');
                }
            }
        })
        .catch(error => {
            showMessage('Fetch Error: ' + error.message, 'error');
        });
}

/**
 * Ensures that the connection is correctly established when switching between account types.
 *
 * This function handles the transition between different types of accounts, such as switching
 * from a business account (e.g., Facebook) to a private account (e.g., Instagram). It ensures
 * that the appropriate actions are taken to manage the account switch and maintain a valid
 * connection.
 *
 */
function ensureConnection() {
    const accountTypes = document.querySelectorAll('.lwip-select-account-type');

    // Event listener for radio buttons
    accountTypes.forEach(function (radio) {
        radio.addEventListener('change', function () {
            jQuery("#lwip-publish-account-btn").removeClass('lwip-disable-publish-button');

            if (radio.checked) {
                var selectedValue = radio.value;
                if (selectedValue === 'PERSONAL') {
                    selectedValue = 'PERSONAL_ACCOUNT';
                } else if (selectedValue === 'BUSINESS') {
                    selectedValue = 'BUSINESS_ACCOUNT';
                }
                sendApiRequest(selectedValue);
            }
        });
    });

}

/**
 * Opens the popup modal and sets its content.
 *
 * This function retrieves the modal element by its ID, opens the modal using the
 * `openModal` function, and then sets the content of the modal using the `setModalContent` function.
 */
function openPopupModal() {
    const modal = document.getElementById('modal');

    openModal(modal);
    setModalContent();
}

/**
 * Sets the content of the modal.
 *
 * This function populates the modal with the required content. The content could be
 * dynamic, such as fetched from an API, or static content based on application state.
 *
 */
function setModalContent() {

    window.loadTranslation(selectedLanguageGlobal);
    document.getElementById('modals-body-unique').innerHTML = '';

    const modalHeader = modal.querySelector('.lwip-modal-header-unique');
    const modalBody = modal.querySelector('.lwip-modal-body-unique');

    const callToActionData = JSON.parse(localStorage.getItem('callToActionData')) || [];

    modalBody.innerHTML += `
        <button data-close-button class="lwip-close-button-popup" onclick="closePopup()"><svg class="lwip-card-custom-color" fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zm128.01 198.83c.03 0 .05.01.09.06l45.02 45.01a.2.2 0 01.05.09.12.12 0 010 .07c0 .02-.01.04-.05.08L557.25 512l127.87 127.86a.27.27 0 01.05.06v.02a.12.12 0 010 .07c0 .03-.01.05-.05.09l-45.02 45.02a.2.2 0 01-.09.05.12.12 0 01-.07 0c-.02 0-.04-.01-.08-.05L512 557.25 384.14 685.12c-.04.04-.06.05-.08.05a.12.12 0 01-.07 0c-.03 0-.05-.01-.09-.05l-45.02-45.02a.2.2 0 01-.05-.09.12.12 0 010-.07c0-.02.01-.04.06-.08L466.75 512 338.88 384.14a.27.27 0 01-.05-.06l-.01-.02a.12.12 0 010-.07c0-.03.01-.05.05-.09l45.02-45.02a.2.2 0 01.09-.05.12.12 0 01.07 0c.02 0 .04.01.08.06L512 466.75l127.86-127.86c.04-.05.06-.06.08-.06a.12.12 0 01.07 0z"></path>
            </svg>
        </button>
    `;
    userDataGlobal.forEach(function (item) {

        const date = new Date(item.timestamp);
        const options = { month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const postId = item.id; // Ensure each post has a unique ID
        modalHeader.innerHTML += `
        `;
        let callActionHTML = '';
        // Check if permalink matches any call-to-action post URL
        const matchingCTA = callToActionData.find(cta => cta[0] === item.permalink);

        if (matchingCTA) {
            callActionHTML = `
            <a href="${matchingCTA[1]}" target="_blank">
                <div class="call-to-actions-btn">

                    <div class="lwip-cta-text-label">${matchingCTA[2]}</div>
                    <div class="call-to-action-btn-svg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="right-arrow" height="10px" width="10px" viewBox="0 0 6 10">
                            <path d="M5.71,4.286L1.727,0.302c-0.39-0.392-1.023-0.392-1.414,0c-0.39,0.39-0.39,1.023,0,1.414L3.59,4.992   L0.289,8.284c-0.39,0.39-0.39,1.025,0,1.415c0.39,0.39,1.023,0.39,1.414,0l4.008-4C6.101,5.309,6.101,4.675,5.71,4.286z"></path>
                            </svg>
                       
                    </div>
                    </div>
                    </a>
            `;
        }

        modalBody.innerHTML += `
            <div class="header-info">
                <div>
                <div class="header-actions">
                <div class="header-info">
                <h2 id="popup-username" class="popup-username">${item.username}</h2>
                <span id="popup-date" class="popup-date">${formattedDate}</span>
                </div>
                <div class="popup-follow-link" id="popupfollowbutton">
                <a href="https://www.instagram.com/${item.username}" target="_blank"><div class="popup-follow-txt">Follow</div></a> 
                </div>
               <div class="instalogo" id="popup-instagram-links">
                    <button class="lwip-popup-instagram-button" onclick="window.open('${item.permalink}', '_blank')">
                        <svg class="lwip-popup-instagram-icon lwip-card-custom-color" height="24px" width="24px" viewBox="64 64 896 896" focusable="false" data-icon="instagram" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9zm0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zm213.5-394.6c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9a47.84 47.84 0 00-47.9-47.9zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zm-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z"></path>
                        </svg>
                    </button>
                </div>
                </div></div>
            </div>
        `;
        if (item.mediaType === 'VIDEO') {
            modalBody.innerHTML += `
            <div class="video-container">
                <video controls id="modal-video" muted>
                    <source src="${item.mediaUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                ${callActionHTML}
            </div>
        `;
        } else {
            if (item.children && item.children.length > 0) {
                // Display slideshow for multiple children
                const childrenSlides = item.children.map((child, index) => {
                    if (child.mediaType === 'VIDEO') {
                        return `
                            <div class="lwip-slides" style="display: ${index === 0 ? 'block' : 'none'};">
                                <video controls muted>
                                    <source src="${child.mediaUrl}" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        `;
                    } else {
                        return `
                            <div class="lwip-slides" style="display: ${index === 0 ? 'block' : 'none'};">
                                <img src="${child.mediaUrl}" alt="Child Media">
                            </div>
                        `;
                    }
                }).join('');

                modalBody.innerHTML += `
                    <div class="image-container">
                        <div class="lwip-slide-show-container post-${postId}">
                            ${childrenSlides}
                            <a class="lwip-prev popup-children-prev" style="display: none;" onclick="plusSlides('${postId}', -1, ${item.children.length})">&#10094;</a>
                            <a class="lwip-next popup-children-next" style="display: ${item.children.length > 1 ? 'block' : 'none'};" onclick="plusSlides('${postId}', 1, ${item.children.length})">&#10095;</a>
                            ${callActionHTML}
                        </div>
                    </div>
                `;

                // Initialize slides for this post
                initSlides(postId, item.children.length);

            } else {
                // Display single image
                modalBody.innerHTML += `
                    <div class="image-container">
                        <img src="${item.mediaUrl}" alt="Single Image">
                        ${callActionHTML}
                    </div>
                `;
            }
        }

        modalBody.innerHTML += `
            <div class="actions">
                <div class="lwip-caption-action">
                        ${item.likeCount !== undefined ? `
                        <div class="lwip-card-likes popup-like" id="popup-like">
                            <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color">
                                <path d="M17.7,1.5c-2,0-3.3,0.5-4.9,2.1c0,0-0.4,0.4-0.7,0.7c-0.3-0.3-0.7-0.7-0.7-0.7c-1.6-1.6-3-2.1-5-2.1C2.6,1.5,0,4.6,0,8.3c0,4.2,3.4,7.1,8.6,11.5c0.9,0.8,1.9,1.6,2.9,2.5c0.1,0.1,0.3,0.2,0.5,0.2s0.3-0.1,0.5-0.2c1.1-1,2.1-1.8,3.1-2.7c4.8-4.1,8.5-7.1,8.5-11.4C24,4.6,21.4,1.5,17.7,1.5z M14.6,18.6c-0.8,0.7-1.7,1.5-2.6,2.3c-0.9-0.7-1.7-1.4-2.5-2.1c-5-4.2-8.1-6.9-8.1-10.5c0-3.1,2.1-5.5,4.9-5.5c1.5,0,2.6,0.3,3.8,1.5c1,1,1.2,1.2,1.2,1.2C11.6,5.9,11.7,6,12,6.1c0.3,0,0.5-0.2,0.7-0.4c0,0,0.2-0.2,1.2-1.3c1.3-1.3,2.1-1.5,3.8-1.5c2.8,0,4.9,2.4,4.9,5.5C22.6,11.9,19.4,14.6,14.6,18.6z"></path>
                            </svg>                 
                            </div>
                            <p class="lwip-card-custom-color">${formatNumber(item.likeCount)}</p>
                        </div>
                        ` : ''}
                        ${item.commentsCount !== undefined ? `
                        <div class="comments popup-comments" id="popup-comments">
                            <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" class="lwip-icon-in-footer lwip-card-custom-color">
                            <title>3.9K</title>
                            <path d="M1,11.9C1,17.9,5.8,23,12,23c1.9,0,3.7-1,5.3-1.8l5,1.3l0,0c0.1,0,0.1,0,0.2,0c0.4,0,0.6-0.3,0.6-0.6c0-0.1,0-0.1,0-0.2 l-1.3-4.9c0.9-1.6,1.4-2.9,1.4-4.8C23,5.8,18,1,12,1C5.9,1,1,5.9,1,11.9z M2.4,11.9c0-5.2,4.3-9.5,9.5-9.5c5.3,0,9.6,4.2,9.6,9.5 c0,1.7-0.5,3-1.3,4.4l0,0c-0.1,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.1,0,0.1l0,0l1.1,4.1l-4.1-1.1l0,0c-0.1,0-0.1,0-0.2,0 c-0.1,0-0.2,0-0.3,0.1l0,0c-1.4,0.8-3.1,1.8-4.8,1.8C6.7,21.6,2.4,17.2,2.4,11.9z"></path>
                        </svg>                        </div>
                            <p class="lwip-card-custom-color">${formatNumber(item.commentsCount)}</p>
                        </div>
                        ` : ''}
                </div>
            
                <div class="lwip-caption-action popup-shares" id="popup-shares">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="text-22 lwip-card-custom-color-fill"><path d="M22.8,10.5l-9.8-7.9c-0.2-0.2-0.5-0.2-0.7-0.1c-0.2,0.1-0.4,0.4-0.4,0.6v3.7C6.5,7,4.5,8.9,2.6,12.4C1,15.4,1,18.9,1,21.3   c0,0.2,0,0.4,0,0.5c0,0.3,0.2,0.6,0.5,0.7c0.1,0,0.1,0,0.2,0c0.2,0,0.5-0.1,0.6-0.3c3.7-6.5,5.5-6.8,9.5-6.8V19   c0,0.3,0.2,0.5,0.4,0.6s0.5,0.1,0.7-0.1l9.8-8c0.2-0.1,0.2-0.3,0.2-0.5S22.9,10.7,22.8,10.5z M13.2,17.6v-2.9   c0-0.2-0.1-0.4-0.2-0.5c-0.1-0.1-0.3-0.2-0.5-0.2c-2.7,0-3.8,0-5.9,0.9c-1.8,0.8-2.8,2.3-4.2,4.5c0.1-2,0.3-4.4,1.4-6.4   c1.7-3.2,3.5-4.8,8.7-4.8c0.4,0,0.7-0.3,0.7-0.7V4.6l8.1,6.5L13.2,17.6z"></path></svg>
                   <p class="lwip-content-display-card lwip-insta-post-card-footer-share popup-toggle-btn lwip-card-custom-color">Share</p>
                        <div class="lwip-popup-container-share">
                            <div class="lwip-popup-share lwip-hidden-share">
                                <ul>
                                    <li class="lwip-popup-share-hover-fb">
                                    <svg class="lwip-share-svgs lwip-card-custom-color" viewBox="64 64 896 896" focusable="false" data-icon="facebook" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-92.4 233.5h-63.9c-50.1 0-59.8 23.8-59.8 58.8v77.1h119.6l-15.6 120.7h-104V912H539.2V602.2H434.9V481.4h104.3v-89c0-103.3 63.1-159.6 155.3-159.6 44.2 0 82.1 3.3 93.2 4.8v107.9z"></path></svg>
                                    <a
                                            href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(item.permalink)}"
                                            target="_blank"
                                            onclick="window.open(this.href, 'facebookShare', 'width=600,height=400'); return false;">
                                            <span class="lwip-insta-post-card-footer-facebook-share lwip-card-custom-color">Share on Facebook</span></a></li>
                                                
                                    <li class="lwip-popup-share-hover-tw">
                                    <svg class="lwip-share-svgs lwip-card-custom-color"  viewBox="64 64 896 896" focusable="false" data-icon="twitter" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4a170.1 170.1 0 0075-94 336.64 336.64 0 01-108.2 41.2A170.1 170.1 0 00672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5a169.32 169.32 0 00-23.2 86.1c0 59.2 30.1 111.4 76 142.1a172 172 0 01-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4a180.6 180.6 0 01-44.9 5.8c-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z"></path></svg>
                                    <a
                                            href="https://twitter.com/intent/tweet?text=${encodeURIComponent(item.caption)}&url=${encodeURIComponent(item.permalink)}" "target="
                                            _blank"
                                            onclick="window.open(this.href, 'facebookShare', 'width=600,height=400'); return false;">
                                            <i class="fas fa-sign-out-alt"></i> <span class="lwip-insta-post-card-footer-twitter-share lwip-card-custom-color">Share on Twitter</span></a></li>
                                </ul>
                            </div>
                        </div>

                </div>    
            </div>
            <div class="lwip-card-caption lwip-popup-text" id="lwip-popup-text">
                <span class="lwip-content-display-card">${item.caption !== null ? item.caption : ''}</span>
            </div>
        `;
    });

    //for initially check and update elements
    function toggleVisibility(className, checkboxId) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = document.getElementById(checkboxId).checked ? 'flex' : 'none';
        }
    }

    //for initially check and update elements for card username
    function toggleVisibilityUserName(className, checkboxId) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = document.getElementById(checkboxId).checked ? 'block' : 'none';
        }
    }

    toggleVisibilityUserName("popup-username", "lwip-post-element-user");
    toggleVisibility("popup-date", "lwip-post-element-date");
    toggleVisibility("popup-follow-link", "lwip-post-element-follow-btn");
    toggleVisibility("lwip-popup-instagram-icon", "lwip-post-element-instagram-link");
    toggleVisibility("popup-like", "lwip-post-element-like-count");
    toggleVisibility("popup-comments", "lwip-post-element-comments");
    toggleVisibility("popup-shares", "lwip-post-element-share");
    toggleVisibility("lwip-popup-text", "lwip-post-element-text");

    //Event listner for changes
    function setupToggleVisibility(className, checkboxId) {
        var checkbox = document.getElementById(checkboxId);
        checkbox.addEventListener('click', function () {
            toggleVisibility(className, checkboxId);
        });
    }

    function setupToggleVisibilityUserName(className, checkboxId) {
        var checkbox = document.getElementById(checkboxId);
        checkbox.addEventListener('click', function () {
            toggleVisibilityUserName(className, checkboxId);
        });
    }

    // Set up the event listeners for each checkbox
    setupToggleVisibilityUserName("popup-username", "lwip-post-element-user");
    setupToggleVisibility("popup-date", "lwip-post-element-date");
    setupToggleVisibility("popup-follow-link", "lwip-post-element-follow-btn");
    setupToggleVisibility("lwip-popup-instagram-icon", "lwip-post-element-instagram-link");
    setupToggleVisibility("popup-like", "lwip-post-element-like-count");
    setupToggleVisibility("popup-comments", "lwip-post-element-comments");
    setupToggleVisibility("popup-shares", "lwip-post-element-share");
    setupToggleVisibility("lwip-popup-text", "lwip-post-element-text");
}

/**
 * Opens the specified modal.
 *
 * This function displays the modal by setting its display style to 'block'
 * or adding an appropriate class to make it visible.
 *
 */
function openModal(modal) {
    if (modal == null) return;

    modal.classList.add('active');
    overlay.classList.add('active');
    document.querySelector('.lwip-post-wrapper').classList.add('lwip-blur');
    document.querySelector('.lwip-post-wrapper-slider').classList.add('lwip-blur');
    document.getElementById('lwip-main-header-container').classList.add('lwip-blur');
    document.querySelector('.lwip-footer-wrapper').classList.add('lwip-blur');
    document.querySelector('.lwip-content').style.background = '#000000e6';
    setTimeout(() => {
        document.addEventListener('click', outsideClickListener);
    }, 0);
}

//Close the specified modal.
function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.querySelector('.lwip-post-wrapper').classList.remove('lwip-blur');
    document.querySelector('.lwip-post-wrapper-slider').classList.remove('lwip-blur');
    document.getElementById('lwip-main-header-container').classList.remove('lwip-blur');
    document.querySelector('.lwip-content').style.background = '';
    document.querySelector('.lwip-footer-wrapper').classList.remove('lwip-blur');

    // Remove event listener to avoid duplicate listeners
    document.removeEventListener('click', outsideClickListener);
}

// Close the specified Popup.
function closePopup() {
    const modal = document.getElementById('modal');
    closeModal(modal);
}

// Function to handle clicks outside the modal
function outsideClickListener(event) {
    const modal = document.getElementById('modal');
    const contentElement = document.querySelector('.lwip-content');
    if (!modal.contains(event.target) && contentElement.contains(event.target)) {
        closePopup();
    }
}

// Event listener for handling click events to toggle the visibility of popups.
document.addEventListener('click', function (event) {
    const button = event.target.closest('.popup-toggle-btn');
    if (button) {
        event.stopPropagation();

        const popup = button.nextElementSibling.querySelector('.lwip-popup-share');

        // Toggle visibility
        if (popup.classList.contains('lwip-visible-share')) {
            popup.classList.remove('lwip-visible-share');
            popup.classList.add('lwip-hidden-share');
        } else {
            popup.classList.remove('lwip-hidden-share');
            popup.classList.add('lwip-visible-share');
        }
    } else {
        // Hide all popups when clicking outside
        document.querySelectorAll('.lwip-popup-share.lwip-visible-share').forEach(function (popup) {
            popup.classList.remove('lwip-visible-share');
            popup.classList.add('lwip-hidden-share');
        });
    }
});

jQuery(document).ready(function ($) {

    //Handle connect personal or businness account form submission
    $('#lwip-connnect-account-frm').submit(function (event) {
        event.preventDefault();

        var widgetId = $('#hidden-widget-id').val();
        var accountType = $('.lwip-select-account-type:checked').val();
        var accessToken = getAccessToken();
        if (!accessToken) {
            return;
        }

        var currentPageURL = window.location.href;

        if (accountType) {
            const action = "lwip_store_account_type";
            $.ajax({
                type: 'POST',
                url: lwip_admin_ajax_object.ajax_url,
                data: {
                    action: action,
                    account_type_nonce: lwip_admin_ajax_object.account_type_nonce,
                    accountType: accountType,
                    widgetId: widgetId
                },
                success: function (response) {
                    // handle sucess 
                },
                error: function (xhr, status, error) {
                    //return
                }
            });
        }

        const data = {
            accountType: accountType,
            currentUrl: currentPageURL,
            widgetId: widgetId,
        };

        const query = `
        query Query($data: GetAuthUrlInput!) {
          getAuthUrl(data: $data) {
            url
          }
        }
      `;
        // Set up the arguments for the POST request
        var apiUrl = lwip_connect.graphqlEndpoint;
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({ query, variables: { data } }),
        };

        // Fetch data using the Fetch API
        fetch(apiUrl, options)
            .then(response => response.json())
            .then(data => {
                if (data.errors) {
                    showMessage(data.message);
                    showMessage(data.errors[0].message, 'error');
                } else {
                    const authUrl = data.data.getAuthUrl.url;
                    window.location.href = authUrl;
                }
            })
            .catch(/*Handle error*/);
    });

    // handle publish account
    $("#lwip-publish-account-btn").on('click', function () {

        const widgetId = getWidgetId();
        const connectSelectedValue = $('input[name="account"]:checked').val();
        const sourceType = $('input[name="account"]:checked').data('source-type');

        if (!connectSelectedValue) {
            return;
        }

        const accessToken = localStorage.getItem("accessToken");

        const variables = {
            where: {
                widgetId: widgetId,
                sourceType: sourceType
            }
        };

        const mutation = `
            mutation PublishWidget($where: PublishWidgetWhereInput!) {
                publishWidget(where: $where) {
                    message
                }
            }
        `;

        $.ajax({
            url: lwip_connect.graphqlEndpoint,
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify({
                query: mutation,
                variables: variables
            }),
            success: function (response) {
                const action = "lwip_store_publish_widget";

                $.ajax({
                    type: 'POST',
                    url: lwip_admin_ajax_object.ajax_url,
                    data: {
                        action: action,
                        publsh_widget_nonce: lwip_admin_ajax_object.publsh_widget_nonce,
                        widgetId: widgetId
                    },
                    success: function (response) {
                        if (response.success) {
                            showMessage('Changes were published.', 'success');
                            $("#lwip-publish-account-btn").addClass('lwip-disable-publish-button');
                        }
                    },
                    error: function (xhr, status, error) {
                        showMessage('Something went wrong', 'error');
                    }
                });

            },
            error: function (error) {
                showMessage('Something went wrong', 'error');
            }
        });
    });

    //Handle dissconnect personal or business account
    $(".disconnect-account").on('click', function () {
        event.preventDefault();
        const widgetId = getWidgetId();
        const connectSelectedValue = $('input[name="account"]:checked').val();
        const sourceType = $('input[name="account"]:checked').data('source-type');
        const accessToken = localStorage.getItem("accessToken");

        const urlParams = new URLSearchParams(window.location.search);

        // Check if the 'token' parameter exists
        if (urlParams.has('token')) {
            urlParams.delete('token');

            // Update the URL without reloading the page
            window.history.replaceState({}, document.title, window.location.pathname + '?' + urlParams.toString());
        }

        const variables = {
            where: {
                widgetId: widgetId,
                sourceType: sourceType
            }
        };
        const mutation = `
            mutation DisconnectAccount($where: DisconnectAccountInput!) {
                disconnectAccount(where: $where) {
                    message
                }
            }
        `;
        $.ajax({
            url: lwip_connect.graphqlEndpoint,
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify({
                query: mutation,
                variables: variables
            }),
            success: function (response) {
                showMessage("Disconnected account successfully", 'success');
                disconnectAction(widgetId);
            },
            error: function (error) {
                //Handle 
            }
        });
    });

    // Function to perform the disconnect action in WordPress
    function disconnectAction(widgetId) {
        action = "lwip_disconnect_account"
        $.ajax({
            type: 'POST',
            url: lwip_admin_ajax_object.ajax_url,
            data: {
                action: action,
                dissconnect_account_nonce: lwip_admin_ajax_object.dissconnect_account_nonce,
                widgetId: widgetId
            },
            success: function (response) {
                if (response.success) {
                    localStorage.setItem('connectStatus', false)
                    reload();
                }
            },
            error: function (xhr, status, error) {
                //handle error
            }
        });
    }

    // Function to update margin based on input value
    function updateMargin(gapValue) {
        var marginValue = gapValue;
        $("#lwip-manuall-gap-counter").val(marginValue);
        $(".lwip-post-wrapper").css("gap", marginValue + "px");
        $(".lwip-post-wrapper-slider .slick-slide,.slick-track").css("gap", marginValue + "px");
    }

    //gap counter 
    $("#lwip-manuall-gap-counter").on("input", function () {
        if (isMasonryStyle === false) {
            updateMargin($(this).val());
        } else if (isMasonryStyle === true) {
            if (selectedAccountType === "PERSONAL") {
                personalAccountData(sourceIdGlobal);
            } else if (selectedAccountType === "BUSINESS") {
                businessAccountData(sourceIdGlobal);
            } else {
                defaultMediaData();
            }
        }
    });

    //Width counter for slider style
    $('#lwip-width-counter').on('input', function () {
        var widthValue = $(this).val();
        if (parseFloat(widthValue) > 955) {
            widthValue = '100%';
        }
        $('.lwip-post-wrapper').css('width', widthValue);
        $('.lwip-post-wrapper-slider .section').css('width', widthValue);
    });

    //Width counter for grid style
    $('#lwip-width-counter').on('input', function () {
        var widthValue = $(this).val();
        if (parseFloat(widthValue) > 955) {
            widthValue = '100%';
        }
        $('.lwip-post-wrapper').css('width', widthValue);
    });

    //Handle style change event for grid
    $('#lwip-grid-view-btn').click(function () {
        $('.lwip-post-wrapper-slider').hide();
        $('.lwip-post-wrapper').show();
        $('#lwip-load-more-post-container').show();

        styleType = $(this).data('slider');
        hoverOrSimpleStyle = $('.lwip-simple-hover-sub-div button.selected-style').attr('data-poststyle');

        if (selectedAccountType === "PERSONAL") {
            personalAccountData(sourceIdGlobal);
        } else if (selectedAccountType === "BUSINESS") {
            businessAccountData(sourceIdGlobal);
        } else {
            defaultMediaData();
        }
    });

    //Handle style change event for slider
    $('#lwip-slider-view-btn').click(function () {

        $('.lwip-post-wrapper-slider').show();
        $('.lwip-post-wrapper').hide();

        hoverOrSimpleStyle = $('.lwip-simple-hover-sub-div button.selected-style').attr('data-poststyle');
        styleType = $(this).data('slider');

        if (selectedAccountType === "PERSONAL") {
            personalAccountData(sourceIdGlobal);
        } else if (selectedAccountType === "BUSINESS") {
            businessAccountData(sourceIdGlobal);
        } else {
            defaultMediaData();
        }
        $('#lwip-load-more-post-container').hide();
    });

    //Handle style change event for masonry
    $('#lwip-masonry-view-btn').click(function () {
        if (isLifetimeDeal === true) {

            $('.lwip-post-wrapper-slider').hide();
            $('.lwip-post-wrapper').show();
            $('#lwip-load-more-post-container').show();

            styleType = $(this).data('slider');
            hoverOrSimpleStyle = $('.lwip-simple-hover-sub-div button.selected-style').attr('data-poststyle');

            if (selectedAccountType === "PERSONAL") {
                personalAccountData(sourceIdGlobal);
            } else if (selectedAccountType === "BUSINESS") {
                businessAccountData(sourceIdGlobal);
            } else {
                defaultMediaData();
            }
        } else if (typeof isLifetimeDeal === 'undefined') { } else {
            dynamicPremiumPopupMessage('Organize your posts in a stylish Masonry layout for a modern and dynamic display.')
        }
    });

    /**
     * Handle changes for header elements
     */
    $('#lwip-main-header-profile-pic-checkbox').change(function () {
        if (selectedAccountType === 'PERSONAL') {
            $('#lwip-main-header-insta-logo').hide();
        } else {
            if (this.checked) {
                $('#lwip-main-header-insta-logo').show();
            } else {
                $('#lwip-main-header-insta-logo').hide();
            }
        }
    });

    $('#lwip-main-header-user-fullname-checkbox').change(function () {
        if (this.checked) {
            $('#lwip-main-header-insta-user-fullname').show();
        } else {
            $('#lwip-main-header-insta-user-fullname').hide();
        }
    });

    $('#lwip-main-header-username-checkbox').change(function () {
        if (this.checked) {
            $('.lwip-user-name').show();
        } else {
            $('.lwip-user-name').hide();
        }
    });

    $('#lwip-main-header-post-count-checkbox').change(function () {
        if (selectedAccountType === 'PERSONAL') {
            $('#lwip-main-header-insta-posts-container').hide();
        } else {
            if (this.checked) {
                $('#lwip-main-header-insta-posts-container').show();
            } else {
                $('#lwip-main-header-insta-posts-container').hide();
            }
        }
    });

    $('#lwip-main-header-followers-count-checkbox').change(function () {
        if (selectedAccountType === 'PERSONAL') {
            $('#lwip-main-header-insta-follow-container').hide();
        } else {
            if (this.checked) {
                $('#lwip-main-header-insta-follow-container').show();
            } else {
                $('#lwip-main-header-insta-follow-container').hide();
            }
        }
    });

    $('#lwip-main-header-following-count-checkbox').change(function () {
        if (selectedAccountType === 'PERSONAL') {
            $('#lwip-main-header-insta-following-container').hide();
        } else {
            if (this.checked) {
                $('#lwip-main-header-insta-following-container').show();
            } else {
                $('#lwip-main-header-insta-following-container').hide();
            }
        }
    });

    $('#lwip-main-header-follow-btn-checkbox').change(function () {
        if (this.checked) {
            $('#lwip-main-header-insta-user-follow-btn-url').show();
        } else {
            $('#lwip-main-header-insta-user-follow-btn-url').hide();
        }
    });

    $('#lwip-feed-title').on('input', function () {
        var inputValue = $(this).val();

        // Check if the input value is empty
        if (inputValue.trim() === '') {
            $('#lwip-feed-custom-header-name').hide();
        } else {
            $('#lwip-feed-custom-header-name').show();
            var formattedValue = formatText(inputValue);
            $('#lwip-feed-custom-header-name').html(formattedValue);
        }
    });

    // Function to format text with clickable links
    function formatText(text) {
        var urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        var hashtagPattern = /#(\w+)/g;
        var mentionPattern = /@(\w+)/g;
        text = text.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
        text = text.replace(hashtagPattern, '<a href="https://www.instagram.com/explore/tags/$1" target="_blank">#$1</a>');
        text = text.replace(mentionPattern, '<a href="https://www.instagram.com/$1" target="_blank">@$1</a>');
        return text;
    }

});
