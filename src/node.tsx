import { compact } from 'lodash';
import { Node } from 'reactflow';

// const keepList = [
//   'edge_stack',
//   'edge_update_schedule',
//   'edgegroups',
//   'endpoints',
//   'tags',
// ];

type DBItem = { Id?: string; EndpointId?: string };

function buildNode<T>([bucketName, rawContent]: [string, T]): Node[] | undefined {
  // if (!keepList.includes(bucketName)) {
  //   return;
  // }
  console.log(bucketName, rawContent)

  let content: Array<DBItem>;
  if (Array.isArray(rawContent)) {
    content = rawContent;
  } else if (typeof rawContent === 'object') {
    content = Object.values(rawContent as object)
  } else {
    console.error(bucketName, rawContent)
    return;
  }

  return content.map((item) => {
    const id = `${bucketName}-${item.Id || item.EndpointId}`;
    bucketName === 'snapshots' && console.log(id)
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
