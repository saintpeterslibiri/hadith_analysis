import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ForceGraph3D from '3d-force-graph';
import * as d3 from 'd3';

const SimilarHadits = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5031/api/SimilarHadiths');
        const data = response.data;
        setData(precomputePositions(data));
        initGraph(precomputePositions(data));
      } catch (error) {
        console.error('Error fetching hadith network data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const handleResize = () => {
      if (graphRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        graphRef.current.width(width).height(height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (graphRef.current) {
        graphRef.current._destructor();
      }
    };
  }, []);

  const precomputePositions = (rawData) => {
    // Assuming you have some logic to compute node positions
    // Here is a dummy example of setting positions randomly
    const nodes = new Map();
    const links = [];

    rawData.forEach(item => {
      const addNode = (id, chain) => {
        if (!nodes.has(id)) {
          nodes.set(id, {
            id,
            chain: chain.split('; '),
            x: Math.random() * 1000 - 500, // Replace with your logic
            y: Math.random() * 1000 - 500, // Replace with your logic
            z: Math.random() * 1000 - 500  // Replace with your logic
          });
        }
      };

      addNode(item.hadith1_id, item.hadith1_chain);
      addNode(item.hadith2_id, item.hadith2_chain);

      links.push({
        source: item.hadith1_id,
        target: item.hadith2_id,
        similarity: item.similarity
      });
    });

    return {
      nodes: Array.from(nodes.values()),
      links: links
    };
  };

  const initGraph = (data) => {
    if (!containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();

    const graph = ForceGraph3D()(containerRef.current)
      .width(width)
      .height(height)
      .graphData(data)
      .backgroundColor('#101020')
      .linkColor(() => 'rgba(255,255,255,0.2)')
      .linkOpacity(1)
      .linkWidth(1)
      .nodeThreeObject(node => {
        return null; // Simplify node rendering to avoid performance issues
      })
      .nodeThreeObjectExtend(false)
      .onNodeHover(node => {
        containerRef.current.style.cursor = node ? 'pointer' : null;
        setHoveredNode(node);
      })
      .onNodeClick(node => {
        console.log('Clicked node:', node);
        setHoveredNode(node);
      });

    // Lazy loading & clustering
    graph.onZoomEnd(() => {
      loadMoreNodes(graph);
      clusterNodes(graph);
    });

    // Dynamic adjustments
    adjustNodeSizeAndLinkWidth(graph);

    graphRef.current = graph;
  };

  const loadMoreNodes = (graph) => {
    // Implement logic to load more nodes based on the graph's current state (e.g., zoom level, visible nodes)
  };

  const clusterNodes = (graph) => {
    // Implement logic to cluster densely connected nodes and display them as single entities
  };

  const adjustNodeSizeAndLinkWidth = (graph) => {
    const degrees = graph.graphData().nodes.map(node => 
      graph.graphData().links.filter(link => link.source === node || link.target === node).length
    );
    const maxDegree = Math.max(...degrees);
    const minDegree = Math.min(...degrees);

    graph.nodeVal(node => {
      const degree = graph.graphData().links.filter(link => link.source === node || link.target === node).length;
      return 5 + (degree - minDegree) / (maxDegree - minDegree) * 15;
    });

    graph.linkWidth(link => {
      return Math.log(link.similarity + 1) * 2;
    });
  };

  const handleFullScreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen().then(() => {
          const { width, height } = containerRef.current.getBoundingClientRect();
          if (graphRef.current) {
            graphRef.current.width(width).height(height);
          }
        });
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
      <div 
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '10px',
          cursor: 'pointer',
          zIndex: 1
        }}
        onClick={handleFullScreen}
      >
        Full Screen
      </div>
      {hoveredNode && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', padding: '10px' }}>
          ID: {hoveredNode.id}
        </div>
      )}
    </div>
  );
};

export default SimilarHadits;
