<?php

/**
 * Social Media feed Widget Uninstall 
 *
 * Uninstalling the plugin will remove all data related to the social-media-feed-widget plugin. 
 *
 * @link       https://logicwind.com
 * @since      1.0.0
 * 
 * @package social-media-feed-widget\Uninstaller 
 * 
 */

// If uninstall not called from WordPress, then exit.
if (!defined('WP_UNINSTALL_PLUGIN')) {
    die();
}

function lwip_drop_plugin_tables()
{
    global $wpdb;

    /**
     *  It's good practice to use coding standards and document why certain coding standards are ignored in this context.
     *  In this case, the @codingStandardsIgnoreStart and @codingStandardsIgnoreEnd annotations are used
     *  to temporarily ignore coding standards checks for the following block of code
     *  because we are directly dropping custom tables that are specific to our plugin.
     *  */

    // @codingStandardsIgnoreStart;
    // These tables are specific to our plugin and will be removed during uninstallation.
    // Drop tables if they exist
    $feed_table = $wpdb->prefix . 'lwip_feeds';
    $user_table = $wpdb->prefix . 'lwip_users';

    $wpdb->query("DROP TABLE IF EXISTS $feed_table");
    $wpdb->query("DROP TABLE IF EXISTS $user_table");
    // @codingStandardsIgnoreEnd
}

// Check if the site is part of a multisite network and handle uninstall accordingly
if (is_multisite()) {
    /**
     * Loop through each site in the network and drop plugin tables.
     *
     * If the plugin is being uninstalled in a multisite setup, this loop ensures
     * that the custom tables are removed from each individual site. The
     * `switch_to_blog()` function switches the context to each site's database,
     * allowing for specific site operations, and `restore_current_blog()` restores
     * the main context after each iteration.
     */
    $sites = get_sites();
    foreach ($sites as $site) {
        switch_to_blog($site->blog_id);
        lwip_drop_plugin_tables();
        restore_current_blog();
    }
} else {
    // Single site - drop tables on the current site only
    lwip_drop_plugin_tables();
}
