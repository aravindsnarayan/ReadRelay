export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface LocationBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}
export declare const calculateDistance: (point1: Coordinates, point2: Coordinates) => number;
export declare const calculateBounds: (center: Coordinates, radiusKm: number) => LocationBounds;
export declare const generateRadiusQuery: (center: Coordinates, radiusKm: number, latColumn?: string, lngColumn?: string) => string;
export declare const generateDistanceQuery: (center: Coordinates, latColumn?: string, lngColumn?: string) => string;
export declare const isValidCoordinate: (coord: Coordinates) => boolean;
export declare const formatCoordinates: (coord: Coordinates, precision?: number) => string;
export declare const parseCoordinates: (coordString: string) => Coordinates | null;
export declare const getCurrentLocation: () => Promise<Coordinates>;
export declare const watchLocation: (callback: (location: Coordinates) => void, errorCallback: (error: Error) => void) => number | null;
export declare const stopWatchingLocation: (watchId: number) => void;
export declare const calculateCenterPoint: (coordinates: Coordinates[]) => Coordinates;
export declare const isWithinBounds: (point: Coordinates, bounds: LocationBounds) => boolean;
export declare const CITY_COORDINATES: {
    readonly NEW_YORK: {
        readonly latitude: 40.7128;
        readonly longitude: -74.006;
    };
    readonly LONDON: {
        readonly latitude: 51.5074;
        readonly longitude: -0.1278;
    };
    readonly PARIS: {
        readonly latitude: 48.8566;
        readonly longitude: 2.3522;
    };
    readonly TOKYO: {
        readonly latitude: 35.6762;
        readonly longitude: 139.6503;
    };
    readonly MUMBAI: {
        readonly latitude: 19.076;
        readonly longitude: 72.8777;
    };
    readonly DELHI: {
        readonly latitude: 28.7041;
        readonly longitude: 77.1025;
    };
    readonly BANGALORE: {
        readonly latitude: 12.9716;
        readonly longitude: 77.5946;
    };
    readonly SYDNEY: {
        readonly latitude: -33.8688;
        readonly longitude: 151.2093;
    };
};
export declare enum LocationPermission {
    GRANTED = "granted",
    DENIED = "denied",
    PROMPT = "prompt",
    NOT_SUPPORTED = "not_supported"
}
export declare const checkLocationPermission: () => Promise<LocationPermission>;
//# sourceMappingURL=location.d.ts.map