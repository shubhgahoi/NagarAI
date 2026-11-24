import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import { Complaint, Ward } from '../../types';
import { useApp } from '../../context/AppContext';
import { REWA_HOTSPOT_ZONES, HotspotZone } from '../../data/hotspotData';
import {
  Layers,
  Flame,
  Radio,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Eye,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export type MapMode = 'live' | 'hotspot';

interface LeafletMapProps {
  complaints?: Complaint[];
  height?: string;
  center?: [number, number];
  zoom?: number;
  selectable?: boolean;
  selectedCoords?: [number, number] | null;
  onSelectCoords?: (lat: number, lng: number) => void;
  showHotspots?: boolean;
  defaultMode?: MapMode;
  showFilterControls?: boolean;
  enableClustering?: boolean;
  title?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  complaints: initialComplaints,
  height = '520px',
  center = [24.5362, 81.3037], // Rewa Center
  zoom = 13,
  selectable = false,
  selectedCoords = null,
  onSelectCoords,
  showHotspots = false,
  defaultMode = 'live',
  showFilterControls = true,
  title,
}) => {
  const { complaints: contextComplaints, wards, viewComplaintDetail } = useApp();
  const complaints = initialComplaints || contextComplaints;

  // Active Map View Mode: "Live Issues" vs "Hotspot Analysis"
  const [mapMode, setMapMode] = useState<MapMode>(
    showHotspots && defaultMode === 'hotspot' ? 'hotspot' : 'live'
  );

  // Clustering toggle
  const [clusteringEnabled, setClusteringEnabled] = useState<boolean>(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedWardId, setSelectedWardId] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotZone | null>(null);

  // Map DOM and instance refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const hotspotsLayerRef = useRef<L.LayerGroup | null>(null);
  const selectedPinMarkerRef = useRef<L.Marker | null>(null);

  // Unique categories from dataset
  const categories = useMemo(() => {
    const set = new Set<string>();
    complaints.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set).sort();
  }, [complaints]);

  // Priorities list
  const priorities = ['Critical', 'High', 'Medium', 'Low'];

  // Statuses list
  const statuses = [
    'Reported',
    'AI Verified',
    'Assigned',
    'In Progress',
    'Resolved',
    'Citizen Verified',
    'SLA Breached',
  ];

  // Filter complaints based on user controls
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Category filter
      if (selectedCategory !== 'All' && c.category !== selectedCategory) {
        return false;
      }
      // Priority filter
      if (selectedPriority !== 'All' && c.priority !== selectedPriority) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'All' && c.status !== selectedStatus) {
        return false;
      }
      // Ward filter
      if (selectedWardId !== 'All' && c.location.wardId !== selectedWardId) {
        return false;
      }
      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesId = c.id.toLowerCase().includes(q);
        const matchesAddress = c.location.address.toLowerCase().includes(q);
        const matchesLandmark = (c.location.landmark || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesId && !matchesAddress && !matchesLandmark) {
          return false;
        }
      }
      return true;
    });
  }, [complaints, selectedCategory, selectedPriority, selectedStatus, selectedWardId, searchQuery]);

  // Color generator based on priority and status
  const getMarkerColor = (priority: string, status: string) => {
    if (status === 'Resolved' || status === 'Citizen Verified') return '#10B981'; // Emerald Green
    if (status === 'SLA Breached') return '#DC2626'; // Dark Red
    switch (priority) {
      case 'Critical':
        return '#EF4444'; // Red
      case 'High':
        return '#F97316'; // Orange
      case 'Medium':
        return '#3B82F6'; // Blue
      default:
        return '#64748B'; // Slate
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix icon asset paths in Vite bundler
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false, // Customized controls
        attributionControl: true,
      });

      // CartoDB / OSM clean tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add custom zoom control in top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Create dedicated layer groups
      markersLayerRef.current = L.layerGroup().addTo(map);
      hotspotsLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Click to pick location
      if (selectable && onSelectCoords) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          onSelectCoords(e.latlng.lat, e.latlng.lng);
        });
      }

      // Invalidate size to ensure clean tile rendering in containers/modals/tabs
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    }

    // Observe container resizes (e.g. mobile orientation, tab switch, split view)
    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when props change
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center[0], center[1], zoom]);

  // Recenter helper
  const handleRecenter = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([24.5362, 81.3037], 13);
    }
  }, []);

  // Spatial Grid Clustering for performant mobile rendering without external heavyweight scripts
  const clusterMarkers = useCallback((items: Complaint[], currentZoom: number) => {
    interface ClusterItem {
      isCluster: boolean;
      complaint?: Complaint;
      count: number;
      lat: number;
      lng: number;
      clusterComplaints?: Complaint[];
    }

    if (!clusteringEnabled || currentZoom >= 16) {
      // At close zoom or if disabled, return individual items
      return items.map((c): ClusterItem => ({
        isCluster: false,
        complaint: c,
        count: 1,
        lat: c.location.lat,
        lng: c.location.lng,
      }));
    }

    // Grid cell size in degrees based on zoom level
    const cellSize = 0.04 / Math.pow(2, currentZoom - 11);
    const grid: Record<string, { latSum: number; lngSum: number; complaints: Complaint[] }> = {};

    items.forEach((c) => {
      const lat = c.location.lat;
      const lng = c.location.lng;
      if (!lat || !lng) return;

      const cellX = Math.floor(lng / cellSize);
      const cellY = Math.floor(lat / cellSize);
      const key = `${cellX}_${cellY}`;

      if (!grid[key]) {
        grid[key] = { latSum: 0, lngSum: 0, complaints: [] };
      }
      grid[key].latSum += lat;
      grid[key].lngSum += lng;
      grid[key].complaints.push(c);
    });

    const results: ClusterItem[] = [];

    Object.values(grid).forEach((cell) => {
      const count = cell.complaints.length;
      if (count === 1) {
        results.push({
          isCluster: false,
          complaint: cell.complaints[0],
          count: 1,
          lat: cell.complaints[0].location.lat,
          lng: cell.complaints[0].location.lng,
        });
      } else {
        results.push({
          isCluster: true,
          count,
          lat: cell.latSum / count,
          lng: cell.lngSum / count,
          clusterComplaints: cell.complaints,
        });
      }
    });

    return results;
  }, [clusteringEnabled]);

  // Render markers and clusters
  const renderMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    // In Hotspot-only mode with no individual markers desired, we can dim or hide individual pins
    if (mapMode === 'hotspot') {
      // In hotspot mode, show lighter markers so heat zones stand out
      filteredComplaints.forEach((c) => {
        const lat = c.location.lat;
        const lng = c.location.lng;
        if (!lat || !lng) return;

        const dot = L.circleMarker([lat, lng], {
          radius: 5,
          color: '#ffffff',
          weight: 1.5,
          fillColor: c.priority === 'Critical' ? '#EF4444' : '#F97316',
          fillOpacity: 0.85,
        });

        dot.bindTooltip(`<b>${c.id}</b>: ${c.title}`, {
          direction: 'top',
          className: 'custom-leaflet-tooltip',
        });

        dot.on('click', () => {
          viewComplaintDetail(c.id);
        });

        markersLayerRef.current?.addLayer(dot);
      });
      return;
    }

    // Live mode: Render clusters or rich interactive pins
    const currentZoom = mapInstanceRef.current.getZoom();
    const clusters = clusterMarkers(filteredComplaints, currentZoom);

    clusters.forEach((item) => {
      if (item.isCluster && item.clusterComplaints) {
        // Render Cluster Marker
        const count = item.count;
        const hasCritical = item.clusterComplaints.some((c: Complaint) => c.priority === 'Critical');
        const clusterBg = hasCritical ? '#EF4444' : '#2563EB';

        const clusterIcon = L.divIcon({
          className: 'civic-cluster-marker',
          html: `
            <div style="
              position: relative;
              width: 36px;
              height: 36px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              ${hasCritical ? `
                <div style="
                  position: absolute;
                  inset: -6px;
                  border-radius: 50%;
                  background: rgba(239, 68, 68, 0.35);
                  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                "></div>
              ` : ''}
              <div style="
                width: 34px;
                height: 34px;
                border-radius: 50%;
                background: ${clusterBg};
                border: 3px solid #ffffff;
                box-shadow: 0 4px 12px rgba(0,0,0,0.35);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                font-weight: 800;
                font-size: 12px;
                font-family: system-ui, sans-serif;
                cursor: pointer;
                transition: transform 0.15s ease;
              ">
                ${count}
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const clusterMarker = L.marker([item.lat, item.lng], { icon: clusterIcon });

        // On cluster click, zoom into cluster or open preview
        clusterMarker.on('click', () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([item.lat, item.lng], Math.min(17, currentZoom + 2));
          }
        });

        // Hover Tooltip
        clusterMarker.bindTooltip(
          `<b>${count} Civic Issues in Cluster</b><br/><span style="font-size:10px; color:#cbd5e1;">Click to zoom & inspect</span>`,
          { direction: 'top' }
        );

        markersLayerRef.current?.addLayer(clusterMarker);
      } else if (item.complaint) {
        // Individual Ticket Pin
        const c = item.complaint;
        const color = getMarkerColor(c.priority, c.status);
        const isCritical = c.priority === 'Critical';

        const customIcon = L.divIcon({
          className: 'civic-issue-pin',
          html: `
            <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
              ${isCritical ? `
                <div style="
                  position: absolute;
                  inset: -6px;
                  border-radius: 50%;
                  background-color: rgba(239, 68, 68, 0.45);
                  animation: civic-pulse-ring 1.8s cubic-bezier(0.24, 0, 0.38, 1) infinite;
                "></div>
              ` : ''}
              <div style="
                position: relative;
                background-color: ${color};
                width: 26px;
                height: 26px;
                border-radius: 50%;
                border: 2.5px solid white;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 11px;
                font-weight: 800;
                cursor: pointer;
              ">
                ${c.priority.charAt(0)}
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([c.location.lat, c.location.lng], { icon: customIcon });

        // Rich Complaint Popup
        const popupDiv = document.createElement('div');
        popupDiv.className = 'civic-popup-content';
        popupDiv.innerHTML = `
          <div style="min-width: 230px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif; color: #0f172a;">
            ${c.images?.beforeUrl ? `
              <div style="width: 100%; height: 95px; border-radius: 8px; overflow: hidden; margin-bottom: 8px; background: #e2e8f0;">
                <img src="${c.images.beforeUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${c.title}" />
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #2563eb;">${c.id}</span>
              <span style="font-size: 10px; font-weight: 700; color: ${color}; background: ${color}15; padding: 2px 6px; border-radius: 4px;">
                ● ${c.priority}
              </span>
            </div>
            <div style="font-size: 12.5px; font-weight: 700; line-height: 1.35; margin-bottom: 4px; color: #1e293b;">
              ${c.title}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
              📍 ${c.location.landmark ? `${c.location.landmark} · ` : ''}${c.location.address}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 10.5px; color: #475569; padding: 5px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; margin-bottom: 8px;">
              <span>Status: <b style="color: #0f172a;">${c.status}</b></span>
              <span>Ward: <b style="color: #2563eb;">${c.location.wardName ? c.location.wardName.split('-')[0].trim() : 'Rewa'}</b></span>
            </div>
            <button id="view-ticket-btn-${c.id}" style="
              width: 100%;
              background: #2563eb;
              color: #ffffff;
              border: none;
              padding: 7px 12px;
              border-radius: 8px;
              font-size: 11.5px;
              font-weight: 700;
              cursor: pointer;
              transition: background 0.15s ease;
            ">
              View Ticket Details →
            </button>
          </div>
        `;

        marker.bindPopup(popupDiv);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-ticket-btn-${c.id}`);
          if (btn) {
            btn.onclick = () => {
              viewComplaintDetail(c.id);
            };
          }
        });

        markersLayerRef.current?.addLayer(marker);
      }
    });
  }, [filteredComplaints, mapMode, clusterMarkers, viewComplaintDetail]);

  // Render Hotspot Heatmap-style multi-radius radial rings
  const renderHotspots = useCallback(() => {
    if (!mapInstanceRef.current || !hotspotsLayerRef.current) return;
    hotspotsLayerRef.current.clearLayers();

    if (mapMode !== 'hotspot') return;

    // Render multi-ring radial gradient circles simulating geospatial kernel density / heat clusters
    REWA_HOTSPOT_ZONES.forEach((zone) => {
      const [lat, lng] = zone.center;
      const baseColor =
        zone.severity === 'Critical'
          ? '#EF4444'
          : zone.severity === 'High'
          ? '#F97316'
          : '#EAB308';

      // Outer Heat Diffusion Ring (Low Intensity)
      const outerRing = L.circle([lat, lng], {
        radius: zone.radius * 1.5,
        color: baseColor,
        weight: 1,
        opacity: 0.25,
        fillColor: baseColor,
        fillOpacity: 0.12,
        interactive: false,
      });

      // Medium Intensity Ring
      const midRing = L.circle([lat, lng], {
        radius: zone.radius,
        color: baseColor,
        weight: 1.5,
        opacity: 0.5,
        fillColor: baseColor,
        fillOpacity: 0.25,
        interactive: false,
      });

      // Epicenter Core Ring (Highest Density)
      const coreRing = L.circle([lat, lng], {
        radius: zone.radius * 0.45,
        color: baseColor,
        weight: 2,
        opacity: 0.8,
        fillColor: baseColor,
        fillOpacity: 0.45,
      });

      // Center Pulse Badge Marker
      const pulseIcon = L.divIcon({
        className: 'hotspot-pulse-badge',
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <div style="
              position: absolute;
              inset: -4px;
              border-radius: 50%;
              background: ${baseColor}40;
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background: ${baseColor};
              border: 2.5px solid #ffffff;
              box-shadow: 0 4px 14px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 11px;
              font-weight: 800;
            ">
              🔥
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const pulseMarker = L.marker([lat, lng], { icon: pulseIcon });

      const hotspotPopup = document.createElement('div');
      hotspotPopup.className = 'hotspot-popup-content';
      hotspotPopup.innerHTML = `
        <div style="min-width: 250px; max-width: 300px; font-family: system-ui, sans-serif; color: #0f172a;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${baseColor}; background: ${baseColor}15; padding: 2px 6px; border-radius: 4px;">
              ${zone.severity} Infrastructure Hotspot
            </span>
            <span style="font-family: monospace; font-size: 10.5px; font-weight: 700; color: #64748b;">
              ${zone.recurringCount} Recurrences
            </span>
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 4px; line-height: 1.3;">
            ${zone.name}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 8px; line-height: 1.4;">
            ${zone.description}
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 8px; margin-bottom: 8px; font-size: 10.5px; color: #334155;">
            <b>Root Cause:</b> ${zone.rootCause}
          </div>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 6px 8px; font-size: 10.5px; color: #166534;">
            <b>AI Preventive Solution:</b> ${zone.preventivePlan}
          </div>
        </div>
      `;

      pulseMarker.bindPopup(hotspotPopup);
      coreRing.bindPopup(hotspotPopup);

      pulseMarker.on('click', () => {
        setSelectedHotspot(zone);
      });

      hotspotsLayerRef.current?.addLayer(outerRing);
      hotspotsLayerRef.current?.addLayer(midRing);
      hotspotsLayerRef.current?.addLayer(coreRing);
      hotspotsLayerRef.current?.addLayer(pulseMarker);
    });
  }, [mapMode]);

  // Update on dependency shifts or zoom
  useEffect(() => {
    renderMarkers();
    renderHotspots();

    if (!mapInstanceRef.current) return;
    const handleZoomEnd = () => {
      renderMarkers();
    };

    mapInstanceRef.current.on('zoomend', handleZoomEnd);
    return () => {
      mapInstanceRef.current?.off('zoomend', handleZoomEnd);
    };
  }, [renderMarkers, renderHotspots]);

  // Selected Coords pin for defect intake
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectedPinMarkerRef.current) {
      mapInstanceRef.current.removeLayer(selectedPinMarkerRef.current);
      selectedPinMarkerRef.current = null;
    }

    if (selectedCoords) {
      const pinIcon = L.divIcon({
        className: 'user-picked-pin',
        html: `
          <div style="
            background: #2563eb;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 16px rgba(37,99,235,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 15px;
            animation: bounce 1s infinite alternate;
          ">
            📍
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      selectedPinMarkerRef.current = L.marker(selectedCoords, { icon: pinIcon }).addTo(mapInstanceRef.current);
      mapInstanceRef.current.panTo(selectedCoords);
    }
  }, [selectedCoords]);

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSelectedStatus('All');
    setSelectedWardId('All');
    setSearchQuery('');
  };

  // Map Statistics calculation
  const stats = useMemo(() => {
    const totalVisible = filteredComplaints.length;
    const critical = filteredComplaints.filter((c) => c.priority === 'Critical').length;
    const high = filteredComplaints.filter((c) => c.priority === 'High').length;
    const inProgress = filteredComplaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length;
    const resolved = filteredComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Citizen Verified').length;

    return { totalVisible, critical, high, inProgress, resolved };
  }, [filteredComplaints]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl flex flex-col">
      {/* Top Header & Map Controls Ribbon */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {title || 'Rewa GIS Spatial Intelligence Map'}
              </span>
              <span className="text-[10px] font-mono uppercase bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold px-1.5 py-0.5 rounded">
                SIMULATED POC DATA
              </span>
            </div>
            <div className="text-[10.5px] text-slate-500 dark:text-slate-400">
              Demo complaint coordinates within Rewa Municipal Corporation limits (Civil Lines, Shilpi Plaza, College Chowk)
            </div>
          </div>
        </div>

        {/* Mode Switcher: "Live Issues" vs "Hotspot Analysis" */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => {
                setMapMode('live');
                setSelectedHotspot(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mapMode === 'live'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Live Issues</span>
            </button>

            <button
              onClick={() => setMapMode('hotspot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mapMode === 'hotspot'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Hotspot Analysis</span>
            </button>
          </div>

          {/* Filter Collapse Toggle */}
          {showFilterControls && (
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                filtersOpen || selectedCategory !== 'All' || selectedPriority !== 'All' || selectedWardId !== 'All'
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Toggle Issue Filters"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {filtersOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          <button
            onClick={handleRecenter}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Recenter Map on Rewa, MP"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Filter Drawer */}
      {showFilterControls && filtersOpen && (
        <div className="bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-700 text-xs animate-in slide-in-from-top duration-200 z-20 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search complaint or address..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Categories ({complaints.length})</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Priorities</option>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p} Priority
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward Filter */}
            <div>
              <select
                value={selectedWardId}
                onChange={(e) => {
                  const wId = e.target.value;
                  setSelectedWardId(wId);
                  if (wId !== 'All' && mapInstanceRef.current) {
                    const w = wards.find((x) => x.id === wId);
                    if (w) mapInstanceRef.current.setView(w.center, 14);
                  }
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Municipal Wards ({wards.length})</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={clusteringEnabled}
                  onChange={(e) => setClusteringEnabled(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Marker Clustering (Smooth Mobile Rendering)
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span>Showing {filteredComplaints.length} of {complaints.length} tickets</span>
              <button
                onClick={handleResetFilters}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Map Viewport */}
      <div className="relative w-full flex-1">
        <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />

        {/* Click-to-pin helper banner if selectable */}
        {selectable && (
          <div className="absolute top-3 left-4 z-20 bg-blue-600 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 pointer-events-none">
            <MapPin className="w-3.5 h-3.5" />
            <span>Click map to drop exact defect coordinates in Rewa</span>
          </div>
        )}

        {/* Hotspot Mode Visual Explainer Overlay Banner */}
        {mapMode === 'hotspot' && (
          <div className="absolute top-3 left-3 sm:left-4 z-20 max-w-sm sm:max-w-md bg-slate-950/90 text-white backdrop-blur-md p-3 rounded-2xl border border-rose-500/40 shadow-2xl space-y-2 pointer-events-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-400 uppercase tracking-wide">
                <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Predictive Hotspot Recurrence Engine</span>
              </div>
              <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                5 High-Risk Sectors
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Demonstrates how recurring citizen reports over 90–180 days identify chronic infrastructure failure zones before major monsoonal collapse. Click any pulsating ring to view root causes and preventive work orders.
            </p>
          </div>
        )}

        {/* Hotspot Selection Drawer Card if user clicked a zone */}
        {selectedHotspot && (
          <div className="absolute bottom-16 left-3 sm:left-4 z-30 max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                {selectedHotspot.severity} Infrastructure Vulnerability
              </span>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {selectedHotspot.name}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {selectedHotspot.description}
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-500 block text-[9.5px]">Root Cause</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedHotspot.rootCause}</span>
              </div>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="font-bold text-emerald-600 block text-[9.5px]">Preventive Intervention</span>
                <span className="text-emerald-900 dark:text-emerald-200 font-medium">{selectedHotspot.preventivePlan}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Legend and Statistics Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Map Statistics Deck */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl text-xs flex items-center gap-3 pointer-events-auto">
            <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              <span>{stats.totalVisible} Active Rewa Complaints</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-3 text-[11px]">
              <span className="text-rose-600 font-bold">{stats.critical} Critical</span>
              <span>·</span>
              <span className="text-orange-500 font-bold">{stats.high} High</span>
              <span>·</span>
              <span className="text-blue-500 font-bold">{stats.inProgress} In-Work</span>
              <span>·</span>
              <span className="text-emerald-600 font-bold">{stats.resolved} Resolved</span>
            </div>
          </div>

          {/* Interactive Legend */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl text-[11px] flex items-center gap-2.5 pointer-events-auto">
            <span className="font-bold text-slate-700 dark:text-slate-300">Legend:</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Critical</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-slate-600 dark:text-slate-400">High</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Disclaimer Footer on Map */}
      <div className="bg-slate-950 px-4 py-2 text-[10px] font-mono text-slate-400 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 z-20">
        <div>
          Notice: All map pins represent simulated proof-of-concept defect coordinates for demonstration purposes. Not real government grievance telemetry.
        </div>
        <div className="text-slate-500">
          Rewa Urban Center: 24.5362° N, 81.3037° E · OpenStreetMap Leaflet Engine
        </div>
      </div>
    </div>
  );
};
