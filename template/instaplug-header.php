<?php

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}
// Define the path to the logo image
$logo_url = LWIP_PLUGIN_PATH . 'admin/images/logo.png';

// Check if the transient 'lwip_user_details' exists and is not expired
$is_logged_in = get_transient('lwip_user_details') !== false;

// Initialize the variable to store the display character
$display_char = '';

?>
<header class="instaplug-header">
    <div>
        <div class="full-height"><img alt="logo" class="logo-header instaplug-full-logo" src="<?php echo esc_url($logo_url); ?>"></div>
    </div>
    <div>
        <?php if ($is_logged_in) :

            // Retrieve user details from transient
            $user_details = get_transient('lwip_user_details');

            // Extract the first character and convert into Upper case
            $display_char = !empty($user_details) ? strtoupper(substr($user_details, 0, 1)) : '';
        ?>

            <div id="lwip-profile-menu" class="lwip-profile-menu">
                <div class="lwip-profile-button">
                    <span class="lwip-avatar"><?php echo esc_html($display_char); ?></span>
                    <span class="lwip-icon"><?php echo esc_html('&#9662;'); ?></span>
                </div>
                <ul class="lwip-dropdown-menu">
                    <li class="lwip-dropdown-item" id="lwip-user-profile">
                        <span class="lwip-icon-container">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="idcard" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H136V232h752v560zM610.3 476h123.4c1.3 0 2.3-3.6 2.3-8v-48c0-4.4-1-8-2.3-8H610.3c-1.3 0-2.3 3.6-2.3 8v48c0 4.4 1 8 2.3 8zm4.8 144h185.7c3.9 0 7.1-3.6 7.1-8v-48c0-4.4-3.2-8-7.1-8H615.1c-3.9 0-7.1 3.6-7.1 8v48c0 4.4 3.2 8 7.1 8zM224 673h43.9c4.2 0 7.6-3.3 7.9-7.5 3.8-50.5 46-90.5 97.2-90.5s93.4 40 97.2 90.5c.3 4.2 3.7 7.5 7.9 7.5H522a8 8 0 008-8.4c-2.8-53.3-32-99.7-74.6-126.1a111.8 111.8 0 0029.1-75.5c0-61.9-49.9-112-111.4-112s-111.4 50.1-111.4 112c0 29.1 11 55.5 29.1 75.5a158.09 158.09 0 00-74.6 126.1c-.4 4.6 3.2 8.4 7.8 8.4zm149-262c28.5 0 51.7 23.3 51.7 52s-23.2 52-51.7 52-51.7-23.3-51.7-52 23.2-52 51.7-52z">
                                </path>
                            </svg>
                        </span>
                        <span><?php esc_html_e('My Profile', 'social-media-feed-widget') ?> </span>
                    </li>
                    <li class="lwip-dropdown-item" onclick="logout()">
                        <span class="lwip-icon-container">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="login" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M521.7 82c-152.5-.4-286.7 78.5-363.4 197.7-3.4 5.3.4 12.3 6.7 12.3h70.3c4.8 0 9.3-2.1 12.3-5.8 7-8.5 14.5-16.7 22.4-24.5 32.6-32.5 70.5-58.1 112.7-75.9 43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 32.6 32.5 58.1 70.4 76 112.5C865.7 417.8 875 464.1 875 512c0 47.9-9.4 94.2-27.8 137.8-17.8 42.1-43.4 80-76 112.5s-70.5 58.1-112.7 75.9A352.8 352.8 0 01520.6 866c-47.9 0-94.3-9.4-137.9-27.8A353.84 353.84 0 01270 762.3c-7.9-7.9-15.3-16.1-22.4-24.5-3-3.7-7.6-5.8-12.3-5.8H165c-6.3 0-10.2 7-6.7 12.3C234.9 863.2 368.5 942 520.6 942c236.2 0 428-190.1 430.4-425.6C953.4 277.1 761.3 82.6 521.7 82zM395.02 624v-76h-314c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8h314v-76c0-6.7 7.8-10.5 13-6.3l141.9 112a8 8 0 010 12.6l-141.9 112c-5.2 4.1-13 .4-13-6.3z">
                                </path>
                            </svg>
                        </span>
                        <span><?php esc_html_e('Logout', 'social-media-feed-widget') ?></span>
                    </li>
                    <!-- Future Enhacement for tutorial option -->
                    <!-- <li class="lwip-dropdown-item">
                        <span class="lwip-icon-container">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="bulb" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path
                                    d="M632 888H392c-4.4 0-8 3.6-8 8v32c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-32c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-328 328 0 121.4 66 227.4 164 284.1V792c0 17.7 14.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98-56.7 164-162.7 164-284.1 0-181.1-146.9-328-328-328zm127.9 549.8L604 634.6V752H420V634.6l-35.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4 114.6-256 256-256s256 114.6 256 256c0 92.5-49.4 176.3-128.1 221.8z">
                                </path>
                            </svg>
                        </span>
                        <span>Tutorial</span>
                    </li> -->
                </ul>
            </div>

        <?php else : ?>
            <a onclick="openLoginPopup()" class="instaplug-login-btn" id="login-btn"><?php esc_html_e('Login', 'social-media-feed-widget') ?></a>
        <?php endif; ?>
    </div>
</header>