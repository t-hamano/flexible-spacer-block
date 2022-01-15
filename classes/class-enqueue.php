<?php
/**
 * @package Flexible_Spacer_Block
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace Flexible_Spacer_Block;

class Enqueue {

	/**
	 * Constructor
	 */
	function __construct() {
		// Enqueue front-end inline styles
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		// Enqueue block editor scripts
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_scripts' ) );

		// Enqueue admin option page scripts
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );

		// Register block
		add_action( 'init', array( $this, 'register_block' ) );
	}

	/**
	 * Enqueue front-end scripts
	 */
	public function enqueue_scripts() {
		wp_register_style( 'fsb-flexible-spacer-style', false );
		wp_enqueue_style( 'fsb-flexible-spacer-style' );
		wp_add_inline_style( 'fsb-flexible-spacer-style', $this->create_inline_style( false ) );
	}

	/**
	 * Enqueue block editor scripts
	 */
	public function enqueue_editor_scripts() {
		$asset_file = include( FSB_PATH . '/build/js/index.asset.php' );

		wp_enqueue_style(
			'fsb-flexible-spacer-editor-style',
			FSB_URL . '/build/css/editor-style.css',
			array(),
			filemtime( FSB_PATH . '/build/css/editor-style.css' )
		);

		wp_add_inline_style( 'fsb-flexible-spacer-editor-style', $this->create_inline_style( true ) );

		wp_enqueue_script(
			'fsb-flexible-spacer-editor-script',
			FSB_URL . '/build/js/index.js',
			$asset_file['dependencies'],
			filemtime( FSB_PATH . '/build/js/index.js' )
		);

		wp_localize_script( 'fsb-flexible-spacer-editor-script', 'fsbConf', $this->create_editor_config() );
		wp_set_script_translations( 'fsb-flexible-spacer-editor-script', 'flexible-spacer-block' );
	}

	/**
	 * Enqueue admin option page scripts
	 */
	public function admin_enqueue_scripts( $hook ) {
		if ( false === strpos( $hook, 'flexible-spacer-block' ) ) {
			return;
		}
		wp_enqueue_style( 'flexible-spacer-block-option', FSB_URL . '/build/css/admin-style.css' );
	}

	/**
	 * Register block
	 */
	public function register_block() {
		register_block_type_from_metadata( FSB_PATH . '/src/' );
	}

	/**
	 * Generate settings to be passed to the block editor
	 *
	 * @return array
	 */
	private function create_editor_config() {
		$breakpoint_defaults = array(
			'md' => FSB_BREAKPOINT_MD,
			'sm' => FSB_BREAKPOINT_SM,
		);

		$config = array(
			'breakpoint' => get_option( 'flexible_spacer_block_breakpoint', $breakpoint_defaults ),
			'showBlock'  => get_option( 'flexible_spacer_block_show_block', false ),
		);

		return $config;
	}

	/**
	 * Generate inline styles to be passed to the block editor and front-end
	 *
	 * @return string
	 */
	private function create_inline_style( $is_editor = true ) {
		// Generate media query breakpoints.
		$defaults = array(
			'md' => FSB_BREAKPOINT_MD,
			'sm' => FSB_BREAKPOINT_SM,
		);

		$breakpoint        = get_option( 'flexible_spacer_block_breakpoint', $defaults );
		$breakpoint_lg_min = $breakpoint['md'] + 1;
		$breakpoint_md_max = $breakpoint['md'];
		$breakpoint_md_min = $breakpoint['sm'] + 1;
		$breakpoint_sm_max = $breakpoint['sm'];

		$css = '';

		if ( $is_editor ) {
			// Editor inline styles.
			$css .= <<<EOM
			@media screen and (min-width:{$breakpoint_lg_min}px) {
				.fsb-flexible-spacer--is-responsive .fsb-flexible-spacer__device--md,
				.fsb-flexible-spacer--is-responsive .fsb-flexible-spacer__device--sm {
					display: none;
				}
			}
			EOM;

			if ( $breakpoint['md'] !== $breakpoint['sm'] ) {
				$css .= <<<EOM
				@media screen and (min-width:{$breakpoint_md_min}px) and (max-width:{$breakpoint_md_max}px) {
					.fsb-flexible-spacer--is-responsive .fsb-flexible-spacer__device--lg,
					.fsb-flexible-spacer--is-responsive .fsb-flexible-spacer__device--sm {
						display: none;
					}
				}
				EOM;
			}

			$css .= <<<EOM
			@media screen and (max-width:{$breakpoint_sm_max}px) {
				.fsb-flexible-spacer--is-responsive .fsb-flexible-spacer__device--lg,
				.fsb-flexible-spacer--is-responsive .fsb-flexible-spacer__device--md {
					display: none;
				}
			}
			EOM;
		} else {
			// Fonrt-end inline styles.
			$css .= <<<EOM
			.fsb-style-show-front {
				position: relative;
				z-index: 2;
			}
			EOM;

			$css .= <<<EOM
			@media screen and (min-width:{$breakpoint_lg_min}px) {
				.fsb-flexible-spacer__device--md,
				.fsb-flexible-spacer__device--sm {
					display: none;
				}
			}
			EOM;

			if ( $breakpoint['md'] !== $breakpoint['sm'] ) {
				$css .= <<<EOM
				@media screen and (min-width:{$breakpoint_md_min}px) and (max-width:{$breakpoint_md_max}px) {
					.fsb-flexible-spacer__device--lg,
					.fsb-flexible-spacer__device--sm {
						display: none;
					}
				}
				EOM;
			}

			$css .= <<<EOM
			@media screen and (max-width:{$breakpoint_sm_max}px) {
				.fsb-flexible-spacer__device--lg,
				.fsb-flexible-spacer__device--md {
					display: none;
				}
			}
			EOM;
		}

		return $css;
	}
}

new Enqueue();
