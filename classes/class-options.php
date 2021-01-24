<?php
/**
 * @package responsive-spacer-block
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

class Options {

	private $options;

	/**
	 * Constructor
	 */
	public function __construct() {
		// Add option page
		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
		// Initialize option page
		add_action( 'admin_init', array( $this, 'init_options_page' ) );
	}

	/**
	 * Add option page
	 */
	public function add_options_page() {
		add_options_page(
			__( 'Responsive Spacer Block', 'responsive-spacer-block' ),
			__( 'Responsive Spacer Block', 'responsive-spacer-block' ),
			'manage_options',
			'responsive-spacer-block-option',
			array( $this, 'create_options_page' )
		);
	}

	/**
	 * Initialize option page
	 */
	public function init_options_page() {
		register_setting(
			'responsive-spacer-block-group',
			'responsive_spacer_block_breakpoint',
			array( $this, 'sanitize_breakpoint' )
		);

		register_setting(
			'responsive-spacer-block-group',
			'responsive_spacer_block_show_block',
			array( $this, 'sanitize_checkbox' )
		);

		add_settings_section(
			'responsive_spacer_block_section',
			'',
			'',
			'responsive-spacer-block-group'
		);

		add_settings_field(
			'responsive_spacer_block_breakpoint_field',
			__( 'Device Setting', 'responsive-spacer-block' ),
			array( $this, 'responsive_spacer_block_breakpoint_display_field' ),
			'responsive-spacer-block-group',
			'responsive_spacer_block_section'
		);

		add_settings_field(
			'responsive_spacer_block_editor_field',
			__( 'Block Editor Setting', 'responsive-spacer-block' ),
			array( $this, 'responsive_spacer_block_editor_display_field' ),
			'responsive-spacer-block-group',
			'responsive_spacer_block_section'
		);
	}

	/**
	 * Create option page
	 */
	public function create_options_page() {
		$this->options = get_option( 'responsive_spacer_block_breakpoint' );
		?>
		<div class="wrap">
			<h1><?php _e( 'Responsive Spacer Block', 'responsive-spacer' ); ?></h1>
			<form class="rsb-option-form" method="post" action="options.php">
				<?php
				settings_fields( 'responsive-spacer-block-group' );
				do_settings_sections( 'responsive-spacer-block-group' );
				submit_button();
				?>
			</form>
		</div>
		<?php
	}

	/**
	 * Display field (Device Setting)
	 */
	public function responsive_spacer_block_breakpoint_display_field() {
		$breakpoint_sm = isset( $this->options['sm'] ) ? $this->options['sm'] : RSB_BREAKPOINT_SM;
		$breakpoint_md = isset( $this->options['md'] ) ? $this->options['md'] : RSB_BREAKPOINT_MD;
		?>
		<div class="rsb-option-breakpoint">
			<div class="rsb-option-breakpoint__device">
				<span class="dashicons dashicons-smartphone"></span><?php _e( 'Mobile', 'responsive-spacer-block' ); ?>
			</div>
			<span class="rsb-option-breakpoint__sign">&le;</span>
			<div class="rsb-option-breakpoint__input">
				<input type="number" name="responsive_spacer_block_breakpoint[sm]" min="<?php echo RSB_BREAKPOINT_MIN; ?>" max="<?php echo RSB_BREAKPOINT_MAX; ?>" value="<?php echo esc_attr( $breakpoint_sm ); ?>">
				<span class="rsb-option-breakpoint__unit">px</span>
			</div>
			<span class="rsb-option-breakpoint__sign">&lt;</span>
			<div class="rsb-option-breakpoint__device">
				<span class="dashicons dashicons-tablet"></span><?php _e( 'Tablet', 'responsive-spacer-block' ); ?>
			</div>
			<span class="rsb-option-breakpoint__sign">&le;</span>
			<div class="rsb-option-breakpoint__input">
				<input type="number" name="responsive_spacer_block_breakpoint[md]" min="<?php echo RSB_BREAKPOINT_MIN; ?>" max="<?php echo RSB_BREAKPOINT_MAX; ?>" value="<?php echo esc_attr( $breakpoint_md ); ?>">
				<span class="rsb-option-breakpoint__unit">px</span>
			</div>
			<span class="rsb-option-breakpoint__sign">&lt;</span>
			<div class="rsb-option-breakpoint__device">
				<span class="dashicons dashicons-desktop"></span><?php _e( 'Desktop', 'responsive-spacer-block' ); ?>
			</div>
		</div>
		<p><?php _e( 'Enter the screen width (breakpoint) that will be the basis for switching between each device.', 'responsive-spacer-block' ); ?></p>
		<p><?php _e( 'If both values are the same, The spacer setting for tablets will be disabled.', 'responsive-spacer-block' ); ?></p>
		<?php
	}

	/**
	 * Display field (Block Editor Setting)
	 */
	public function responsive_spacer_block_editor_display_field() {
		?>
		<fieldset>
			<label>
				<input type="checkbox" name="responsive_spacer_block_show_block" value="1" <?php checked( get_option( 'responsive_spacer_block_show_block', false ) ); ?>><?php _e( 'Always show blocks in block editor editor content area', 'responsive-spacer-block' ); ?>
			</label>
		</fieldset>
		<?php
	}

	/**
	 * Sanitizer (breakpoint)
	 * @param array $input input values.
	 *
	 * @return array
	 */
	public function sanitize_breakpoint( $input ) {
		$this->options = get_option( 'responsive_spacer_block_breakpoint' );

		$new_input = array();

		$breakpoint_md = isset( $input['md'] ) ? absint( $input['md'] ) : '';
		$breakpoint_sm = isset( $input['sm'] ) ? absint( $input['sm'] ) : '';

		if ( 0 === $breakpoint_md || 0 === $breakpoint_sm ) {
			add_settings_error(
				'responsive-spacer-block-breakpoint',
				'responsive-spacer-block-breakpoint-null',
				__( 'Fill in both fields in Device Setting.', 'responsive-spacer-block' )
			);
			$new_input = array(
				'md' => isset( $this->options['md'] ) ? $this->options['md'] : '',
				'sm' => isset( $this->options['sm'] ) ? $this->options['sm'] : '',
			);
		} elseif ( $breakpoint_md < $breakpoint_sm ) {
			add_settings_error(
				'responsive-spacer-block-breakpoint',
				'responsive-spacer-block-breakpoint-compare',
				__( 'The Device Width Setting value in the left field must be equal to or smaller than the value in the right field.', 'responsive-spacer-block' )
			);
			$new_input = array(
				'md' => isset( $this->options['md'] ) ? $this->options['md'] : '',
				'sm' => isset( $this->options['sm'] ) ? $this->options['sm'] : '',
			);
		} else {
			$new_input = array(
				'md' => min( max( $breakpoint_md, RSB_BREAKPOINT_MIN ), RSB_BREAKPOINT_MAX ),
				'sm' => min( max( $breakpoint_sm, RSB_BREAKPOINT_MIN ), RSB_BREAKPOINT_MAX ),
			);
		}
		return $new_input;
	}

	/**
	 * Sanitizer (Chechbox)
	 * @param string $value input value.
	 *
	 * @return boolean
	 */
	public static function sanitize_checkbox( $value ) {
		return ( isset( $value ) ? true : false );
	}
}

if ( is_admin() ) {
	new Options();
}