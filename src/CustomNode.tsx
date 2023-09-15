import { memo } from 'react';
import { clsx } from 'clsx';
import Collapsible from 'react-collapsible';

import { useOptions } from './useOptions';

type Props = {
  data: {
    bucket: string;
    data: any;
  };
};

export const CustomNode = memo<Props>(({ data: { data, bucket } }) => {
  return (
    <div
      className={clsx(
        'flex flex-col border border-black rounded-lg bg-gray-200 p-2',
        // data.Name.includes('update') ? 'border-dashed' : ''
      )}
    >
      <span>{bucket}</span>
      <Collapse data={data} />
    </div>
  );
});

function Collapse({ data }: { data: any }) {
  const { options } = useOptions();
  return (
    <>
      {Object.entries(data).map(([entry, value], key) => {
        if (!options['edge_stack'][entry]) {
          return null;
        }
        const isObject = typeof value === 'object';
        if (
          value &&
          ((isObject && Array.isArray(value) && typeof value[0] === 'object') || // if is array of objects
            (isObject && !Array.isArray(value))) // or if is object but not array of primitive
        ) {
          return (
            <Collapsible
              trigger={entry}
              className='items-start flex-col flex'
              key={key}
            >
              <Collapse data={value} />
            </Collapsible>
          );
        }
        return (
          <div key={key}>
            {entry} : {`${value}`}
          </div>
        );
      })}
    </>
  );
}
