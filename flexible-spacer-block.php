<?php
/**
 * Plugin Name: Flexible Spacer Block
 * Description: Add white space between blocks and customize its height for each device.
 * Requires at least: 7.1
 * Requires PHP: 8.2
 * Version: 2.10.0
 * Author: Aki Hamano
 * Author URI: https://github.com/t-hamano
 * License: GPL2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: flexible-spacer-block
 * @package Flexible_Spacer_Block
 * @author Aki Hamano
 * @license GPL-2.0+
 */

defined( 'ABSPATH' ) || exit;

define( 'FLEXIBLE_SPACER_BLOCK_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'FLEXIBLE_SPACER_BLOCK_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'FLEXIBLE_SPACER_BLOCK_BASENAME', plugin_basename( __FILE__ ) );
define( 'FLEXIBLE_SPACER_BLOCK_HANDLE', 'fsb-flexible-spacer' );

// Default Breakpoint setting values
const FLEXIBLE_SPACER_BLOCK_BREAKPOINT_MD  = 1024;
const FLEXIBLE_SPACER_BLOCK_BREAKPOINT_SM  = 599;
const FLEXIBLE_SPACER_BLOCK_BREAKPOINT_MIN = 200;
const FLEXIBLE_SPACER_BLOCK_BREAKPOINT_MAX = 2000;

// Range of values
const FLEXIBLE_SPACER_BLOCK_MIN_SPACER_HEIGHT = 0;
const FLEXIBLE_SPACER_BLOCK_MAX_SPACER_HEIGHT = 500;

// Default spacer height
const FLEXIBLE_SPACER_BLOCK_DEFAULT_SPACER_HEIGHT      = 100;
const FLEXIBLE_SPACER_BLOCK_DEFAULT_SPACER_HEIGHT_UNIT = 'px';

require_once __DIR__ . '/classes/class-init.php';
new Flexible_Spacer_Block\Init();
