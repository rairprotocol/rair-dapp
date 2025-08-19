//@ts-nocheck
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { throttle } from 'lodash';
import Globe from 'globe.gl';

// Define LuminanceFormat constant to resolve import issues
const LuminanceFormat = 4; // This matches the value in Three.js

// Import parcel components
import RegionView from './RegionView';
import ParcelGrid from './ParcelGrid';
import ParcelPurchase from './ParcelPurchase';

// Define a type for the Globe instance
type GlobeInstance = {
  globeImageUrl: (url: string) => GlobeInstance;
  bumpImageUrl: (url: string) => GlobeInstance;
  backgroundImageUrl: (url: string) => GlobeInstance;
  width: (width: number) => GlobeInstance;
  height: (height: number) => GlobeInstance;
  backgroundColor: (color: string) => GlobeInstance;
  pointsData: (data: any[]) => GlobeInstance;
  pointColor: (color: string | ((d: any) => string)) => GlobeInstance;
  pointRadius: (radius: number | ((d: any) => number)) => GlobeInstance;
  pointAltitude: (altitude: number | ((d: any) => number)) => GlobeInstance;
  pointsMerge: (merge: boolean) => GlobeInstance;
  pointsTransitionDuration: (duration: number) => GlobeInstance;
  arcsData: (data: any[]) => GlobeInstance;
  arcColor: (color: string | ((d: any) => string)) => GlobeInstance;
  arcAltitude: (altitude: number | ((d: any) => number)) => GlobeInstance;
  arcStroke: (stroke: number | ((d: any) => number)) => GlobeInstance;
  arcsTransitionDuration: (duration: number) => GlobeInstance;
  _destructor: () => void;
  // Add methods for accessing internal objects
  renderer?: () => any;
  camera?: () => any;
  controls?: () => any;
  // Camera methods
  pointOfView?: (pov: any, transitionDuration?: number) => GlobeInstance;
  // Add methods for HTML elements
  htmlElementsData?: (data: any[]) => GlobeInstance;
  htmlElement?: (elementFn: (d: any) => HTMLElement) => GlobeInstance;
  htmlTransitionDuration?: (duration: number) => GlobeInstance;
  onHtmlElementClick?: (callback: (d: any) => void) => GlobeInstance;
  onHtmlElementHover?: (callback: (d: any | null) => void) => GlobeInstance;
  // Add methods for polygons
  polygonsData?: (data: any[]) => GlobeInstance;
  polygonCapColor?: (color: string | ((d: any) => string)) => GlobeInstance;
  polygonSideColor?: (color: string | ((d: any) => string)) => GlobeInstance;
  polygonStrokeColor?: (color: string | ((d: any) => string)) => GlobeInstance;
  polygonAltitude?: (altitude: number | ((d: any) => number)) => GlobeInstance;
  onPolygonClick?: (callback: (polygon: any) => void) => GlobeInstance;
  onPolygonHover?: (callback: (polygon: any | null) => void) => GlobeInstance;
}

interface Country {
  id: string;
  name: string;
  gdp: number;
  previousGdp: number;
  gdpChange: number;
  population: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  tradePartners: TradePartner[];
}

interface TradePartner {
  countryId: string;
  importVolume: number;
  exportVolume: number;
  tariffRate: number;
}

interface GlobalParameters {
  baseTariffRate: number;
  gdpGrowthRate: number;
  tradeMultiplier: number;
  laborProductivity: number;
  taxRate: number;
}

// Add new interfaces for the parcellation system
interface Region {
  id: string;
  name: string;
  countryId: string;
  population: number;
  gdp: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  parcelCount: number;
}

interface Parcel {
  id: string;
  regionId: string;
  countryId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  price: number;
  owner: string | null;
  purchaseDate: string | null;
}

interface CountryZoomState {
  isZoomed: boolean;
  countryId: string | null;
  regionId: string | null;
}

interface TariffGlobeProps {
  width?: number;
  height?: number;
  countries?: Country[];
  globalParameters?: GlobalParameters;
  isRunning?: boolean;
  wallet?: {
    address: string | null;
    rifBalance: number;
  };
}

