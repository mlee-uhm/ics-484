'use client';

/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

const ScatterMap: React.FC = () => {
  const [dataLat, setLat] = useState<number[]>([]);
  const [dataLon, setLon] = useState<number[]>([]);

  useEffect(() => {
    d3.csv('/cartodb-query_1.csv').then((data: any[]) => {
      const lat: number[] = [];
      const lon: number[] = [];

      const sample = d3.shuffle(data).slice(0, 1000);

      sample.forEach((d) => {
        const latitude = Number(d.point_y?.trim());
        const longitude = Number(d.point_x?.trim());

        if (
          !Number.isNaN(latitude)
          && !Number.isNaN(longitude)
          && latitude !== 0 // 🚫 filter out bad rows
          && longitude !== 0
          && latitude >= -90
          && latitude <= 90
          && longitude >= -180
          && longitude <= 180
        ) {
          lat.push(latitude);
          lon.push(longitude);
        }
      });

      setLat(lat);
      setLon(lon);
    });
  }, []);

  // Render nothing until data is ready to avoid hydration mismatch
  if (dataLat.length === 0 || dataLon.length === 0) return null;

  const minLat = d3.min(dataLat) ?? 39.95;
  const maxLat = d3.max(dataLat) ?? 39.95;
  const minLon = d3.min(dataLon) ?? -75.16;
  const maxLon = d3.max(dataLon) ?? -75.16;

  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;

  return (
    <Plot
      data={[
        {
          type: 'scattermap', // ✅ new MapLibre trace type
          lat: dataLat,
          lon: dataLon,
          mode: 'markers',
          marker: { size: 8, color: 'red' },
        },
      ]}
      layout={{
        width: 800,
        height: 600,
        map: {
          style: 'open-street-map', // ✅ free tile style
          center: { lat: centerLat, lon: centerLon },
          zoom: 10,
        },
        margin: { t: 0, b: 0, l: 0, r: 0 },
      }}
      config={{
        responsive: true, // ✅ no Mapbox token needed
      }}
    />
  );
};

export default ScatterMap;
