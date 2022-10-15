<?php
/**
 * @package Flexible_Spacer_Block
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Flexible_Spacer_Block;

class Enqueue {

	/**
	 * Constructor
	 */
	function __construct() {
		// Register block
		add_action( 'init', array( $this, 'register_block' ) );

		// Enqueue front-end inline styles
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		// Enqueue block editor scripts
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_scripts' ) );

		// Enqueue admin option page scripts
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
	}

	/**
	 * Register block
	 */
	public function register_block() {
		register_block_type( FSB_PATH . '/build' );
	}

	/**
	 * Enqueue front-end scripts
	 */
	public function enqueue_scripts() {
		wp_register_style( FSB_HANDLE, false );
		wp_enqueue_style( FSB_HANDLE );
		wp_add_inline_style( FSB_HANDLE, $this->create_inline_style( false ) );
	}

	/**
	 * Enqueue block editor scripts
	 */
	public function enqueue_editor_scripts() {
		wp_add_inline_style( FSB_HANDLE, $this->create_inline_style( true ) );
		wp_localize_script( FSB_HANDLE . '-editor-script', 'fsbConf', $this->create_editor_config() );
		wp_set_script_translations( FSB_HANDLE, FSB_HANDLE );
	}

	/**
	 * Enqueue admin option page scripts
	 */
	public function admin_enqueue_scripts( $hook ) {
		if ( false === strpos( $hook, 'flexible-spacer-block' ) ) {
			return;
		}
		wp_enqueue_style( FSB_HANDLE, FSB_URL . '/build/admin.css' );
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

		$breakpoint = get_option( 'flexible_spacer_block_breakpoint', $defaults );

		/**
		 * Filters media query breakpoints.
		 *
		 * @since 1.3.0
		 *
		 * @param array $breakpoint media query breakpoints.
		 * @param bool $is_editor Whether it is rendered on the editor.
		 */
		$breakpoint = apply_filters( 'flexible_spacer_block_breakpoint', $breakpoint, $is_editor );

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

		$css = self::minify_css( $css );

		/**
		 * Filters Generated inline styles.
		 *
		 * @since 1.3.0
		 *
		 * @param string $css Generated inline styles.
		 * @param bool $is_editor Whether it is rendered on the editor.
		 */
		return apply_filters( 'flexible_spacer_block_inline_css', $css, $is_editor );
	}

	/**
	 * Minify CSS
	 *
	 * @return string
	 */
	private function minify_css( $css ) {
		$replaces = array();

    // phpcs:disable Generic.Formatting.MultipleStatementAlignment
		$replaces['/@charset [^;]+;/'] = '';
		$replaces['/([\s:]url\()[\"\']([^\"\']+)[\"\'](\)[\s;}])/'] = '${1}${2}${3}';
		$replaces['/(\/\*(?=[!]).*?\*\/|\"(?:(?!(?<!\\\)\").)*\"|\'(?:(?!(?<!\\\)\').)*\')|\s+/'] = '${1} ';
		$replaces['/(\/\*(?=[!]).*?\*\/|\"(?:(?!(?<!\\\)\").)*\"|\'(?:(?!(?<!\\\)\').)*\')|\/\*.*?\*\/|\s+([:])\s+|\s+([)])|([(:])\s+/s'] = '${1}${2}${3}${4}';
		$replaces['/\s*(\/\*(?=[!]).*?\*\/|\"(?:(?!(?<!\\\)\").)*\"|\'(?:(?!(?<!\\\)\').)*\'|[ :]calc\([^;}]+\)[ ;}]|[!$&+,\/;<=>?@^_{|}~]|\A|\z)\s*/s'] = '${1}';
    // phpcs:enable

		$css = preg_replace( array_keys( $replaces ), array_values( $replaces ), $css );
		return $css;
	}
}

new Enqueue();
