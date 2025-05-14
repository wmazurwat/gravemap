import React, { useMemo, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import dagre from "dagre";
import { useNavigate } from "react-router-dom";

const nodeWidth = 180;
const nodeHeight = 60;

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

const RelationGraph = ({ person, relatives }) => {
  const navigate = useNavigate();

  const rawNodes = useMemo(() => {
    if (!person) return [];
    return [
      {
        id: person.id,
        data: { label: `${person.firstName} ${person.lastName}` },
        style: { background: "#dff", border: "1px solid #555" },
      },
      ...(relatives || []).map((rel) => ({
        id: rel.id,
        data: { label: `${rel.firstName} ${rel.lastName}` },
        style: { background: "#ffd", border: "1px solid #555" },
      })),
    ];
  }, [person, relatives]);

  const rawEdges = useMemo(() => {
    if (!person || !relatives) return [];
    const validIds = new Set(relatives.map((r) => r.id));
    return (person.relatives || [])
      .filter((rel) => validIds.has(rel.id))
      .map((rel) => ({
        id: `e-${person.id}-${rel.id}`,
        source: person.id,
        target: rel.id,
        label: rel.type,
        animated: true,
        style: { stroke: "#888" },
      }));
  }, [person, relatives]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!person) return;
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      rawNodes,
      rawEdges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [rawNodes, rawEdges, person, setNodes, setEdges]);

  const handleDoubleClick = (_, node) => {
    navigate(`/person/${node.id}`);
  };

  if (!person) return <p>Ładowanie grafu...</p>;

  return (
    <div style={{ width: "100%", height: 500, marginTop: 30 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDoubleClick={handleDoubleClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default RelationGraph;
