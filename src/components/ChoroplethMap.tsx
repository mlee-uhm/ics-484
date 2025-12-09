/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-extraneous-dependencies */

'use client';

import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';
import * as turf from '@turf/turf';
import { Col } from 'react-bootstrap';

import { FeatureCollection, Feature, Polygon } from 'geojson';

interface DistrictProperties {
  dist_numc: string | number;
  [key: string]: any;
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

          if (!Number.isNaN(lon) && !Number.isNaN(lat)) {
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

        const valuesByCrime: Record<string, { id: string; value: number }[]> =
          {};
        Object.keys(crimeCounts).forEach((crimeType) => {
          valuesByCrime[crimeType] = geojson.features.map(
            (f: DistrictFeature) => ({
              id: String(f.properties.dist_numc),
              value:
                crimeCounts[crimeType][String(f.properties.dist_numc)] || 0,
            })
          );
        });

        setCrimeDistrictValues(valuesByCrime);

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
    <Col
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
      }}
    >
      {/* Centered Dropdown Container 
        Added flex centering and a light background for visual separation
      */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center', // Centers horizontally
          alignItems: 'center', // Centers vertically
          padding: '10px',
          backgroundColor: '#f8f9fa', 
          width: '100%'
        }}
      >
        <label style={{ margin: 0, fontWeight: 'bold' }}>
          Select crime type:
          {' '}
          <select
            value={selectedCrime}
            onChange={(e) => setSelectedCrime(e.target.value)}
            style={{ marginLeft: '10px' }}
          >
            {Object.keys(crimeDistrictValues).map((crime) => (
              <option key={crime} value={crime}>
                {crime}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Map Container - Flexible height */}
      <div
        style={{
          flex: 1, // Grow to fill remaining space
          position: 'relative',
          width: '100%',
          minHeight: 0, // Prevent overflow
        }}
      >
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
              zmin: 0,
            } as any,
          ]}
          // Make the plot responsive and fill the div
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
          layout={{
            autosize: true,
            mapbox: {
              style: 'carto-positron',
              center: { lat: 40.00, lon: -75.13 }, // Philly
              zoom: 10,
            },
            margin: { t: 0, b: 0, l: 0, r: 0 },
          }}
          config={{ responsive: true }}
        />
      </div>
    </Col>
  );
};

export default ChoroplethMap;