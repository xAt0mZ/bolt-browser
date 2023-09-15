import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  Panel,
  // Edge,
  Node,
  MiniMap,
} from 'reactflow';

import { Upload } from './Upload';
import { useCallback, useMemo, useState } from 'react';
import { buildNodes } from './node';
import { CustomNode } from './CustomNode';
import Collapsible from 'react-collapsible';
import { groupBy, uniq } from 'lodash';
import { Option, Options, useOptions } from './useOptions';
// import { buildEdges } from './edge';

export function App() {
  const [rawDB, setRawDB] = useState('');
  const [filter, setFilter] = useState('');
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  // const [allEdges, setAllEdges] = useState<Edge[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  // const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setOptions } = useOptions();

  const compute = useCallback(() => {
    const nodes = buildNodes(rawDB);
    const options = Object.entries(groupBy(nodes, (n) => n.data.bucket)).reduce(
      (acc, [bucket, nodes]) => {
        console.log(nodes);
        acc[bucket] = uniq(
          nodes.flatMap((node) => Object.keys(node.data.data))
        ).reduce((acc, i) => {
          acc[i] = false;
          return acc;
        }, {} as Option);
        return acc;
      },
      {} as Options
    );
    setAllNodes(nodes);
    setOptions(options);
    // const edges = buildEdges(rawEdges, nodes);
    // setAllEdges(edges);
  }, [rawDB, setOptions]);

  const render = useCallback(() => {
    const filteredNodes = allNodes.filter((n) => n.id.includes(filter));
    // const nodeNames = filteredNodes.map((n) => n.id);

    // const filteredEdges = allEdges.filter(
    //   (e) => nodeNames.includes(e.source) || nodeNames.includes(e.target)
    // );

    filteredNodes.map((n, idx) => {
      n.position = { x: idx * 100, y: idx * 100 };
    });
    setNodes(filteredNodes);

    // setEdges(filteredEdges);
  }, [allNodes, filter, setNodes]);

  const nodeTypes = useMemo(
    () => ({
      customNode: CustomNode,
    }),
    []
  );

  return (
    <ReactFlow
      nodes={nodes}
      // edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      // onEdgesChange={onEdgesChange}
    >
      <Panel
        position='top-left'
        className='border border-black p-2  bg-gray-400 rounded max-h-[95%] overflow-auto'
      >
        <InputPanel
          rawDB={rawDB}
          setRawDB={setRawDB}
          render={render}
          compute={compute}
          setFilter={setFilter}
        />
        {allNodes && <DisplayPanel />}
      </Panel>
      <Controls position='top-right' />
      <MiniMap />
      <Background />
    </ReactFlow>
  );
}

type InputPanelProps = {
  rawDB: string;
  setRawDB(v: string): void;
  compute(): void;
  setFilter(v: string): void;
  render(): void;
};
function InputPanel({
  rawDB,
  setRawDB,
  compute,
  setFilter,
  render,
}: InputPanelProps) {
  return (
    <Collapsible trigger='Input options' open>
      <div className='flex flex-col gap-2'>
        <div>
          <Upload title='Upload DB' onChange={setRawDB} id='upload-db' />
          <button
            className='rounded bg-white px-2 disabled:opacity-50'
            disabled={!rawDB}
            onClick={compute}
          >
            Compute graph
          </button>
        </div>
        <div className='flex justify-between gap-2'>
          Filter
          <input onChange={(e) => setFilter(e.target.value)} />
          <button
            // disabled={!allNodes.length || !allEdges.length}
            className='rounded bg-white px-2'
            onClick={render}
          >
            Render graph
          </button>
        </div>
      </div>
    </Collapsible>
  );
}

function DisplayPanel() {
  const { options, setOptions } = useOptions();
  return (
    <Collapsible trigger='Display options'>
      {Object.entries(options).map(([name, sub]) => (
        <Collapsible key={name} trigger={name}>
          {Object.entries(sub).map(([fieldName, enabled], idx) => (
            <div key={idx} className='flex gap-2'>
              <input
                type='checkbox'
                checked={enabled}
                onChange={() =>
                  setOptions((opts) => ({
                    ...opts,
                    [name]: {
                      ...opts[name],
                      [fieldName]: !opts[name][fieldName],
                    },
                  }))
                }
              />
              {fieldName}
            </div>
          ))}
        </Collapsible>
      ))}
    </Collapsible>
  );
}
