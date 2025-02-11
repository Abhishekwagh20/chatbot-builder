import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '../lib/supabaseClient';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Question Node' },
    position: { x: 250, y: 150 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Response Node' },
    position: { x: 250, y: 300 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function BuilderPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const onNodesChange = useCallback((changes: any) => {
    // Update nodes (if needed)
    setNodes((nds) => nds.map((node) => node));
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    // Update edges (if needed)
    setEdges((eds) => eds.map((edge) => edge));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const handleExport = () => {
    const template = { nodes, edges };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(template, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "template.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  

  useEffect(() => {
    const imported = localStorage.getItem('importedTemplate');
    if (imported) {
      try {
        const parsed = JSON.parse(imported);
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
          // Remove the stored template after loading
          localStorage.removeItem('importedTemplate');
        }
      } catch (err) {
        console.error('Failed to load imported template:', err);
      }
    }
  }, []);
  

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedTemplateId(id);
    const templateObj = templates.find((temp) => temp.id === id);
    if (templateObj && templateObj.template) {
      try {
        const parsed = JSON.parse(templateObj.template);
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
        }
      } catch (err) {
        console.error('Invalid template JSON:', err);
      }
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      <div className="p-4 bg-gray-200 flex items-center space-x-4">
        <label className="mr-2">Load Template:</label>
        <select value={selectedTemplateId} onChange={handleTemplateSelect}>
          <option value="">Select a template</option>
          {templates.map((temp) => (
            <option key={temp.id} value={temp.id}>
              {temp.id} - {new Date(temp.created_at).toLocaleString()}
            </option>
          ))}
        </select>
        <button
          onClick={handleExport}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          Export Template
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
  
}
