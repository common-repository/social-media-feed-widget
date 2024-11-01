<?php

class Lwip_InstaPlug_Management
{
    /**
     * Define the core functionality of the plugin.
     *
     * Set the plugin name and the plugin version that can be used throughout the plugin.
     * Load the dependencies, define the locale, and set the hooks for the admin area and
     * the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function __construct()
    {
        $this->load_dependencies();
        $this->init();
    }

    /**
     * Load the required dependencies for this plugin.
     *
     * This function includes the necessary files that contain the classes 
     * responsible for the core functionality of the plugin.
     */
    private function load_dependencies()
    {
        /** 
         * Include the main loader class for the plugin.
         */
        require_once LWIP_PLUGIN_DIR . '/includes/class-lwip-instaplug-load.php';

        /** 
         * Include the helper functions class.
         */
        require_once LWIP_PLUGIN_DIR . '/includes/class-lwip-instaplug-ajax-functions.php';

        /** 
         * Include the shortcode handler functions class.
         */
        require_once LWIP_PLUGIN_DIR . '/includes/class-lwip-instaplug-shortcode-handler.php';
    }

    /**
     * Init class
     *
     * @since    1.0.0
     */
    public static function init()
    {
        /* This class is responsible for orchestrating the hooks and 
        * the overall structure of the plugin.*/
        Lwip_Instaplug_Load::instance();

        /*  This class contains various utility functions that assist in 
        *  different operations within the plugin.*/
        Lwip_Instaplug_Ajax_Management::init();

        /* This class contains functions to manage and process shortcodes.
        * Shortcodes allow users to use simple macros to add dynamic content 
        * within WordPress posts, pages, and widgets.*/
        Lwip_InstaPlug_Shortcode_Handler::init();
    }
}
