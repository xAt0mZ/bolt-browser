import { compact } from 'lodash';
import { Node } from 'reactflow';

const keepList = [
  'edge_stack',
  'edge_update_schedule',
  'edgegroups',
  'endpoints',
  'tags',
];

type DBItem = { Name: string };

function buildNode<T>([bucketName, content]: [string, T]): Node[] | undefined {
  if (!keepList.includes(bucketName)) {
    return;
  }

  return (content as Array<unknown>).map((ukItem) => {
    const item = ukItem as DBItem;
    const id = `${bucketName}-${item.Name}`;
    return {
      id,
      position: { x: 0, y: 0 },
      type: 'customNode',
      data: {
        bucket: bucketName,
        data: item,
      },
    };
  });

  // if (bucketName === 'edge_stack') {
  //   return buildEdgeStackNodes(bucketName, content);
  // }

  // const id = `${bucketName}`;
  // return [
  //   {
  //     id,
  //     position: { x: 0, y: 0 },
  //     data: {
  //       bucket: bucketName,
  //       data: {},
  //       label: (
  //         <>
  //           <p className='bg-gray-200'>{id}</p>
  //         </>
  //       ),
  //     },
  //   },
  // ];
}

export function buildNodes(raw: string): Node[] {
  return compact(Object.entries(JSON.parse(raw)).flatMap(buildNode));
}
