'use client';
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';
import * as turf from '@turf/turf';
import { FeatureCollection, Feature, Polygon } from 'geojson';

interface DistrictProperties {
  dist_numc: string | number;
  [key: string]: any; // allow other properties
}

type DistrictFeature = Feature<Polygon, DistrictProperties>;
type DistrictGeoJSON = FeatureCollection<Polygon, DistrictProperties>;

const ChoroplethMap: React.FC = () => {
  const [geoData, setGeoData] = useState<DistrictGeoJSON | null>(null);
  const [crimeDistrictValues, setCrimeDistrictValues] = useState<
    Record<string, { id: string; value: number }[]>
  >({});
  const [selectedCrime, setSelectedCrime] = useState<string>('');

  useEffect(() => {
    Promise.all([
      d3.json<DistrictGeoJSON>('/api/districts'),
      d3.csv('/cartodb-query_1.csv'),
    ])
      .then(([geojson, csv]) => {
        if (!geojson || !geojson.features) {
          console.error('GeoJSON not loaded correctly', geojson);
          return;
        }

        setGeoData(geojson);

        // Build nested counts: crimeType -> districtId -> count
        const crimeCounts: Record<string, Record<string, number>> = {};

        csv.forEach((row: any) => {
          const crimeType = row.text_general_code;
          const lon = parseFloat(row.point_x);
          const lat = parseFloat(row.point_y);

          if (!isNaN(lon) && !isNaN(lat)) {
            const point = turf.point([lon, lat]);
            geojson.features.forEach((feature: DistrictFeature) => {
              if (turf.booleanPointInPolygon(point, feature)) {
                const districtId = String(feature.properties.dist_numc);
                if (!crimeCounts[crimeType]) crimeCounts[crimeType] = {};
                crimeCounts[crimeType][districtId] =
                  (crimeCounts[crimeType][districtId] || 0) + 1;
              }
            });
          }
        });

        // Convert to districtValues arrays per crime type
        const valuesByCrime: Record<string, { id: string; value: number }[]> = {};
        Object.keys(crimeCounts).forEach((crimeType) => {
          valuesByCrime[crimeType] = geojson.features.map((f: DistrictFeature) => ({
            id: String(f.properties.dist_numc),
            value: crimeCounts[crimeType][String(f.properties.dist_numc)] || 0,
          }));
        });

        setCrimeDistrictValues(valuesByCrime);

        // Default to the first crime type
        const firstCrime = Object.keys(valuesByCrime)[0];
        if (firstCrime) setSelectedCrime(firstCrime);
      })
      .catch((err) => {
        console.error('Error loading data:', err);
      });
  }, []);

  if (!geoData) return <div>Loading map...</div>;

  const districtValues = crimeDistrictValues[selectedCrime] || [];

  return (
    <div>
      {/* Dropdown selector */}
      <label>
        Select crime type:{' '}
        <select
          value={selectedCrime}
          onChange={(e) => setSelectedCrime(e.target.value)}
        >
          {Object.keys(crimeDistrictValues).map((crime) => (
            <option key={crime} value={crime}>
              {crime}
            </option>
          ))}
        </select>
      </label>

      {/* Choropleth map */}
      <Plot
        data={[
          {
            type: 'choroplethmapbox',
            geojson: geoData,
            locations: districtValues.map((d) => d.id),
            z: districtValues.map((d) => d.value),
            featureidkey: 'properties.dist_numc',
            colorscale: 'Reds',
            marker: { line: { width: 0 } },
          } as any,
        ]}
        layout={{
          width: 800,
          height: 600,
          mapbox: {
            style: 'carto-positron',
            center: { lat: 39.95, lon: -75.16 }, // Philly
            zoom: 10,
          },
          margin: { t: 0, b: 0, l: 0, r: 0 },
        }}
        config={{ responsive: true }}
      />
    </div>
  );
};

export default ChoroplethMap;