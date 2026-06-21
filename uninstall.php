<?php
/**
 * @package Flexible_Spacer_Block
 * @author Aki Hamano
 * @license GPL-2.0+
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

delete_option( 'flexible_spacer_block_breakpoint' );
delete_option( 'flexible_spacer_block_default_value' );
delete_option( 'flexible_spacer_block_show_block' );
