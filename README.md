# Flexible Spacer Block

[![Test](https://github.com/t-hamano/flexible-spacer-block/actions/workflows/run-test.yml/badge.svg)](https://github.com/t-hamano/flexible-spacer-block/actions/workflows/run-test.yml)
[![Test and Deploy](https://github.com/t-hamano/flexible-spacer-block/actions/workflows/run-test-and-deploy.yml/badge.svg)](https://github.com/t-hamano/flexible-spacer-block/actions/workflows/run-test-and-deploy.yml)

![Header](https://raw.githubusercontent.com/t-hamano/flexible-spacer-block/main/.wordpress-org/banner-1544x500.png)

Flexible Spacer Block switches the height of the spacer according to the device screen width (breakpoints).
This block has two variable breakpoints, and you can adjust the height of the spacer for smartphones, tablets, and desktops respectively.
The height of the spacers can be changed individually or in batches.
Also available to set "negative space (negative margin)" instead of the normal space.
And this block supports transform from and to core spacer block.

## About negative space

"**Negative space**" narrows the margins both blocks above and below the spacer, and it is also possible to overlap the blocks.
If unintended overlap occurs, add a CSS class named "**fsb-style-show-front**" to the block you want to show in the front.
To apply the CSS class to the block, click on the block on WordPress editor, and check the block settings on the right for the Advanced setting ,then enter the CSS class.

## Screenshot

![On Block Editor](https://raw.githubusercontent.com/t-hamano/flexible-spacer-block/main/.wordpress-org/screenshot-1.png "On Block Editor")
![Setting page](https://raw.githubusercontent.com/t-hamano/flexible-spacer-block/main/.wordpress-org/screenshot-2.png "Setting page")
![Negative space example](https://raw.githubusercontent.com/t-hamano/flexible-spacer-block/main/.wordpress-org/screenshot-3.png "Negative space example")
![Negative space example](https://raw.githubusercontent.com/t-hamano/flexible-spacer-block/main/.wordpress-org/screenshot-4.png "Negative space example")

## How to build

```sh
npm install
npm run build
```

## Filters

### `flexible_spacer_block_breakpoint( $breakpoint, $is_editor )`

Filters media query breakpoints.

#### Parameters

- `$breakpoint`

*(array)* media query breakpoints ( `md` / `sm` ).

- `$is_editor`

*(bool)* Whether it is rendered on the editor.

#### Return

*(array)* New media query breakpoints.

#### Example

```php
function custom_flexible_spacer_block_breakpoint( $breakpoint, $is_editor ) {
	// Override media query breakpoints.
	return array(
		'md' => 1000,
		'sm' => 500,
	);
}
add_filter( 'flexible_spacer_block_breakpoint', 'custom_flexible_spacer_block_breakpoint', 10, 2 );
```

### `flexible_spacer_block_inline_css( $css, $is_editor )`

Filters Generated inline styles.

#### Parameters

- `$css`

*(string)* Generated inline styles.

- `$is_editor`

*(bool)* Whether it is rendered on the editor.

#### Return

*(string)* New inline styles.

#### Example

```php
function custom_flexible_spacer_block_inline_css( $css, $is_editor ) {
	// Override z-index value for negative space on the front-end.
	if ( ! $is_editor ) {
		return str_replace( 'z-index:2;', 'z-index:5;', $css );
	}
	return $css;
}
add_filter( 'flexible_spacer_block_inline_css', 'custom_flexible_spacer_block_inline_css', 10, 2 );
```

## Resources

### Image for screenshot

- License: CC0 Public Domain
- Source: <https://pxhere.com/ja/photo/245>

## Author

[Aki Hamano (Github)](https://github.com/t-hamano)
