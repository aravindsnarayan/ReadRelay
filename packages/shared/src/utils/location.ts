// Location and geospatial utility functions for ReadRelay

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

// Distance calculation using Haversine formula
export const calculateDistance = (
  point1: Coordinates,
  point2: Coordinates
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Convert degrees to radians
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Convert radians to degrees
const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

// Calculate bounding box for a given center point and radius
export const calculateBounds = (
  center: Coordinates,
  radiusKm: number
): LocationBounds => {
  const R = 6371; // Earth's radius in kilometers

  // Convert radius to angular distance
  const angularDistance = radiusKm / R;

  const lat = toRadians(center.latitude);
  const lon = toRadians(center.longitude);

  // Calculate bounds
  const minLat = lat - angularDistance;
  const maxLat = lat + angularDistance;

  const deltaLon = Math.asin(Math.sin(angularDistance) / Math.cos(lat));
  const minLon = lon - deltaLon;
  const maxLon = lon + deltaLon;

  return {
    north: toDegrees(maxLat),
    south: toDegrees(minLat),
    east: toDegrees(maxLon),
    west: toDegrees(minLon),
  };
};

// Generate radius search query using latitude/longitude fields
export const generateRadiusQuery = (
  center: Coordinates,
  radiusKm: number,
  latColumn: string = 'location_latitude',
  lngColumn: string = 'location_longitude'
): string => {
  // Using haversine distance formula for radius search
  const radiusInDegrees = radiusKm / 111.32; // Rough conversion: 1 degree ≈ 111.32 km
  return `
    (${latColumn} IS NOT NULL AND ${lngColumn} IS NOT NULL) AND
    (
      (${latColumn} - ${center.latitude}) * (${latColumn} - ${center.latitude}) + 
      (${lngColumn} - ${center.longitude}) * (${lngColumn} - ${center.longitude}) * 
      COS(RADIANS(${center.latitude})) * COS(RADIANS(${center.latitude}))
    ) <= ${radiusInDegrees * radiusInDegrees}
  `.trim();
};

// Generate distance calculation for sorting
export const generateDistanceQuery = (
  center: Coordinates,
  latColumn: string = 'location_latitude',
  lngColumn: string = 'location_longitude'
): string => {
  return `
    CASE 
      WHEN ${latColumn} IS NOT NULL AND ${lngColumn} IS NOT NULL THEN
        111.32 * SQRT(
          (${latColumn} - ${center.latitude}) * (${latColumn} - ${center.latitude}) + 
          (${lngColumn} - ${center.longitude}) * (${lngColumn} - ${center.longitude}) * 
          COS(RADIANS(${center.latitude})) * COS(RADIANS(${center.latitude}))
        )
      ELSE 999999
    END as distance_km
  `.trim();
};

// Validate coordinates
export const isValidCoordinate = (coord: Coordinates): boolean => {
  return (
    coord.latitude >= -90 &&
    coord.latitude <= 90 &&
    coord.longitude >= -180 &&
    coord.longitude <= 180
  );
};

// Format coordinates for display
export const formatCoordinates = (
  coord: Coordinates,
  precision: number = 6
): string => {
  return `${coord.latitude.toFixed(precision)}, ${coord.longitude.toFixed(precision)}`;
};

// Parse coordinates from string
export const parseCoordinates = (coordString: string): Coordinates | null => {
  try {
    const parts = coordString.split(',').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const coord = { latitude: parts[0], longitude: parts[1] };
      return isValidCoordinate(coord) ? coord : null;
    }
    return null;
  } catch {
    return null;
  }
};

// Get user location from browser (for web)
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

// Watch user location changes
export const watchLocation = (
  callback: (location: Coordinates) => void,
  errorCallback: (error: Error) => void
): number | null => {
  if (!navigator.geolocation) {
    errorCallback(new Error('Geolocation is not supported by this browser'));
    return null;
  }

  return navigator.geolocation.watchPosition(
    position => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    error => {
      errorCallback(new Error(`Geolocation error: ${error.message}`));
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
    }
  );
};

// Stop watching location
export const stopWatchingLocation = (watchId: number): void => {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

// Calculate center point of multiple coordinates
export const calculateCenterPoint = (
  coordinates: Coordinates[]
): Coordinates => {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate center of empty coordinates array');
  }

  if (coordinates.length === 1) {
    return coordinates[0];
  }

  let x = 0;
  let y = 0;
  let z = 0;

  coordinates.forEach(coord => {
    const lat = toRadians(coord.latitude);
    const lon = toRadians(coord.longitude);

    x += Math.cos(lat) * Math.cos(lon);
    y += Math.cos(lat) * Math.sin(lon);
    z += Math.sin(lat);
  });

  x /= coordinates.length;
  y /= coordinates.length;
  z /= coordinates.length;

  const centralLongitude = Math.atan2(y, x);
  const centralSquareRoot = Math.sqrt(x * x + y * y);
  const centralLatitude = Math.atan2(z, centralSquareRoot);

  return {
    latitude: toDegrees(centralLatitude),
    longitude: toDegrees(centralLongitude),
  };
};

// Check if point is within bounds
export const isWithinBounds = (
  point: Coordinates,
  bounds: LocationBounds
): boolean => {
  return (
    point.latitude >= bounds.south &&
    point.latitude <= bounds.north &&
    point.longitude >= bounds.west &&
    point.longitude <= bounds.east
  );
};

// Popular city coordinates for testing/defaults
export const CITY_COORDINATES = {
  NEW_YORK: { latitude: 40.7128, longitude: -74.006 },
  LONDON: { latitude: 51.5074, longitude: -0.1278 },
  PARIS: { latitude: 48.8566, longitude: 2.3522 },
  TOKYO: { latitude: 35.6762, longitude: 139.6503 },
  MUMBAI: { latitude: 19.076, longitude: 72.8777 },
  DELHI: { latitude: 28.7041, longitude: 77.1025 },
  BANGALORE: { latitude: 12.9716, longitude: 77.5946 },
  SYDNEY: { latitude: -33.8688, longitude: 151.2093 },
} as const;

// Location permission status
export enum LocationPermission {
  GRANTED = 'granted',
  DENIED = 'denied',
  PROMPT = 'prompt',
  NOT_SUPPORTED = 'not_supported',
}

// Check location permission status
export const checkLocationPermission =
  async (): Promise<LocationPermission> => {
    if (!navigator.permissions || !navigator.geolocation) {
      return LocationPermission.NOT_SUPPORTED;
    }

    try {
      const permission = await navigator.permissions.query({
        name: 'geolocation',
      });
      return permission.state as LocationPermission;
    } catch {
      return LocationPermission.NOT_SUPPORTED;
    }
  };
