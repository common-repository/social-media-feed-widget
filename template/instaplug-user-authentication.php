<?php

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}
// Define the path for images 
$image_url = plugins_url('../admin/images/logo.png', __FILE__);

?>
<!-- HTML content for the social-media-feed-widget plugin user authentication interface(e.g. login,signup) -->
<!-- Login Popup -->
<div id="lwip-login-popup-container" class="lwip-login-popup">
    <span class="lwip-close-btn dashicons dashicons-no" id="close" onclick="closePopupByButton()"></span>
    <img src="<?php echo esc_url($image_url); ?>" class="lwip-popup-image">
    <h2><?php esc_html_e('Login', 'social-media-feed-widget') ?></h2>
    <form id="lwip-user-login-frm" class="lwip-popup-form" method="post" action="">
        <input type="hidden" name="lwip_nonce" value="<?php echo esc_attr(wp_create_nonce('lwip_login_action')); ?>">
        <input type="email" placeholder="<?php esc_attr_e('Email', 'social-media-feed-widget'); ?>" id="lwip-user-login-email" name="login-email" required>
        <div class="lwip-error-message" id="login-error-message-email"></div>
        <input type="password" placeholder="<?php esc_attr_e('Password', 'social-media-feed-widget'); ?>" id="lwip-user-login-password" name="login-password" required>
        <span class="lwip-error-message" id="login-error-message"></span>
        <p><a onclick="openResetPopup()" style="cursor: pointer;"><?php esc_html_e('Forgot password?', 'social-media-feed-widget') ?></a></p>
        <button type="submit" name="action" value="login"><?php esc_html_e('Login', 'social-media-feed-widget') ?></button>
        <span class="lwip-social-login-text"><?php esc_html_e('or connect with', 'social-media-feed-widget') ?></span>

        <div class="lwip-social-login-buttons">
            <button type="button" class="lwip-social-btn lwip-facebook-btn lwip-login-facebook-btn">
                <span class="lwip-btn-icon">
                    <span>
                        <span role="img" aria-label="facebook" class="anticon anticon-facebook">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="facebook" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-92.4 233.5h-63.9c-50.1 0-59.8 23.8-59.8 58.8v77.1h119.6l-15.6 120.7h-104V912H539.2V602.2H434.9V481.4h104.3v-89c0-103.3 63.1-159.6 155.3-159.6 44.2 0 82.1 3.3 93.2 4.8v107.9z">
                                </path>
                            </svg>
                        </span>
                    </span>
                </span>
                <?php esc_html_e('Sign in with Facebook', 'social-media-feed-widget') ?>
            </button>
            <button class="lwip-social-btn lwip-google-btn lwip-login-google-btn">
                <span class="lwip-btn-icon">
                    <span><span role="img" aria-label="google" class="anticon anticon-google" id="google-signin-btn" style="margin-right:10px">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="google" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M881 442.4H519.7v148.5h206.4c-8.9 48-35.9 88.6-76.6 115.8-34.4 23-78.3 36.6-129.9 36.6-99.9 0-184.4-67.5-214.6-158.2-7.6-23-12-47.6-12-72.9s4.4-49.9 12-72.9c30.3-90.6 114.8-158.1 214.7-158.1 56.3 0 106.8 19.4 146.6 57.4l110-110.1c-66.5-62-153.2-100-256.6-100-149.9 0-279.6 86-342.7 211.4-26 51.8-40.8 110.4-40.8 172.4S151 632.8 177 684.6C240.1 810 369.8 896 519.7 896c103.6 0 190.4-34.4 253.8-93 72.5-66.8 114.4-165.2 114.4-282.1 0-27.2-2.4-53.3-6.9-78.5z">
                                </path>
                            </svg>
                        </span>
                    </span>
                    <?php esc_html_e('Sign in with Google', 'social-media-feed-widget') ?>
            </button>
        </div>
        <p class="lwip-auth-form-txt"> <?php esc_html_e('Don\'t have an account yet?', 'social-media-feed-widget') ?><a onclick="openSignupPopup()" style="cursor: pointer;"><?php esc_html_e('Sign-up', 'social-media-feed-widget') ?></a></p>
    </form>
</div>

