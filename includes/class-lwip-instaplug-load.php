<?php

/**
 * Class to manage the social-media-feed-widget plugin's admin menu and assets.
 *
 * @link       https://logicwind.com
 * @since      1.0.0
 *
 * @package    social-media-feed-widget
 * @subpackage social-media-feed-widget/includes
 */
class Lwip_Instaplug_Load
{
    protected static $instance;
    protected static $menu_slug = 'lwip_feed_builder';
    protected static $custom_capability;

    /**
     * Constructor to initialize actions.
     *
     * @since    1.0.0
     */
    private function __construct()
    {
        // Add actions for admin menu, capabilities, and asset enqueueing
        add_action('admin_menu', array($this, 'lwip_add_menu'));
        add_action('admin_init', array('Lwip_Instaplug_Load', 'lwip_set_custom_capability'));
        add_action('admin_enqueue_scripts', array($this, 'lwip_enqueue_assets'));
        add_action('plugins_loaded', array($this, 'lwip_load_text_domain'));
        add_action('wp_initialize_site', array($this, 'lwip_new_multisite_blog'), 10, 2);
    }

    /**
     * Get the menu slug.
     *
     * @since    1.0.0
     * @return string Menu slug
     */
    public static function lwip_get_menu_slug()
    {
        return self::$menu_slug;
    }

    /**
     * Set the custom capability for accessing the plugin settings.
     *
     * @since    1.0.0
     */
    public static function lwip_set_custom_capability()
    {
        // Set the custom capability
        self::$custom_capability = current_user_can('manage_instagram_feed_options') ? 'manage_instagram_feed_options' : 'manage_options';
    }

    /**
     * Add plugin menu and submenus to the admin dashboard.
     *
     * @since    1.0.0
     */
    public function lwip_add_menu()
    {
        $menu_slug = self::lwip_get_menu_slug();
        $setting_tab = null;

        // Set the custom capability
        self::lwip_set_custom_capability();

        // Get the custom capability
        $cap = apply_filters('lwip_settings_pages_capability', self::$custom_capability);

        // Add main menu page
        add_menu_page(
            LWIP_PLUGIN_NAME,
            LWIP_PLUGIN_NAME,
            $cap,
            $menu_slug,
            array($this, 'lwip_load_content'),
            'dashicons-instagram'
        );

        // Add submenu pages
        add_submenu_page(
            $menu_slug,
            __('All Feeds', 'social-media-feed-widget'),
            __('All Feeds', 'social-media-feed-widget'),
            $cap,
            self::$menu_slug,
            '__return_null'
        );

        add_submenu_page(
            $menu_slug,
            __('Premium', 'social-media-feed-widget'),
            __('Premium', 'social-media-feed-widget'),
            $cap,
            $menu_slug . '_premium',
            array($this, 'lwip_premium_plan'),

        );

        add_submenu_page(
            $setting_tab ?? '',
            __('Settings', 'social-media-feed-widget'),
            __('Settings', 'social-media-feed-widget'),
            $cap,
            $menu_slug . '_settings',
            array($this, 'lwip_setting_instagram_feed'),

        );

        add_submenu_page(
            $setting_tab ?? '',
            __('Profile', 'social-media-feed-widget'),
            __('Profile', 'social-media-feed-widget'),
            $cap,
            'lwip_user_profile',
            array($this, 'lwip_user_profile'),

        );
    }

    /**
     * Enqueue the necessary stylesheets and scripts for the admin dashboard.
     *
     * @since    1.0.0
     */
    public function lwip_enqueue_assets()
    {
        // Enqueue masonry layout
        wp_enqueue_script('lwip-masonry-layout2', LWIP_PLUGIN_PATH . 'assets/js/minimasonry.min.js', array(), '1.0.0', true);

        // Enqueue Slick Carousel stylesheets
        wp_enqueue_style('lwip-slick-carousel-css', LWIP_PLUGIN_PATH . 'assets/css/slick.css', array(), '1.8.1');
        wp_enqueue_style('lwip-slick-carousel-theme-css', LWIP_PLUGIN_PATH . 'assets/css/slick-theme.css', array(), '1.8.1');

        // Enqueue Slick Carousel script
        wp_enqueue_script('lwip-slick-carousel-js', LWIP_PLUGIN_PATH . 'assets/js/slick.min.js', array('jquery'), '1.8.1', true);

        // Enqueue styles 
        wp_enqueue_style('lwip-admin-style', LWIP_PLUGIN_PATH . 'admin/css/instaplug-style.css', array(), '1.0.0');
        wp_enqueue_style('lwip-admin-slider', LWIP_PLUGIN_PATH . 'admin/css/instaplug-side-menu.css', array(), '1.0.0');
        wp_enqueue_style('lwip-admin-insta-content', LWIP_PLUGIN_PATH . 'admin/css/instaplug-content.css', array(), '1.0.0');
        wp_enqueue_style('lwip-admin-instaplug-premium', LWIP_PLUGIN_PATH . 'admin/css/instaplug-premium-plan.css', array(), '1.0.0');

        // Enqueue scripts
        wp_enqueue_script('lwip-admin-script', LWIP_PLUGIN_PATH . 'admin/js/instaplug-script.js', array('jquery'), '1.0.0', true);
        wp_enqueue_script('lwip-admin-insta-content-script', LWIP_PLUGIN_PATH . 'admin/js/instaplug-content.js', array('jquery'), '1.0.0', true);
        wp_enqueue_script('lwip-admin-langue-setting', LWIP_PLUGIN_PATH . 'admin/js/instaplug-langue-setting.js', array('jquery'), '1.0.0', true);
        wp_enqueue_script('lwip-admin-insta-post', LWIP_PLUGIN_PATH . 'admin/js/instaplug-manage-post.js', array('jquery'), '1.0.0', true);


        // Scripts to localize
        $scripts_to_localize = array(
            'lwip-admin-script',
            'lwip-admin-insta-content-script',
            'lwip-admin-langue-setting',
            'lwip-admin-insta-post'
        );

        // Localize scripts with additional nonce data
        wp_localize_script('lwip-admin-script', 'lwip_admin_ajax_object', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'signup_nonce' => wp_create_nonce('lwip_signup_action'),
            'login_nonce' => wp_create_nonce('lwip_login_action'),
            'logout_nonce' => wp_create_nonce('lwip_logout_action'),
            'delete_widget_nonce' => wp_create_nonce('lwip_delete_widget_action'),
            'dissconnect_account_nonce' => wp_create_nonce('lwip_dissconnect_account_action'),
            'account_type_nonce' => wp_create_nonce('lwip_account_type_action'),
            'validate_loggedIn_user_nonce' => wp_create_nonce('lwip_validate_loggedIn_user_action'),
            'publsh_widget_nonce' => wp_create_nonce('lwip_publsh_widget_action'),
            'generate_shortcode_nonce' => wp_create_nonce('lwip_generate_shortcode_action'),
            'create_shortcode_nonce' => wp_create_nonce('lwip_create_shortcode_action'),
        ));

