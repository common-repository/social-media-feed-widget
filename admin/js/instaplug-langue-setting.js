
// Global variables for handling various tasks related to user settings, UI state, and application configuration
let selectedLanguageGlobal;
let widgetName;

// Define the loadTranslation function outside of any function scope
function loadTranslation(lang) {

    if (lang === 'English') {
        lang = 'en';
    }
    if (!lang) {
        lang = 'en';
    }

    const filePath = `${myplugin_translation.translationFilePath}/${lang}/translation.json`;
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok ${response.statusText}`);
            }
            return response.json();
        })
        .then(translations => {
            applyTranslations(translations);
        })
        .catch(error => {
            // hadnle error
        });
}

// Function to apply translations to the elements
function applyTranslations(translations) {
    document.getElementById('lwip-main-header-user-posts-txt').textContent = translations["Posts"];
    document.getElementById('lwip-main-header-user-followers-txt').textContent = translations["Followers"];
    document.getElementById('lwip-main-header-user-following-txt').textContent = translations["Following"];
    document.getElementById('lwip-main-header-user-follow-btn').getElementsByTagName('span')[0].textContent = translations["Follow"];

    var cardShareElements = document.getElementsByClassName('lwip-insta-post-card-footer-share');
    for (var i = 0; i < cardShareElements.length; i++) {
        cardShareElements[i].textContent = translations["Share"];
    }

    var cardShareFbElements = document.getElementsByClassName('lwip-insta-post-card-footer-facebook-share');
    for (var i = 0; i < cardShareFbElements.length; i++) {
        cardShareFbElements[i].textContent = translations["Share on Facebook"];
    }

    var cardShareTwElements = document.getElementsByClassName('lwip-insta-post-card-footer-twitter-share');
    for (var i = 0; i < cardShareTwElements.length; i++) {
        cardShareTwElements[i].textContent = translations["Share on Twitter"];
    }

    var popupFollowTxtElements = document.getElementsByClassName('popup-follow-txt');
    for (var i = 0; i < popupFollowTxtElements.length; i++) {
        popupFollowTxtElements[i].textContent = translations["Follow"];
    }
}

//Handle Changes in langues and Fetch default langue
jQuery(document).ready(function ($) {

    const widgetId = getWidgetId();
    var accessToken = getAccessToken();

    if (!accessToken || !widgetId) {
        return;
    }
    // Fetch the current language from the server
    if (widgetId) {
        $.ajax({
            url: lwip_connect.graphqlEndpoint,
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify({
                query: `
                    query GetWidget($widgetId: ID!) {
                      getWidget(widgetId: $widgetId) {
                        name
                        language
                      }
                    }
                `,
                variables: {
                    widgetId: widgetId
                }
            }),
            success: function (response) {
                if (response.errors) {
                    const errorMessage = response.errors[0].message;
                    showMessage(errorMessage, 'error');
                    return;
                }

                var language = response.data.getWidget.language;
                widgetName = response.data.getWidget.name;

                if (language === 'English') {
                    language = 'en';
                }

                $('#lwip-select-langues').val(language);
                $('#lwip-currenct-widget-name').text(widgetName);
                $('#lwip-widget-input-name').val(widgetName);
                selectedLanguageGlobal = language;
                loadTranslation(language);
            },
            error: function (error) {
                //return
            }
        });
    }

    // Handle language change
    $('#lwip-select-langues').change(function () {
        var selectedLanguage = $(this).val();
        selectedLanguageGlobal = selectedLanguage;

        var mutation = `
                mutation UpdateWidget($where: WidgetWhereUniqueInput!, $data: UpdateWidgetInput) {
                  updateWidget(where: $where, data: $data) {
                    message
                    data {
                      id
                      name
                      filters {
                        show
                        hide
                        totalNumberOfPost
                      }
                      selectedSourceType
                      language
                      createdAt
                      updatedAt
                      template
                      views
                    }
                  }
                }
            `;

        var variables = {
            where: {
                id: widgetId
            },
            data: {
                name: widgetName,
                language: selectedLanguage
            }
        };

        $.ajax({
            url: lwip_connect.graphqlEndpoint,
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify({
                query: mutation,
                variables: variables
            }),
            success: function (response) {
                showMessage('Language updated successfully!', 'success');
                loadTranslation(selectedLanguage);
            },
            error: function (error) {
                showMessage('Failed to update language.', 'error');
            }
        });

    });
});

