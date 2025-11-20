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

      data.forEach((d) => {
        const latitude = Number(d.point_y);
        const longitude = Number(d.point_x);

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

  if (dataLat.length === 0 || dataLon.length === 0) return <div>Loading...</div>;

  const centerLat = d3.mean(dataLat) ?? 39.95;
  const centerLon = d3.mean(dataLon) ?? -75.16;

  return (
    <Plot
      data={[
        {
          type: 'scattermapbox',
          lat: dataLat,
          lon: dataLon,
          mode: 'markers',
          marker: { size: 12, color: 'red' },
        },
      ]}
      layout={{
        width: 800,
        height: 600,
        mapbox: {
          style: 'carto-positron',
          accesstoken:
            'pk.eyJ1IjoibWxlZTMxaGF3YWlpZWR1IiwiYSI6ImNtaTdhY2tsMDA5Z24ybHB3djRnOGxueDIifQ.YKlvLlk7MNfrHnF-VJ8m-Q',
          center: { lat: centerLat, lon: centerLon },
          zoom: 12,
        },
        margin: { t: 0, b: 0, l: 0, r: 0 },
      }}
    />
  );
};

export default ScatterMap;
