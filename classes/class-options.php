<?php
/**
 * @package Flexible_Spacer_Block
 * @author Aki Hamano
 * @license GPL-2.0+
 */

namespace Flexible_Spacer_Block;

class Options {

	private $breakpoints;
	private $default_value;

	private $units = array(
		'px',
		'%',
		'em',
		'rem',
		'vw',
		'vh',
	);

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
			__( 'Flexible Spacer Block', 'flexible-spacer-block' ),
			__( 'Flexible Spacer Block', 'flexible-spacer-block' ),
			'manage_options',
			'flexible-spacer-block-option',
			array( $this, 'create_options_page' )
		);
	}

	/**
	 * Initialize option page
	 */
	public function init_options_page() {
		register_setting(
			'flexible-spacer-block-group',
			'flexible_spacer_block_breakpoint',
			array( $this, 'sanitize_breakpoint' )
		);

		register_setting(
			'flexible-spacer-block-group',
			'flexible_spacer_block_default_value',
			array( $this, 'sanitize_default_value' )
		);

		register_setting(
			'flexible-spacer-block-group',
			'flexible_spacer_block_show_block',
			array( $this, 'sanitize_checkbox' )
		);

		add_settings_section(
			'flexible_spacer_block_section',
			'',
			'',
			'flexible-spacer-block-group'
		);

		add_settings_field(
			'flexible_spacer_block_breakpoint_field',
			__( 'Responsive Setting', 'flexible-spacer-block' ),
			array( $this, 'flexible_spacer_block_breakpoint_display_field' ),
			'flexible-spacer-block-group',
			'flexible_spacer_block_section'
		);

		add_settings_field(
			'flexible_spacer_block_default_value_field',
			__( 'Default Values', 'flexible-spacer-block' ),
			array( $this, 'flexible_spacer_block_default_value_display_field' ),
			'flexible-spacer-block-group',
			'flexible_spacer_block_section'
		);

		add_settings_field(
			'flexible_spacer_block_editor_field',
			__( 'Block Editor Setting', 'flexible-spacer-block' ),
			array( $this, 'flexible_spacer_block_editor_display_field' ),
			'flexible-spacer-block-group',
			'flexible_spacer_block_section'
		);
	}

	/**
	 * Create option page
	 */
	public function create_options_page() {
		$this->breakpoints   = get_option( 'flexible_spacer_block_breakpoint' );
		$this->default_value = get_option( 'flexible_spacer_block_default_value' );
		?>
		<div class="wrap">
			<h1><?php _e( 'Flexible Spacer Block', 'flexible-spacer-block' ); ?></h1>
			<form class="fsb-option-form" method="post" action="options.php">
				<?php
				settings_fields( 'flexible-spacer-block-group' );
				do_settings_sections( 'flexible-spacer-block-group' );
				?>
				<h2><?php _e( 'About Negative Space', 'flexible-spacer-block' ); ?></h2>
				<ul>
					<li><?php _e( '"<strong>Negative space</strong>" narrows the margins both blocks above and below the spacer, and it is also possible to overlap the blocks.', 'flexible-spacer-block' ); ?></li>
					<li><?php _e( 'If unintended overlap occurs, <strong>add a CSS class</strong> named <code>fsb-style-show-front</code> to the block you want to show in the front.', 'flexible-spacer-block' ); ?></li>
					<li><?php _e( 'To apply the CSS class to the block, click on the block on WordPress editor, and check the block settings on the right for the Advanced setting ,then enter the CSS class.', 'flexible-spacer-block' ); ?></li>
				</ul>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Display field (Responsive Setting)
	 */
	public function flexible_spacer_block_breakpoint_display_field() {
		$breakpoint_sm = isset( $this->breakpoints['sm'] ) ? $this->breakpoints['sm'] : FSB_BREAKPOINT_SM;
		$breakpoint_md = isset( $this->breakpoints['md'] ) ? $this->breakpoints['md'] : FSB_BREAKPOINT_MD;
		?>
		<div class="fsb-option-breakpoint">
			<div class="fsb-option-breakpoint__device">
				<svg viewBox="0 0 24 24" width="48" height="48"><path d="M15 4H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H9c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h6c.3 0 .5.2.5.5v12zm-4.5-.5h2V16h-2v1.5z"></path></svg>
				<?php _e( 'Mobile', 'flexible-spacer-block' ); ?>
			</div>
			<span class="fsb-option-breakpoint__sign">&le;</span>
			<div class="fsb-option-breakpoint__input">
				<input type="number" name="flexible_spacer_block_breakpoint[sm]" min="<?php echo FSB_BREAKPOINT_MIN; ?>" max="<?php echo FSB_BREAKPOINT_MAX; ?>" value="<?php echo esc_attr( $breakpoint_sm ); ?>">
				<span>px</span>
			</div>
			<span class="fsb-option-breakpoint__sign">&lt;</span>
			<div class="fsb-option-breakpoint__device">
				<svg viewBox="0 0 24 24" width="48" height="48"><path d="M17 4H7c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H7c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h10c.3 0 .5.2.5.5v12zm-7.5-.5h4V16h-4v1.5z"></path></svg>
				<?php _e( 'Tablet', 'flexible-spacer-block' ); ?>
			</div>
			<span class="fsb-option-breakpoint__sign">&le;</span>
			<div class="fsb-option-breakpoint__input">
				<input type="number" name="flexible_spacer_block_breakpoint[md]" min="<?php echo FSB_BREAKPOINT_MIN; ?>" max="<?php echo FSB_BREAKPOINT_MAX; ?>" value="<?php echo esc_attr( $breakpoint_md ); ?>">
				<span>px</span>
			</div>
			<span class="fsb-option-breakpoint__sign">&lt;</span>
			<div class="fsb-option-breakpoint__device">
				<svg viewBox="0 0 24 24" width="48" height="48"><path d="M20.5 16h-.7V8c0-1.1-.9-2-2-2H6.2c-1.1 0-2 .9-2 2v8h-.7c-.8 0-1.5.7-1.5 1.5h20c0-.8-.7-1.5-1.5-1.5zM5.7 8c0-.3.2-.5.5-.5h11.6c.3 0 .5.2.5.5v7.6H5.7V8z"></path></svg>
				<?php _e( 'Desktop', 'flexible-spacer-block' ); ?>
			</div>
		</div>
		<ul>
			<li><?php _e( 'Enter the screen width (breakpoint) that will be the basis for switching between each device.', 'flexible-spacer-block' ); ?></li>
			<li><?php _e( 'If both values are the same, The spacer setting for tablets will be disabled.', 'flexible-spacer-block' ); ?></li>
		</ul>
		<?php
	}


	/**
	 * Display field (Default Values)
	 */
	public function flexible_spacer_block_default_value_display_field() {
		$default_value_sm = isset( $this->default_value['sm'] ) ? $this->default_value['sm'] : FSB_DEFAULT_SPACER_HEIGHT;
		$default_value_md = isset( $this->default_value['md'] ) ? $this->default_value['md'] : FSB_DEFAULT_SPACER_HEIGHT;
		$default_value_lg = isset( $this->default_value['lg'] ) ? $this->default_value['lg'] : FSB_DEFAULT_SPACER_HEIGHT;

		$default_value_sm_unit = isset( $this->default_value['sm_unit'] ) ? $this->default_value['sm_unit'] : FSB_DEFAULT_SPACER_HEIGHT_UNIT;
		$default_value_md_unit = isset( $this->default_value['md_unit'] ) ? $this->default_value['md_unit'] : FSB_DEFAULT_SPACER_HEIGHT_UNIT;
		$default_value_lg_unit = isset( $this->default_value['lg_unit'] ) ? $this->default_value['lg_unit'] : FSB_DEFAULT_SPACER_HEIGHT_UNIT;
		?>
		<div class="fsb-option-default-values">
			<div class="fsb-option-default-values__col">
				<div class="fsb-option-breakpoint__device">
					<svg viewBox="0 0 24 24" width="48" height="48"><path d="M15 4H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H9c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h6c.3 0 .5.2.5.5v12zm-4.5-.5h2V16h-2v1.5z"></path></svg>
					<?php _e( 'Mobile', 'flexible-spacer-block' ); ?>
				</div>
				<div class="fsb-option-default-values__input">
					<input type="number" name="flexible_spacer_block_default_value[sm]" min="<?php echo FSB_MIN_SPACER_HEIGHT; ?>" max="<?php echo FSB_MAX_SPACER_HEIGHT; ?>" value="<?php echo esc_attr( $default_value_sm ); ?>">
					<select name="flexible_spacer_block_default_value[sm_unit]">
						<?php
						foreach ( $this->units as $unit ) {
							if ( $unit === $default_value_sm_unit ) {
								echo '<option value="' . esc_attr( $unit ) . '" selected>' . esc_html( $unit ) . '</option>';
							} else {
								echo '<option value="' . esc_attr( $unit ) . '">' . esc_html( $unit ) . '</option>';
							}
						}
						?>
					</select>
				</div>
			</div>
			<div class="fsb-option-default-values__col">
				<div class="fsb-option-breakpoint__device">
					<svg viewBox="0 0 24 24" width="48" height="48"><path d="M17 4H7c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H7c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h10c.3 0 .5.2.5.5v12zm-7.5-.5h4V16h-4v1.5z"></path></svg>
					<?php _e( 'Tablet', 'flexible-spacer-block' ); ?>
				</div>
				<div class="fsb-option-default-values__input">
					<input type="number" name="flexible_spacer_block_default_value[md]" min="<?php echo FSB_MIN_SPACER_HEIGHT; ?>" max="<?php echo FSB_MAX_SPACER_HEIGHT; ?>" value="<?php echo esc_attr( $default_value_md ); ?>">
					<select name="flexible_spacer_block_default_value[md_unit]">
						<?php
						foreach ( $this->units as $unit ) {
							if ( $unit === $default_value_md_unit ) {
								echo '<option value="' . esc_attr( $unit ) . '" selected>' . esc_html( $unit ) . '</option>';
							} else {
								echo '<option value="' . esc_attr( $unit ) . '">' . esc_html( $unit ) . '</option>';
							}
						}
						?>
					</select>
				</div>
			</div>
			<div class="fsb-option-default-values__col">
				<div class="fsb-option-breakpoint__device">
					<svg viewBox="0 0 24 24" width="48" height="48"><path d="M20.5 16h-.7V8c0-1.1-.9-2-2-2H6.2c-1.1 0-2 .9-2 2v8h-.7c-.8 0-1.5.7-1.5 1.5h20c0-.8-.7-1.5-1.5-1.5zM5.7 8c0-.3.2-.5.5-.5h11.6c.3 0 .5.2.5.5v7.6H5.7V8z"></path></svg>
					<?php _e( 'Desktop', 'flexible-spacer-block' ); ?>
				</div>
				<div class="fsb-option-default-values__input">
					<input type="number" name="flexible_spacer_block_default_value[lg]" min="<?php echo FSB_MIN_SPACER_HEIGHT; ?>" max="<?php echo FSB_MAX_SPACER_HEIGHT; ?>" value="<?php echo esc_attr( $default_value_lg ); ?>">
					<select name="flexible_spacer_block_default_value[lg_unit]">
						<?php
						foreach ( $this->units as $unit ) {
							if ( $unit === $default_value_lg_unit ) {
								echo '<option value="' . esc_attr( $unit ) . '" selected>' . esc_html( $unit ) . '</option>';
							} else {
								echo '<option value="' . esc_attr( $unit ) . '">' . esc_html( $unit ) . '</option>';
							}
						}
						?>
					</select>
				</div>
			</div>
		</div>
		<?php
	}


	/**
	 * Display field (Block Editor Setting)
	 */
	public function flexible_spacer_block_editor_display_field() {
		?>
		<fieldset>
			<label>
				<input type="checkbox" name="flexible_spacer_block_show_block" value="1" <?php checked( get_option( 'flexible_spacer_block_show_block', false ) ); ?>><?php _e( 'Always show blocks in the block editor', 'flexible-spacer-block' ); ?>
			</label>
			<p class="description"><?php _e( 'The block will always be visible even when it is not selected.', 'flexible-spacer-block' ); ?></p>
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
		$this->breakpoints = get_option( 'flexible_spacer_block_breakpoint' );

		$new_input = array();

		$breakpoint_md = isset( $input['md'] ) ? absint( $input['md'] ) : '';
		$breakpoint_sm = isset( $input['sm'] ) ? absint( $input['sm'] ) : '';

		if ( 0 === $breakpoint_md || 0 === $breakpoint_sm ) {
			add_settings_error(
				'flexible-spacer-block-breakpoint',
				'flexible-spacer-block-breakpoint-null',
				__( 'Responsive Setting: Fill in both fields.', 'flexible-spacer-block' )
			);
			$new_input = array(
				'md' => isset( $this->breakpoints['md'] ) ? $this->breakpoints['md'] : FSB_BREAKPOINT_MD,
				'sm' => isset( $this->breakpoints['sm'] ) ? $this->breakpoints['sm'] : FSB_BREAKPOINT_SM,
			);
		} elseif ( $breakpoint_md < $breakpoint_sm ) {
			add_settings_error(
				'flexible-spacer-block-breakpoint',
				'flexible-spacer-block-breakpoint-compare',
				__( 'Responsive Setting: the screen width value in the left field must be equal to or smaller than the value in the right field.', 'flexible-spacer-block' )
			);
			$new_input = array(
				'md' => isset( $this->breakpoints['md'] ) ? $this->breakpoints['md'] : '',
				'sm' => isset( $this->breakpoints['sm'] ) ? $this->breakpoints['sm'] : '',
			);
		} else {
			$new_input = array(
				'md' => min( max( $breakpoint_md, FSB_BREAKPOINT_MIN ), FSB_BREAKPOINT_MAX ),
				'sm' => min( max( $breakpoint_sm, FSB_BREAKPOINT_MIN ), FSB_BREAKPOINT_MAX ),
			);
		}
		return $new_input;
	}

	/**
	 * Sanitizer (default values)
	 * @param array $input input values.
	 *
	 * @return array
	 */
	public function sanitize_default_value( $input ) {
		$this->default_value = get_option( 'flexible_spacer_block_default_value' );

		$new_input = array();

		$default_value_sm = isset( $input['sm'] ) ? absint( $input['sm'] ) : '';
		$default_value_md = isset( $input['md'] ) ? absint( $input['md'] ) : '';
		$default_value_lg = isset( $input['lg'] ) ? absint( $input['lg'] ) : '';

		$default_value_sm_unit = isset( $input['sm_unit'] ) && in_array( $input['sm_unit'], $this->units, true ) ? $input['sm_unit'] : 'px';
		$default_value_md_unit = isset( $input['md_unit'] ) && in_array( $input['md_unit'], $this->units, true ) ? $input['md_unit'] : 'px';
		$default_value_lg_unit = isset( $input['lg_unit'] ) && in_array( $input['lg_unit'], $this->units, true ) ? $input['lg_unit'] : 'px';

		if ( 0 === $default_value_sm || 0 === $default_value_md || 0 === $default_value_lg ) {
			add_settings_error(
				'flexible-spacer-block-default-values',
				'flexible-spacer-block-default-values-null',
				__( 'Default Value: Fill in all fields.', 'flexible-spacer-block' )
			);
			$new_input = array(
				'sm'      => isset( $this->default_value['sm'] ) ? $this->default_value['sm'] : FSB_DEFAULT_SPACER_HEIGHT,
				'md'      => isset( $this->default_value['md'] ) ? $this->default_value['md'] : FSB_DEFAULT_SPACER_HEIGHT,
				'lg'      => isset( $this->default_value['lg'] ) ? $this->default_value['lg'] : FSB_DEFAULT_SPACER_HEIGHT,
				'sm_unit' => isset( $this->default_value['sm_unit'] ) ? $this->default_value['sm_unit'] : FSB_DEFAULT_SPACER_HEIGHT_UNIT,
				'md_unit' => isset( $this->default_value['md_unit'] ) ? $this->default_value['md_unit'] : FSB_DEFAULT_SPACER_HEIGHT_UNIT,
				'lg_unit' => isset( $this->default_value['lg_unit'] ) ? $this->default_value['lg_unit'] : FSB_DEFAULT_SPACER_HEIGHT_UNIT,
			);
		} else {
			$new_input = array(
				'sm'      => min( max( $default_value_sm, FSB_MIN_SPACER_HEIGHT ), FSB_MAX_SPACER_HEIGHT ),
				'md'      => min( max( $default_value_md, FSB_MIN_SPACER_HEIGHT ), FSB_MAX_SPACER_HEIGHT ),
				'lg'      => min( max( $default_value_lg, FSB_MIN_SPACER_HEIGHT ), FSB_MAX_SPACER_HEIGHT ),
				'sm_unit' => $default_value_sm_unit,
				'md_unit' => $default_value_md_unit,
				'lg_unit' => $default_value_lg_unit,
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
