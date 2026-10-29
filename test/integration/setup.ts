/**
 * External dependencies
 */
import { vi } from 'vitest';

// Mirror the settings localized by the plugin with their initial values.
vi.stubGlobal( 'fsbConf', {
	breakpoint: { md: '1024', sm: '599' },
	defaultValue: { lg: '100', md: '100', sm: '100', lg_unit: 'px', md_unit: 'px', sm_unit: 'px' },
	showBlock: false,
} );
