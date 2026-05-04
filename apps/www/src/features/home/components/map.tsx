"use client";

import { useTheme } from "@melvinla/next-themes";
import { AdvancedMarker as Marker, APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { memo } from "react";

const MapContainer = ({
  className,
  initialCenter,
}: {
  className: string;
  initialCenter: { lat: number; lng: number };
}) => {
  const { resolvedAppearance } = useTheme();

  const mapId = resolvedAppearance === "dark" ? "cdfadb8c71aaba12" : "70614a0367adfbc3";
  return (
    <div data-chromatic="ignore">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GCP_MAP_API_KEY ?? ""}>
        <GoogleMap
          className={className}
          defaultCenter={initialCenter}
          defaultZoom={12}
          scrollwheel={false}
          keyboardShortcuts={false}
          disableDoubleClickZoom
          zoomControl={false}
          mapTypeControl={false}
          scaleControl={false}
          streetViewControl={false}
          rotateControl={false}
          fullscreenControl={false}
          mapId={mapId}
        >
          <Marker position={initialCenter} />
        </GoogleMap>
      </APIProvider>
    </div>
  );
};

export const Map = memo(MapContainer);
