/// <reference types="vite/client" />

declare const __APP_ENV__: 'development' | 'staging' | 'production';
declare const __APP_VERSION__: string;

interface Performance {
	readonly memory: {
		readonly jsHeapSizeLimit: number;
		readonly totalJSHeapSize: number;
		readonly usedJSHeapSize: number;
	};
}

interface NetworkInformation extends EventTarget {
	readonly downlink: number;
	readonly downlinkMax: number;
	readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
	readonly rtt: number;
	readonly saveData: boolean;
	readonly type:
		| 'bluetooth'
		| 'cellular'
		| 'ethernet'
		| 'none'
		| 'wifi'
		| 'wimax'
		| 'other'
		| 'unknown';
}

interface Navigator {
	readonly connection?: NetworkInformation;
	readonly mozConnection?: NetworkInformation;
	readonly webkitConnection?: NetworkInformation;
}
