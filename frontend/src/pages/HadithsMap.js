// HadithNetworkGraph.js

import * as d3 from 'd3';

// Set the dimensions and margins of the graph
const width = 960;
const height = 600;

const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid black");

document.body.appendChild(svg.node());

// Define a color scale
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Fetch the data from the API endpoint
fetch('http://localhost:5031/api/SimilarHadiths')
    .then(response => response.json())
    .then(data => {
        // Transform the data into nodes and links
        const nodes = {};
        const links = data.map(d => {
            nodes[d.hadith1_id] = nodes[d.hadith1_id] || { id: d.hadith1_id };
            nodes[d.hadith2_id] = nodes[d.hadith2_id] || { id: d.hadith2_id };
            return { source: d.hadith1_id, target: d.hadith2_id, similarity: d.similarity };
        });

        // Create the simulation
        const simulation = d3.forceSimulation(Object.values(nodes))
            .force("link", d3.forceLink(links).id(d => d.id).distance(d => 100 - d.similarity * 100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Add the links
        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", d => Math.sqrt(d.similarity));

        // Add the nodes
        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(Object.values(nodes))
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", d => color(d.id))
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(d => d.id);

        // Update the simulation on each tick
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });

        // Define drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    });
