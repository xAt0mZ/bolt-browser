// import { useStoreApi, useReactFlow, Panel } from 'reactflow';

// const panelStyle = {
//   color: '#777',
// };

// const buttonStyle = {
//   marginRight: 5,
//   marginTop: 5,
// };

// export function Buttons() {
//   const store = useStoreApi();
//   const { zoomIn, zoomOut, setCenter } = useReactFlow();

//   const focusNode = () => {
//     console.log("focus")
//     // const { nodeInternals } = store.getState();
//     // const nodes = Array.from(nodeInternals).map(([, node]) => node);

//     // if (nodes.length > 0) {
//     //   const node = nodes[0];

//     //   if (node) {
//     //     const x = node.position.x + node.width / 2;
//     //     const y = node.position.y + node.height / 2;
//     //     const zoom = 1.85;

//     //     setCenter(x, y, { zoom, duration: 1000 });
//     //   }
//     // }
//   };

//   return (
//     <Panel position='top-left' style={panelStyle}>
//       <div className='description'>
//         This is an example of how you can use the zoom pan helper hook
//       </div>
//       <div>
//         <button onClick={focusNode} style={buttonStyle}>
//           focus node
//         </button>
//         <button onClick={() => zoomIn} style={buttonStyle}>
//           zoom in
//         </button>
//         <button onClick={() => zoomOut} style={buttonStyle}>
//           zoom out
//         </button>
//       </div>
//     </Panel>
//   );
// }
