"use client";

import createGlobe, { COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

// Marqueurs par défaut (villes du monde)
const DEFAULT_MARKERS = [
  { location: [14.5995, 120.9842] as [number, number], size: 0.03 }, // Manille
  { location: [19.076, 72.8777] as [number, number], size: 0.1 },    // Mumbai
  { location: [23.8103, 90.4125] as [number, number], size: 0.05 }, // Dhaka
  { location: [30.0444, 31.2357] as [number, number], size: 0.07 }, // Le Caire
  { location: [39.9042, 116.4074] as [number, number], size: 0.08 }, // Pékin
  { location: [-23.5505, -46.6333] as [number, number], size: 0.1 }, // São Paulo
  { location: [19.4326, -99.1332] as [number, number], size: 0.1 },  // Mexico
  { location: [40.7128, -74.006] as [number, number], size: 0.1 },   // New York
  { location: [34.6937, 135.5022] as [number, number], size: 0.05 }, // Osaka
  { location: [41.0082, 28.9784] as [number, number], size: 0.06 },  // Istanbul
];

const createGlobeConfig = (userLocation?: { lat: number; lng: number }, useDefaultMarkers: boolean = false): COBEOptions => ({
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0.1,
  diffuse: 0.8,
  mapSamples: 16000,
  mapBrightness: 2.0,
  baseColor: [0.1, 0.1, 0.2],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [0.2, 0.4, 1],
  markers: userLocation ? [
    { location: [userLocation.lat, userLocation.lng] as [number, number], size: 0.1 }
  ] : useDefaultMarkers ? DEFAULT_MARKERS : [],
});

export function Globe({
  className,
}: {
  className?: string;
}) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [useDefaultMarkers, setUseDefaultMarkers] = useState(false);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  // Récupérer la géolocalisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setUseDefaultMarkers(false);
        },
        (error) => {
          console.warn("Erreur de géolocalisation:", error.message);
          setLocationError(error.message);
          
          // Si l'utilisateur refuse la géolocalisation, afficher les marqueurs par défaut
          if (error.code === error.PERMISSION_DENIED) {
            setUseDefaultMarkers(true);
            setUserLocation(null);
          } else {
            // Pour les autres erreurs, utiliser Paris comme fallback
            setUserLocation({ lat: 48.8566, lng: 2.3522 });
            setUseDefaultMarkers(false);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      console.warn("Géolocalisation non supportée");
      setLocationError("Géolocalisation non supportée");
      // Si la géolocalisation n'est pas supportée, afficher les marqueurs par défaut
      setUseDefaultMarkers(true);
    }
  }, []);

  useEffect(() => {
    // Attendre que la localisation soit disponible OU que les marqueurs par défaut soient activés
    if (!userLocation && !useDefaultMarkers) return;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const config = createGlobeConfig(userLocation || undefined, useDefaultMarkers);
    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.005;
        state.phi = phi + rs.get();
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => (canvasRef.current!.style.opacity = "1"), 500);
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, userLocation, useDefaultMarkers]);

  return (
    <div
      className={cn(
        "relative mx-auto aspect-[1/1] w-full max-w-[600px]",
        className,
      )}
    >
      {!userLocation && !useDefaultMarkers && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Localisation en cours...</p>
          </div>
        </div>
      )}
      
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]",
          (!userLocation && !useDefaultMarkers) && "hidden"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
