<?php
/*
* Plugin Name: Social Media Feed Widget
* Plugin URI: https://instaplug.app/
* Description: A tool for embedding Instagram media feeds on your WordPress website, enhancing user engagement and social media presence with live, interactive content.
* Version: 1.1.0
* Author: Logicwind
* Author URI: https://www.logicwind.com/
* License: GPLv2 or later
* Text Domain: social-media-feed-widget
* Domain Path:/languages

* Copyright 2024 Logicwind Ventures Private Limited  (email : support@logicwind.com)
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 2 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program; if not, write to the Free Software
* Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

if (!defined('WPINC')) {
    die;
}
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Define constants for the social-media-feed-widget plugin, including plugin name, version,
 * file paths, URLs, and other configuration settings. These constants provide
 * essential information and endpoints used throughout the plugin, such as the
 * GraphQL API endpoint and admin URL. The constants also include placeholders
 * for various URLs related to reviews, demos, premium sales, support, and documentation.
 */
define('LWIP_PLUGIN_NAME', 'Social Media Feed Widget');
define('LWIP_PLUGIN_VERSION', '1.1.0');
define('LWIP_PLUGIN_FILE', __FILE__);
define('LWIP_PLUGIN_DIR', __DIR__ . DIRECTORY_SEPARATOR);
define('LWIP_PLUGIN_PATH', plugin_dir_url(__FILE__));
define('LWIP_DOMAIN', 'LWIP');
define('LWIP_PREFIX', LWIP_DOMAIN);
define('LWIP_WORDPRESS_URL', '');
define('LWIP_REVIEW_URL', '');
define('LWIP_DEMO_URL', '');
define('LWIP_PREMIUM_SELL_URL', '');
define('LWIP_SUPPORT_URL', '');
define('LWIP_DOCUMENTATION_URL', '');
define('LWIP_GROUP_URL', '');
define('LWIP_DEVELOPER', false);
define('LWIP_GRAPHQL_ENDPOINT', 'https://server.instaplug.app/api/graphql');
define('LWIP_SCRIPT_ENDPOINT', 'https://app.instaplug.app/');
define('LWIP_ADMIN_URL', admin_url('admin.php?page=lwip_feed_builder'));

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-wc-tenant-management-activator.php
 * 
 * @param    bool    $network_wide    Whether the plugin is being activated network-wide.
 */
function lwip_activate_instaplug_management($network_wide)
{
    require_once plugin_dir_path(__FILE__) . 'includes/class-lwip-instaplug-management-activator.php';
    Lwip_Instaplug_Management_Activator::lwip_activate($network_wide);
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-wc-tenant-management-deactivator.php
 */
function lwip_deactivate_instaplug_management($network_wide)
{
    require_once plugin_dir_path(__FILE__) . 'includes/class-lwip-instaplug-management-deactivator.php';
    Lwip_Instaplug_Management_Deactivator::lwip_deactivate($network_wide);
}

register_activation_hook(__FILE__, 'lwip_activate_instaplug_management');
register_deactivation_hook(__FILE__, 'lwip_deactivate_instaplug_management');
/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require LWIP_PLUGIN_DIR . 'includes/class-lwip-instaplug-management.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function lwip_run_instaplug_management()
{
    new Lwip_InstaPlug_Management();
}
lwip_run_instaplug_management();
