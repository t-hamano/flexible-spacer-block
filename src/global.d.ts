interface FsbConf {
	breakpoint: {
		md: number;
		sm: number;
	};
	showBlock: boolean;
	// Block deprecations read this to reproduce the content saved by older
	// versions, so do not change its shape.
	defaultValue: {
		lg: string;
		md: string;
		sm: string;
		lg_unit: string;
		md_unit: string;
		sm_unit: string;
	};
}

declare const fsbConf: FsbConf;

declare module '*.scss';
