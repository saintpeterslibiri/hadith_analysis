import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const HadithsNetworkChart = () => {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5031/api/SimilarHadiths');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching similar hadiths data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data && !isLoading) {
      const width = 928;
      const height = 600;
      const nodeRadius = 3;

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      const links = data.map(d => ({
        source: d.hadith1_id,
        target: d.hadith2_id,
        similarity: d.similarity
      }));

      const nodes = Array.from(new Set(links.flatMap(l => [l.source, l.target])))
        .map(id => ({ id }));

      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .stop();

      for (let i = 0; i < 300; ++i) simulation.tick();

      const draw = (transform) => {
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);

        context.strokeStyle = '#999';
        context.lineWidth = 0.5 / transform.k;
        links.forEach(link => {
          context.beginPath();
          context.moveTo(link.source.x, link.source.y);
          context.lineTo(link.target.x, link.target.y);
          context.stroke();
        });

        context.fillStyle = 'black';
        nodes.forEach(node => {
          context.beginPath();
          context.arc(node.x, node.y, nodeRadius / transform.k, 0, 2 * Math.PI);
          context.fill();
        });

        context.restore();
      };

      let transform = d3.zoomIdentity;

      const zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', (event) => {
          transform = event.transform;
          draw(transform);
        });

      d3.select(canvas)
        .call(zoom)
        .on('click', (event) => {
          const [x, y] = d3.pointer(event);
          const node = simulation.find((transform.invertX(x) - width / 2) / transform.k, (transform.invertY(y) - height / 2) / transform.k, nodeRadius * 2);
          if (node) {
            setSelectedNode(node);
          } else {
            setSelectedNode(null);
          }
        });

      draw(transform);
    }
  }, [data, isLoading]);

  const handleCopyId = () => {
    if (selectedNode) {
      navigator.clipboard.writeText(selectedNode.id)
        .then(() => alert('ID copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} width={928} height={600} />
      <div ref={overlayRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      }}>
        {selectedNode && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'white',
            padding: '5px',
            border: '1px solid black',
            pointerEvents: 'auto'
          }}>
            <p>Selected Node ID: {selectedNode.id}</p>
            <button onClick={handleCopyId}>Copy ID</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HadithsNetworkChart;