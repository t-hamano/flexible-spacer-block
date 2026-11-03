/**
 * External dependencies
 */
import { vi } from 'vitest';

// Mirror the settings localized by the plugin. The default values differ from the
// block defaults to make sure the saved content does not depend on them.
vi.stubGlobal( 'fsbConf', {
	breakpoint: { md: '1024', sm: '599' },
	defaultValue: { lg: '200', md: '10', sm: '50', lg_unit: 'px', md_unit: 'em', sm_unit: '%' },
	showBlock: false,
	heightRange: { min: 0, max: 500 },
} );
