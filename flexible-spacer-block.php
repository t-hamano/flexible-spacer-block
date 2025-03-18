<?php
/**
 * Plugin Name: Flexible Spacer Block
 * Description: Add white space between blocks and customize its height for each device.
 * Requires at least: 6.6
 * Requires PHP: 7.4
 * Version: 2.6.0
 * Author: Aki Hamano
 * Author URI: https://github.com/t-hamano
 * License: GPL2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: flexible-spacer-block
 * @package Flexible_Spacer_Block
 * @author Aki Hamano
 * @license GPL-2.0+
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

defined( 'ABSPATH' ) || exit;

define( 'FSB_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'FSB_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'FSB_BASENAME', plugin_basename( __FILE__ ) );
define( 'FSB_HANDLE', 'fsb-flexible-spacer' );

// Default Breakpoint setting values
const FSB_BREAKPOINT_MD  = 1024;
const FSB_BREAKPOINT_SM  = 599;
const FSB_BREAKPOINT_MIN = 200;
const FSB_BREAKPOINT_MAX = 2000;

// Range of values
const FSB_MIN_SPACER_HEIGHT = 0;
const FSB_MAX_SPACER_HEIGHT = 500;

// Default spacer height
const FSB_DEFAULT_SPACER_HEIGHT      = 100;
const FSB_DEFAULT_SPACER_HEIGHT_UNIT = 'px';

require_once __DIR__ . '/classes/class-init.php';
new Flexible_Spacer_Block\Init();
