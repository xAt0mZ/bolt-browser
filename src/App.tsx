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
// import { forceSimulation } from 'd3-force';
// import { buildEdges } from './edge';

export function App() {
  const [rawDB, setRawDB] = useState('');
  const [filter, setFilter] = useState('');
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  // const [allEdges, setAllEdges] = useState<Edge[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  // const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { options, setOptions } = useOptions();

  const compute = useCallback(() => {
    const nodes = buildNodes(rawDB);
    const options = Object.entries(groupBy(nodes, (n) => n.data.bucket)).reduce(
      (acc, [bucket, nodes]) => {
        acc[bucket] = {
          ...uniq(nodes.flatMap((node) => Object.keys(node.data.data))).reduce(
            (acc, i) => {
              acc[i] = false;
              return acc;
            },
            {} as Option
          ),
          __internal__enabled: false,
        };
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
    const filteredNodes = allNodes.filter(
      (n) => n.id.includes(filter) && options[n.data.bucket].__internal__enabled
    );
    // const nodeNames = filteredNodes.map((n) => n.id);

    // const filteredEdges = allEdges.filter(
    //   (e) => nodeNames.includes(e.source) || nodeNames.includes(e.target)
    // );

    filteredNodes.map((n, idx) => {
      n.position = { x: idx * 100, y: idx * 100 };
    });
    setNodes(filteredNodes);

    // setEdges(filteredEdges);
  }, [allNodes, filter, options, setNodes]);

  const nodeTypes = useMemo(
    () => ({
      customNode: CustomNode,
    }),
    []
  );

  // const simulation = forceSimulation();
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
          allNodes={allNodes}
        />
        {!!allNodes.length && <OptionsPanel />}
      </Panel>
      <Controls position='top-right' />
      <MiniMap zoomable pannable />
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
  allNodes: Node[];
};
function InputPanel({
  rawDB,
  setRawDB,
  compute,
  setFilter,
  render,
  allNodes,
}: InputPanelProps) {
  return (
    <Collapsible trigger='Input options' open>
      <div className='flex flex-col gap-2'>
        <Upload title='Upload DB' onChange={setRawDB} id='upload-db' />
        <div className='flex justify-between gap-2'>
          <button
            className='rounded bg-white px-2 disabled:opacity-50'
            disabled={!rawDB}
            onClick={compute}
          >
            Compute graph
          </button>
          <input
            className='w-full'
            onChange={(e) => setFilter(e.target.value)}
          />
          <button
            disabled={!allNodes.length}
            className='rounded bg-white px-2 disabled:opacity-50'
            onClick={render}
          >
            Render graph
          </button>
        </div>
      </div>
    </Collapsible>
  );
}

function OptionsPanel() {
  const { options, setOptions } = useOptions();
  const [filter, setFilter] = useState('');

  return (
    <Collapsible trigger='Display options'>
      <input
        className='w-full'
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {Object.entries(options).map(([bucket, sub]) => (
        <div className='flex gap-2' key={bucket}>
          <input
            type='checkbox'
            className='self-start mt-1'
            checked={options[bucket].__internal__enabled}
            onChange={() =>
              setOptions((opts) => ({
                ...opts,
                [bucket]: {
                  ...opts[bucket],
                  __internal__enabled: !opts[bucket].__internal__enabled,
                },
              }))
            }
          />
          <Collapsible trigger={bucket} open={filter !== ''}>
            {Object.entries(sub).map(([fieldName, enabled], idx) => (
              <>
                {fieldName !== '__internal__enabled' &&
                  fieldName.toLowerCase().includes(filter) && (
                    <div key={idx} className='flex gap-2'>
                      <input
                        type='checkbox'
                        checked={enabled}
                        onChange={() =>
                          setOptions((opts) => ({
                            ...opts,
                            [bucket]: {
                              ...opts[bucket],
                              [fieldName]: !opts[bucket][fieldName],
                            },
                          }))
                        }
                      />
                      {fieldName}
                    </div>
                  )}
              </>
            ))}
          </Collapsible>
        </div>
      ))}
    </Collapsible>
  );
}
