<?php
/**
 * Plugin Name: Flexible Spacer Block
 * Description: Add white space between blocks and customize its height for each device.
 * Version: 1.1.8
 * Author: Tetsuaki Hamano
 * Author URI: https://github.com/t-hamano
 * License: GPL2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: flexible-spacer-block
 * @package flexible-spacer-block
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

defined( 'ABSPATH' ) || exit;

define( 'FSB_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'FSB_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'FSB_BASENAME', plugin_basename( __FILE__ ) );

// Default Breakpoint setting values
const FSB_BREAKPOINT_MD  = 1024;
const FSB_BREAKPOINT_SM  = 599;
const FSB_BREAKPOINT_MIN = 200;
const FSB_BREAKPOINT_MAX = 2000;

require_once __DIR__ . '/classes/class-init.php';
new flexible_spacer_block\Init();
