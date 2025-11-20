/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

const ScatterMap: React.FC = () => {
  const [dataLat, setLat] = useState<number[]>([]);
  const [dataLon, setLon] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    d3.csv('/cartodb-query_1.csv').then((data: any[]) => {
      const lat: number[] = [];
      const lon: number[] = [];

      data.forEach((d) => {
        const latitude = Number(d.point_y);
        const longitude = Number(d.point_x);

        // only push valid rows
        if (
          !Number.isNaN(latitude)
          && !Number.isNaN(longitude)
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

  const centerLat = d3.mean(dataLat) ?? 0;
  const centerLon = d3.mean(dataLon) ?? 0;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '600px' }}>
      { mounted && (
        <Plot
          data={[
            {
              type: 'scattermapbox',
              lat: dataLat,
              lon: dataLon,
              mode: 'markers',
              marker: {
                size: 12,
                color: 'red',
              },
            },
          ]}
          layout={{
            width: 800,
            height: 600,
            mapbox: {
              style: 'mapbox://styles/mapbox/streets-v11',
              center: { lat: centerLat, lon: centerLon },
              zoom: 12,
            },
            margin: { t: 0, b: 0, l: 0, r: 0 },
          }}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
};

export default ScatterMap;