<!-- SignUp Popup -->
<div id="lwip-signup-popup-container" class="lwip-signup-popup">
    <span class="lwip-close-btn dashicons dashicons-no" id="close" onclick="closePopupByButton()"></span>
    <img src="<?php echo esc_url($image_url); ?>" class="lwip-popup-image">
    <form class="lwip-popup-form" id="lwip-signup-frm" method="post">

        <h2><?php esc_html_e('Sign-up', 'social-media-feed-widget') ?></h2>

        <input type="text" placeholder="<?php esc_attr_e('Enter first Name', 'social-media-feed-widget'); ?>" name="user-first-name" id="lwip-signup-user-fname" required>
        <div class="lwip-error-message" id="name-error-message-first"></div>

        <input type="text" placeholder="<?php esc_attr_e('Enter last Name', 'social-media-feed-widget'); ?>" name="user-last-name" id="lwip-signup-user-lname" required>
        <div class="lwip-error-message" id="name-error-message-last"></div>

        <input type="email" placeholder="<?php esc_attr_e('Email', 'social-media-feed-widget'); ?>" id="lwip-signup-user-email" name="signup-email" required>
        <div class="lwip-error-message" id="signup-error-message-email"></div>

        <input type="password" placeholder="<?php esc_attr_e('Password', 'social-media-feed-widget'); ?>" id="lwip-signup-user-password" name="signup-password" required>
        <div class="lwip-error-message" id="signup-error-message-password"></div>

        <button type="submit"><?php esc_html_e('Signup', 'social-media-feed-widget') ?></button>

        <span class="lwip-social-login-text"> <?php esc_html_e('or connect with', 'social-media-feed-widget') ?></span>
        <div class="lwip-social-login-buttons">
            <button type="button" class="lwip-social-btn lwip-facebook-btn lwip-login-facebook-btn">
                <span class="lwip-btn-icon">
                    <span>
                        <span role="img" aria-label="facebook" class="anticon-facebook">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="facebook" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-92.4 233.5h-63.9c-50.1 0-59.8 23.8-59.8 58.8v77.1h119.6l-15.6 120.7h-104V912H539.2V602.2H434.9V481.4h104.3v-89c0-103.3 63.1-159.6 155.3-159.6 44.2 0 82.1 3.3 93.2 4.8v107.9z">
                                </path>
                            </svg>
                        </span>
                    </span>
                </span>
                <?php esc_html_e('Sign in with Facebook', 'social-media-feed-widget') ?>
            </button>
            <button class="lwip-social-btn lwip-google-btn lwip-login-google-btn">
                <span class="lwip-btn-icon">
                    <span><span role="img" aria-label="google" class="anticon-google">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="google" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M881 442.4H519.7v148.5h206.4c-8.9 48-35.9 88.6-76.6 115.8-34.4 23-78.3 36.6-129.9 36.6-99.9 0-184.4-67.5-214.6-158.2-7.6-23-12-47.6-12-72.9s4.4-49.9 12-72.9c30.3-90.6 114.8-158.1 214.7-158.1 56.3 0 106.8 19.4 146.6 57.4l110-110.1c-66.5-62-153.2-100-256.6-100-149.9 0-279.6 86-342.7 211.4-26 51.8-40.8 110.4-40.8 172.4S151 632.8 177 684.6C240.1 810 369.8 896 519.7 896c103.6 0 190.4-34.4 253.8-93 72.5-66.8 114.4-165.2 114.4-282.1 0-27.2-2.4-53.3-6.9-78.5z">
                                </path>
                            </svg>
                        </span>
                    </span>
                </span>
                <?php esc_html_e('Sign in with Google', 'social-media-feed-widget') ?>
            </button>
        </div>
        <p class="lwip-auth-form-txt"> <?php esc_html_e('Already have an account?', 'social-media-feed-widget') ?> <a onclick="openLoginPopup()" style="cursor: pointer;"><?php esc_html_e('Login', 'social-media-feed-widget') ?></a></p>
        <div class="lwip-error-message" id="lwip-signup-account-error"></div>

    </form>

</div>

<!-- Email verification Popup -->
<div id="lwip-otp-verification-popup-container" class="lwip-email-verification-popup" style="color: white;">
    <img src="<?php echo esc_url($image_url); ?>" class="lwip-popup-image">
    <h2><?php esc_html_e('Email Verification', 'social-media-feed-widget') ?></h2>
    <form class="lwip-popup-form" id="lwip-otp-verification-frm" method="post" action="">
        <input type="hidden" name="lwip_nonce" value="<?php echo esc_attr(wp_create_nonce('lwip_signup_action')); ?>">
        <p> <?php esc_html_e('Email ID:', 'social-media-feed-widget') ?> <span id="email-id-display" style="color: white;"></span></p>
        <input type="text" id="lwip-user-data" value="" name="user-data" style="display: none;">
        <input type="text" placeholder="<?php esc_attr_e('OTP', 'social-media-feed-widget'); ?>" id="lwip-otp" name="otp">
        <span class="lwip-error-message" id="otp-error-message"></span>
        <button type="submit" id="verify-button"><?php esc_html_e('Verify', 'social-media-feed-widget') ?></button>
        <p id="lwip-timer-container" style="color: white; display: none;"></p>
        <p id="lwip-resent-otp-section" style="display: none;"> <?php esc_html_e('Didn\'t receive the code?', 'social-media-feed-widget') ?><a id="lwip-user-resend-otp" onclick="resendOtpTimer();" style="color: white;" disabled><?php esc_html_e('Resend OTP', 'social-media-feed-widget') ?></a></p>
    </form>
</div>

<!-- Reset password Popup -->
<div id="lwip-reset-password-container" class="lwip-reset-popup">
    <span class="lwip-close-btn dashicons dashicons-no" id="close" onclick="closePopupByButton()"></span>
    <img src="<?php echo esc_url($image_url); ?>" class="lwip-popup-image">
    <h2><?php esc_html_e('Reset my Password', 'social-media-feed-widget') ?></h2>
    <form id="lwip-user-reset-password-frm" class="lwip-popup-form" method="post" action="">
        <input type="email" placeholder="<?php esc_attr_e('Email', 'social-media-feed-widget'); ?>" id="lwip-user-reset-email" name="reset-email" required>
        <span class="lwip-error-message" id="reset-error-message"></span>
        <div class="lwip-error-message" id="reset-error-message-email"></div>
        <p><a onclick="openLoginPopup()"><?php esc_html_e('Back to Login', 'social-media-feed-widget') ?></a></p>
        <button type="submit" name="action" value="reset"><?php esc_html_e('Reset my password', 'social-media-feed-widget') ?></button>
    </form>
</div>