<?php

/**
 * Class to handle social-media-feed-widget shortcode functionality.
 *
 * @link       https://logicwind.com
 * @since      1.0.0
 *
 * @package    social-media-feed-widget
 * @subpackage social-media-feed-widget/includes
 */

/**
 * Coding Standard Ignore because of custom tables CRUD
 */
// @codingStandardsIgnoreStart
class Lwip_InstaPlug_Shortcode_Handler
{
    /**
     * Constructor to add shortcode.
     *
     * @since    1.0.0
     */
    public static function init()
    {
        add_shortcode('instaplug', array(__CLASS__, 'lwip_render_widget'));
    }

    /**
     * Display the dynamic Instagram feed based on the shortcode attributes.
     *
     * @param array $atts Shortcode attributes.
     * @return string HTML output or error message.
     */
    public static function lwip_render_widget($atts)
    {
        // Define default attributes and sanitize input.
        $atts = shortcode_atts(array(
            'feed' => '',
        ), $atts);

        $feed_name = sanitize_text_field($atts['feed']);

        global $wpdb;

        // Retrieve the user's email from the transient.
        $email = get_transient('lwip_user_details');

        if (!empty($feed_name) && !empty($email)) {
            // Get user ID based on the email.
            $user_id = $wpdb->get_var($wpdb->prepare("SELECT id FROM $wpdb->lwip_users WHERE email = %s", $email));

            if (!empty($user_id)) {
                // Get feed ID based on the shortcode and user ID.
                $feed_id = $wpdb->get_var($wpdb->prepare(
                    "SELECT feed_id FROM $wpdb->lwip_feeds WHERE shortcode = %s AND lwip_user_id = %d",
                    $feed_name,
                    $user_id
                ));
            }
        }

        if ($feed_id !== null) {
            // Get the feed settings for the feed ID.
            $widget_id = $wpdb->get_var($wpdb->prepare("SELECT widget_id FROM $wpdb->lwip_feeds WHERE feed_id = %d", $feed_id));

            // Return the feed settings or a message if not found.
            if ($widget_id) {

                // Enqueue the Google Fonts for the widget.
                wp_enqueue_style('lwip-shortcode-font', 'https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Comfortaa:wght@300..700&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Lexend:wght@100..900&family=Lobster&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Oswald:wght@200..700&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap', [], null);

                // Prepare the inline script
                $inline_script = '
                    window.renderApp({
                        "containerId": "' . esc_js($widget_id) . '",
                        "domain": "' . esc_js(LWIP_SCRIPT_ENDPOINT) . '",
                        "widgetClass": "",
                        "fontFamily": "",
                        "color": "",
                        "colorLink": "",
                        "colorLinkActive": "",
                        "colorLinkHover": ""
                    });
                ';

                // Enqueue the script
                wp_enqueue_script('lwip-admin-script', esc_url(LWIP_SCRIPT_ENDPOINT . 'platform/instaplug.js'), array(), null, true);

                // Add the inline script
                wp_add_inline_script('lwip-admin-script', $inline_script);

                // Return the widget ID
                return '<div id="' . esc_attr($widget_id) . '"></div>';
            } else {
                return sprintf(
                    // %s: Widget name
                    __('Please publish social-feed-widget "%s"', 'social-media-feed-widget'),
                    esc_html($feed_name)
                );
            }
        } else {
            // Return a message if the widget is not found.
            return sprintf(
                // %s: Widget name
                __('Social-feed-widget name "%s" not found', 'social-media-feed-widget'),
                esc_html($feed_name)
            );
        }
    }
}
// @codingStandardsIgnoreEnd