export default function TariffGlobe({ 
  width = 800, 
  height = 600,
  countries = [],
  globalParameters = { baseTariffRate: 5, gdpGrowthRate: 2, tradeMultiplier: 1, laborProductivity: 1, taxRate: 15 },
  isRunning = false,
  wallet = { address: null, rifBalance: 0 }
}: TariffGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  
  // New state for parcel system
  const [zoomState, setZoomState] = useState<CountryZoomState>({
    isZoomed: false,
    countryId: null,
    regionId: null
  });
  const [regions, setRegions] = useState<Region[]>([]);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [loadingParcels, setLoadingParcels] = useState(false);
  
  // Derived/computed state
  const selectedRegion = useMemo(() => {
    if (!zoomState.regionId) return null;
    return regions.find(r => r.id === zoomState.regionId) || null;
  }, [regions, zoomState.regionId]);
  
  const countryRegions = useMemo(() => {
    if (!zoomState.countryId) return [];
    return regions.filter(r => r.countryId === zoomState.countryId);
  }, [regions, zoomState.countryId]);
  
  const regionParcels = useMemo(() => {
    if (!zoomState.regionId) return [];
    return parcels.filter(p => p.regionId === zoomState.regionId);
  }, [parcels, zoomState.regionId]);
  
  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
    // Generate mock regions and parcels for prototype
    generateMockRegionsAndParcels();
  }, []);
  
  // Mock data generation for prototype
  const generateMockRegionsAndParcels = () => {
    // Generate regions
    const mockRegions: Region[] = [];
    let regionId = 1;
    
    countries.forEach(country => {
      // Generate between 3-8 regions per country based on population
      const regionCount = Math.max(3, Math.min(8, Math.ceil(country.population / 200)));
      
      for (let i = 0; i < regionCount; i++) {
        // Calculate region population as fraction of country population
        const regionPopulation = (country.population / regionCount) * (0.7 + Math.random() * 0.6);
        
        // Calculate region GDP as fraction of country GDP proportional to population
        const populationShare = regionPopulation / country.population;
        const regionGDP = country.gdp * populationShare;
        
        // Calculate region coordinates with random offset from country center
        const latOffset = (Math.random() - 0.5) * 8;
        const lngOffset = (Math.random() - 0.5) * 8;
        
        mockRegions.push({
          id: `${country.id}-r${regionId}`,
          name: `${country.name} Region ${i + 1}`,
          countryId: country.id,
          population: Number(regionPopulation.toFixed(1)),
          gdp: Number((regionGDP).toFixed(1)),
          coordinates: {
            lat: country.coordinates.lat + latOffset,
            lng: country.coordinates.lng + lngOffset
          },
          parcelCount: Math.ceil(regionPopulation * 2) // 2 parcels per 1M population
        });
        
        regionId++;
      }
    });
    
    setRegions(mockRegions);
    
    // Generate parcels (only for the first few regions to avoid excessive memory usage)
    const limitedRegions = mockRegions.slice(0, 20);
    const mockParcels: Parcel[] = [];
    
    limitedRegions.forEach(region => {
      for (let i = 0; i < region.parcelCount; i++) {
        // Calculate parcel coordinates with random offset from region center
        const latOffset = (Math.random() - 0.5) * 2;
        const lngOffset = (Math.random() - 0.5) * 2;
        
        // Set a price proportional to the region's GDP per capita
        const gdpPerCapita = region.gdp / region.population;
        const basePrice = 50 + Math.floor(gdpPerCapita * 5);
        
        mockParcels.push({
          id: `${region.id}-p${i+1}`,
          regionId: region.id,
          countryId: region.countryId,
          coordinates: {
            lat: region.coordinates.lat + latOffset,
            lng: region.coordinates.lng + lngOffset
          },
          price: basePrice + Math.floor(Math.random() * 30),
          owner: Math.random() > 0.7 ? null : Math.random() > 0.5 ? wallet.address : `0x${Math.random().toString(16).substring(2, 10)}...`,
          purchaseDate: Math.random() > 0.7 ? null : new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    });
    
    setParcels(mockParcels);
  };

  // Initialize globe
  useEffect(() => {
    if (!containerRef.current || !isClient) return;

    // Dynamically import globe.gl only on client-side
    import('globe.gl')
      .then((GlobeModule) => {
        const Globe = GlobeModule.default;
        
        // Initialize globe
        const globe = new Globe(containerRef.current as HTMLElement)
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
          .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
          .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
          .width(width)
          .height(height)
          .backgroundColor('rgba(0,0,0,0)')
          .arcsTransitionDuration(1000)
          .htmlTransitionDuration(1000); // Transition for HTML elements

        globeRef.current = globe;
        setError(null);
      })
      .catch(err => {
        console.error('Failed to load globe.gl:', err);
        setError('Failed to load globe visualization. Please check your internet connection.');
      });

    // Cleanup
    return () => {
      if (globeRef.current) {
        globeRef.current._destructor();
      }
    };
  }, [width, height, isClient]);

  // Update globe data when countries or parameters change
  useEffect(() => {
    if (!globeRef.current || !countries.length) return;

    try {
      // Max absolute GDP change for scaling bar height (adjust scaling as needed)
      const maxAbsGdpChange = Math.max(...countries.map(c => Math.abs(c.gdpChange)), 1); // Avoid division by zero

      // Prepare HTML elements data for countries (GDP change bars)
      const htmlElementsData = countries.map(country => ({
        lat: country.coordinates.lat,
        lng: country.coordinates.lng,
        countryData: country, // Pass full country data
        gdpChange: country.gdpChange,
        name: country.name,
        id: country.id
      }));

      // Prepare arcs data for trade relationships
      const arcsData = countries.flatMap(country => 
        country.tradePartners.map(partner => {
          const partnerCountry = countries.find(c => c.id === partner.countryId);
          if (!partnerCountry) return null;
          
          return {
            startLat: country.coordinates.lat,
            startLng: country.coordinates.lng,
            endLat: partnerCountry.coordinates.lat,
            endLng: partnerCountry.coordinates.lng,
            color: `rgba(255, 255, 255, ${partner.tariffRate / 20})`, // Opacity based on tariff rate
            width: Math.log10(partner.importVolume + partner.exportVolume) / 2 // Width based on trade volume
          };
        }).filter(Boolean) as any[]
      );

      // Update globe with new data
      // Cast to any to use dynamically added/extended methods
      (globeRef.current as any)
        .arcsData(arcsData)
        .arcColor(d => (d as any).color)
        .arcAltitude(0.2)
        .arcStroke(d => (d as any).width)
        // --- HTML Elements for GDP Bars --- 
        .htmlElementsData(htmlElementsData)
        .htmlElement(d => {
          const country = (d as any).countryData as Country;
          const elementData = d as any; // Capture data for listeners
          const el = document.createElement('div');
          el.className = 'gdp-bar-container';

          // Create Country Name Label
          const nameLabel = document.createElement('div');
          nameLabel.className = 'country-map-label name-label';
          nameLabel.style.color = 'white';
          nameLabel.textContent = country.name;
          el.appendChild(nameLabel);

          // Create GDP Value Label
          const gdpLabel = document.createElement('div');
          gdpLabel.className = 'country-map-label gdp-label';
          gdpLabel.style.color = 'white';
          gdpLabel.textContent = `$${(country.gdp / 1000).toFixed(1)}T`; // Format GDP
          el.appendChild(gdpLabel);

          // Create GDP Change Bar
          const barContainer = document.createElement('div'); // Container to hold the bar itself
          barContainer.className = 'bar-visual-container';
          const bar = document.createElement('div');
          bar.className = 'gdp-bar';
          // Scale height based on GDP change magnitude (adjust scaling factor as needed)
          const barHeight = Math.min(50, Math.max(2, (Math.abs(country.gdpChange) / maxAbsGdpChange) * 50)); // Max 50px height, min 2px
          bar.style.height = `${barHeight}px`;
          bar.style.backgroundColor = country.gdpChange >= 0 ? '#4caf50' : '#f44336'; // Green for positive, Red for negative
          barContainer.appendChild(bar);
          el.appendChild(barContainer);
          
          // --- Add Event Listeners Directly --- 
          el.addEventListener('click', () => {
            handleElementClick(elementData); 
          });
          el.addEventListener('mouseover', () => {
            handleElementHover(elementData);
          });
          el.addEventListener('mouseout', () => {
            handleElementHover(null); // Clear hover on mouse out
          });

          return el;
        });
    } catch (err) {
      console.error('Error updating globe data:', err);
      setError('Error updating globe visualization.');
    }
  }, [countries, globalParameters, isRunning]);

  // Handle selection and zoom to country
  const handleElementClick = (elementData: any) => {
    if (!globeRef.current) return;
    
    try {
      if (elementData && elementData.id) {
        const country = countries.find(c => c.id === elementData.id);
        if (country) {
          setSelectedCountry(country);
          
          // Zoom to the country
          zoomToCountry(country);
        } else {
          setSelectedCountry(null);
        }
      } else {
        setSelectedCountry(null);
      }
    } catch (err) {
      console.error('Error handling globe click:', err);
      setSelectedCountry(null);
    }
  };
  
  // Function to zoom to a country
  const zoomToCountry = (country: Country) => {
    if (!globeRef.current || !globeRef.current.pointOfView) return;
    
    try {
      // Set zoom state first
      setZoomState({
        isZoomed: true,
        countryId: country.id,
        regionId: null
      });
      
      // Calculate altitude based on country population (proxy for area)
      // This is a simplified approach - ideally would use actual geographic boundaries
      const populationFactor = Math.log10(country.population) / 3; // Scale population logarithmically
      const altitude = 0.8 / populationFactor; // Closer zoom for bigger countries
      
      // Zoom to the country
      (globeRef.current as any).pointOfView({
        lat: country.coordinates.lat,
        lng: country.coordinates.lng,
        altitude: altitude
      }, 1000); // 1000ms transition
    } catch (err) {
      console.error('Error zooming to country:', err);
    }
  };
  
  // Reset zoom to global view
  const resetZoom = () => {
    if (!globeRef.current || !globeRef.current.pointOfView) return;
    
    try {
      // Reset zoom state
      setZoomState({
        isZoomed: false,
        countryId: null,
        regionId: null
      });
      
      // Reset selected country and parcel
      setSelectedCountry(null);
      setSelectedParcel(null);
      
      // Zoom out to global view
      (globeRef.current as any).pointOfView({
        lat: 0,
        lng: 0,
        altitude: 2.5
      }, 1000); // 1000ms transition
    } catch (err) {
      console.error('Error resetting zoom:', err);
    }
  };

  // Handle mouse move for hover effects on HTML elements
  const handleElementHover = (elementData: any | null) => {
    if (!globeRef.current) return;
    
    try {
      if (elementData && elementData.id) {
        const country = countries.find(c => c.id === elementData.id);
        if (country) {
          setHoveredCountry(country);
        } else {
          setHoveredCountry(null);
        }
      } else {
        setHoveredCountry(null);
      }
    } catch (err) {
      console.error('Error handling globe mouse move:', err);
      setHoveredCountry(null);
    }
  };
  
  // Handle region selection
  const handleSelectRegion = (regionId: string) => {
    const region = regions.find(r => r.id === regionId);
    if (!region) return;
    
    // Update zoom state
    setZoomState(prev => ({
      ...prev,
      regionId
    }));
    
    // Simulate loading parcels for the region
    setLoadingParcels(true);
    setTimeout(() => {
      setLoadingParcels(false);
    }, 500); // Simulate load time
    
    // Zoom to the region if we have globe controls
    if (globeRef.current && globeRef.current.pointOfView) {
      // Zoom in closer to the region
      (globeRef.current as any).pointOfView({
        lat: region.coordinates.lat,
        lng: region.coordinates.lng,
        altitude: 0.3 // Closer zoom for regions
      }, 1000); // 1000ms transition
    }
  };
  
  // Handle going back from region to country view
  const handleRegionGoBack = () => {
    const country = countries.find(c => c.id === zoomState.countryId);
    if (!country) return;
    
    // Reset to country view
    setZoomState(prev => ({
      ...prev,
      regionId: null
    }));
    
    // Zoom back to country
    zoomToCountry(country);
  };
  
  // Handle parcel selection
  const handleSelectParcel = (parcelId: string) => {
    const parcel = parcels.find(p => p.id === parcelId);
    if (!parcel || parcel.owner) return; // Don't select already owned parcels
    
    setSelectedParcel(parcel);
  };
  
  // Handle parcel purchase
  const handlePurchaseParcel = useCallback((parcelId: string) => {
    if (!wallet.address) return;
    
    // Find the parcel
    const parcel = parcels.find(p => p.id === parcelId);
    if (!parcel) return;
    
    // Simulate purchase
    setParcels(prev => prev.map(p => {
      if (p.id === parcelId) {
        return {
          ...p,
          owner: wallet.address,
          purchaseDate: new Date().toISOString()
        };
      }
      return p;
    }));
    
    // Close the purchase modal
    setSelectedParcel(null);
    
    // Show success message
    alert(`Successfully purchased parcel ${parcelId} for ${parcel.price} RIF!`);
  }, [parcels, wallet.address]);

  return (
    <div 
      className="globe-container" 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        zIndex: 2
      }}
    >
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'relative',
          zIndex: 2
        }}
      >
      </div>
  
      {/* Error message */}
      {error && (
        <div className="globe-error">
          {error}
        </div>
      )}
      
      {/* Country info panels and UI */}
      
      {/* Country hover info (only shown when not zoomed and hovering) */}
      {hoveredCountry && !selectedCountry && !zoomState.isZoomed && (
        <div className="country-hover-label">
          <div className="country-name">{hoveredCountry.name}</div>
          <div className="country-gdp">${(hoveredCountry.gdp / 1000).toFixed(1)}T</div>
          <div className={`country-growth ${hoveredCountry.gdp > hoveredCountry.previousGdp ? 'growing' : 'shrinking'}`}>
            {hoveredCountry.gdp > hoveredCountry.previousGdp ? '🟢' : '🔴'} 
            {((hoveredCountry.gdp - hoveredCountry.previousGdp) / hoveredCountry.previousGdp * 100).toFixed(1)}%
          </div>
        </div>
      )}
      
      {/* Country details panel (for non-zoomed state) */}
      {selectedCountry && !zoomState.isZoomed && (
        <div className="country-details">
          <h3>{selectedCountry.name}</h3>
          <div className="detail-row">
            <span>GDP:</span>
            <span>${(selectedCountry.gdp / 1000).toFixed(1)}T</span>
          </div>
          <div className="detail-row">
            <span>Population:</span>
            <span>{(selectedCountry.population).toFixed(1)}M</span>
          </div>
          <div className="detail-row">
            <span>Growth:</span>
            <span className={selectedCountry.gdp > selectedCountry.previousGdp ? 'growing' : 'shrinking'}>
              {selectedCountry.gdp > selectedCountry.previousGdp ? '🟢' : '🔴'} 
              {((selectedCountry.gdp - selectedCountry.previousGdp) / selectedCountry.previousGdp * 100).toFixed(1)}%
            </span>
          </div>
          <h4>Trade Partners</h4>
          <div className="trade-partners">
            {selectedCountry.tradePartners.map(partner => {
              const partnerCountry = countries.find(c => c.id === partner.countryId);
              if (!partnerCountry) return null;
              
              return (
                <div key={partner.countryId} className="trade-partner">
                  <div className="partner-name">{partnerCountry.name}</div>
                  <div className="partner-stats">
                    <div>Import: ${partner.importVolume}B</div>
                    <div>Export: ${partner.exportVolume}B</div>
                    <div>Tariff: {partner.tariffRate}%</div>
                  </div>
                </div>
              );
            })}
          </div>
          <button 
            className="explore-button"
            onClick={() => zoomToCountry(selectedCountry)}
          >
            Explore Regions
          </button>
          <button 
            className="close-button"
            onClick={() => setSelectedCountry(null)}
          >
            Close
          </button>
        </div>
      )}
      
      {/* Zoom controls */}
      {zoomState.isZoomed && (
        <div className="zoom-controls">
          <button 
            className="zoom-out-btn"
            onClick={resetZoom}
          >
            🌎 View World
          </button>
        </div>
      )}
      
      {/* Loading indicator for parcels */}
      {loadingParcels && (
        <div className="loading-parcels">
          <div className="loading-spinner"></div>
          <div>Loading region parcels...</div>
        </div>
      )}
      
      {/* Region view when zoomed to country */}
      {zoomState.isZoomed && zoomState.countryId && !zoomState.regionId && (
        <RegionView
          country={countries.find(c => c.id === zoomState.countryId) as Country}
          regions={countryRegions}
          wallet={wallet}
          onSelectRegion={handleSelectRegion}
          onClose={resetZoom}
        />
      )}
      
      {/* Parcel grid when zoomed to region */}
      {zoomState.isZoomed && zoomState.regionId && selectedRegion && (
        <ParcelGrid
          region={selectedRegion}
          parcels={regionParcels}
          wallet={wallet}
          onSelectParcel={handleSelectParcel}
          onGoBack={handleRegionGoBack}
        />
      )}
      
      {/* Parcel purchase modal */}
      {selectedParcel && selectedRegion && (
        <div className="purchase-modal-container">
          <ParcelPurchase
            selectedParcel={selectedParcel}
            selectedRegion={selectedRegion}
            wallet={wallet}
            onPurchase={handlePurchaseParcel}
            onClose={() => setSelectedParcel(null)}
          />
        </div>
      )}
      
      {/* Add some basic CSS */}
      <style>
        {`
          .gdp-bar-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 60px;
            transform: translate(-50%, -50%);
            pointer-events: auto;
            cursor: pointer;
          }
          
          .country-map-label {
            font-size: 10px;
            padding: 2px 4px;
            background: rgba(0,0,0,0.6);
            border-radius: 3px;
            color: white;
            margin-bottom: 2px;
            text-align: center;
            max-width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .bar-visual-container {
            height: 50px;
            display: flex;
            align-items: flex-end;
          }
          
          .gdp-bar {
            width: 5px;
            height: 20px;
            background-color: #4caf50;
          }
          
          .zoom-controls {
            position: absolute;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
          }
          
          .zoom-controls button {
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .loading-parcels {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.7);
            padding: 20px;
            border-radius: 8px;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .loading-spinner {
            width: 30px;
            height: 30px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 10px;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .country-details {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0,0,0,0.7);
            padding: 15px;
            border-radius: 8px;
            color: white;
            max-width: 300px;
            z-index: 1000;
          }
          
          .country-details h3 {
            margin-top: 0;
            margin-bottom: 15px;
            border-bottom: 1px solid rgba(255,255,255,0.3);
            padding-bottom: 8px;
          }
          
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          
          .growing {
            color: #4caf50;
          }
          
          .shrinking {
            color: #f44336;
          }
          
          .trade-partners {
            margin-top: 10px;
            max-height: 150px;
            overflow-y: auto;
          }
          
          .trade-partner {
            margin-bottom: 10px;
            padding: 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
          }
          
          .partner-name {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .partner-stats {
            display: flex;
            justify-content: space-between;
            font-size: 0.85em;
            flex-wrap: wrap;
          }
          
          .partner-stats div {
            flex: 1 1 auto;
            margin-right: 5px;
          }
          
          .explore-button, .close-button {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 8px 12px;
            margin-top: 10px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
          }
          
          .explore-button {
            background: rgba(66, 135, 245, 0.5);
          }
          
          .explore-button:hover, .close-button:hover {
            background: rgba(255,255,255,0.3);
          }
          
          .explore-button:hover {
            background: rgba(66, 135, 245, 0.7);
          }
          
          .purchase-modal-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
          }
          
          .globe-error {
            position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
} 