        // Localize scripts langues path
        wp_localize_script('lwip-admin-langue-setting', 'myplugin_translation', array(
            'translationFilePath' => LWIP_PLUGIN_PATH . 'locales',
        ));

        // Loop through the scripts to localize the GraphQL endpoint URL
        foreach ($scripts_to_localize as $script) {
            wp_localize_script($script, 'lwip_connect', array(
                'graphqlEndpoint' => LWIP_GRAPHQL_ENDPOINT,
            ));
        }

        // Enqueue Google Fonts
        wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap', array(), '1.0.0');
        wp_enqueue_style('lwip-font-awesome', LWIP_PLUGIN_PATH . 'assets/css/font-awesome.min.css', array(), '1.0.0');
        wp_enqueue_style('lwip-custom-css-fonts', 'https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Comfortaa:wght@300..700&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Lexend:wght@100..900&family=Lobster&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Oswald:wght@200..700&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap', [], null);

        //Select option links
        wp_enqueue_style('lwip-select-2-style', LWIP_PLUGIN_PATH . 'assets/css/select2.css', array(), '1.0.0');
        wp_enqueue_script('lwip-select-2-script', LWIP_PLUGIN_PATH . 'assets/js/select2.js', array('jquery'), '1.0.0', true);
    }

    /**
     * Load the necessary content for the main page of the plugin.
     *
     * This method includes the header, main content, and user authentication template files.
     */
    public function lwip_load_content()
    {
        require_once LWIP_PLUGIN_DIR . 'template/instaplug-header.php';
        require_once LWIP_PLUGIN_DIR . 'template/instaplug-main-content.php';
        require_once LWIP_PLUGIN_DIR . 'template/instaplug-user-authentication.php';
    }

    /**
     * Handle settings related to the Instagram feed.
     *
     * This method retrieves the feed ID from the URL, checks its validity, 
     * includes the widget template, and enqueues necessary JavaScript files.
     */
    public function lwip_setting_instagram_feed()
    {
        //get Feed id from url
        $feed_id = filter_input(INPUT_GET, 'feed_id', FILTER_SANITIZE_URL);

        // Check if feed-id is present in the URL
        if (!isset($feed_id) || empty($feed_id)) {
            wp_die(esc_html__('Invalid access. Please access this page through the correct link.', 'social-media-feed-widget'));
        }
        require_once LWIP_PLUGIN_DIR . 'template/instaplug-widget.php';

        //enqueue script for specific file
        wp_enqueue_script('lwip-admin-side-menu-script', LWIP_PLUGIN_PATH . 'admin/js/instaplug-side-menu.js', array('jquery'), '1.0.0', true);

        //Localize GraphQL endpoint
        wp_localize_script('lwip-admin-side-menu-script', 'lwip_connect', array(
            'graphqlEndpoint' => LWIP_GRAPHQL_ENDPOINT,
        ));
    }

    /**
     * Load the user profile page for the plugin.
     *
     * This method includes the user profile template file.
     */
    public function lwip_user_profile()
    {
        require_once LWIP_PLUGIN_DIR . 'template/instaplug-user-profile.php';
    }

    /**
     * Load the premium plan page for the plugin.
     *
     * This method includes the premium plan template file.
     */
    public function lwip_premium_plan()
    {
        require_once LWIP_PLUGIN_DIR . 'template/instaplug-premium-plan.php';
    }

    /**
     * Load Localisation files.
     */
    public function lwip_load_text_domain()
    {
        load_plugin_textdomain('social-media-feed-widget', false, LWIP_PLUGIN_DIR . '/languages');
    }

    /**
     * Handle new multisite blog creation.
     *
     * This method is triggered when a new site is created in a multisite network.
     * It switches to the context of the newly created blog, initiates the creation
     * of necessary plugin tables, and then restores the original blog context.
     *
     * @param WP_Site $site    The site object for the newly created blog.
     * @param int     $user_id The user ID of the user who created the blog.
     * @since 1.1.0
     */
    public function lwip_new_multisite_blog($site, $user_id)
    {
        require_once LWIP_PLUGIN_DIR . 'includes/class-lwip-instaplug-management-activator.php';

        $blog_id = $site->blog_id;
        switch_to_blog($blog_id);
        Lwip_Instaplug_Management_Activator::create_tables();
        restore_current_blog();
    }

    /**
     * Get the singleton instance of the class.
     *
     * @since    1.0.0
     * @return Load Singleton instance of the class.
     */
    public static function instance()
    {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}
