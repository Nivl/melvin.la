'use client';

import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { Select, SelectItem } from '@heroui/select';
import { useState } from 'react';
import {
  NIL as uuidNIL,
  v1 as uuidV1,
  v3 as uuidV3,
  v5 as uuidV5,
  v6 as uuidV6,
  v7 as uuidV7,
} from 'uuid';

import { Section } from '../layout/Section';

const availableNamespaces = [
  {
    label: 'DNS',
    key: 'dns',
    uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  },
  {
    label: 'URL',
    uuid: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    key: 'url',
  },
  {
    label: 'OID',
    uuid: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
    key: 'oid',
  },
  {
    label: 'X.500',
    uuid: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
    key: 'x500',
  },
  {
    label: 'Custom',
    key: 'custom',
  },
];

const namespaceKeyToUuid = availableNamespaces.reduce<Record<string, string>>(
  (acc, { key, uuid }) => {
    if (uuid) {
      acc[key] = uuid;
    }
    return acc;
  },
  {},
);

const availableUuidTypes = [
  {
    label: 'Null',
    generate: (_name: string, _namespace: string) => uuidNIL,
    needNamespace: false,
    key: 'null',
  },
  {
    label: 'v1',
    generate: (_name: string, _namespace: string) => uuidV1(),
    needNamespace: false,
    key: 'v1',
  },
  {
    label: 'v3',
    generate: (name: string, namespace: string) => uuidV3(name, namespace),
    needNamespace: true,
    key: 'v3',
  },
  {
    label: 'v4',
    generate: (_name: string, _namespace: string) => crypto.randomUUID(),
    needNamespace: false,
    key: 'v4',
  },
  {
    label: 'v5',
    generate: (name: string, namespace: string) => uuidV5(name, namespace),
    needNamespace: true,
    key: 'v5',
  },
  {
    label: 'v6',
    generate: (_name: string, _namespace: string) => uuidV6(),
    needNamespace: false,
    key: 'v6',
  },
  {
    label: 'v7',
    generate: (_name: string, _namespace: string) => uuidV7(),
    needNamespace: false,
    key: 'v7',
  },
];

const uuidKeyToGenerate = availableUuidTypes.reduce<
  Record<string, (name: string, namespace: string) => string>
>((acc, { key, generate }) => {
  acc[key] = generate;
  return acc;
}, {});

export const Uuid = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<number>(1);
  const [version, setVersion] = useState<string>('v4');
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('');
  const [customNamespace, setCustomNamespace] = useState<string>('');

  const needsExtraFields = ['v3', 'v5'].includes(version);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (uuidKeyToGenerate[version]) {
      const namespaceToUse =
        namespace === 'custom'
          ? customNamespace
          : namespaceKeyToUuid[namespace];

      const generate = uuidKeyToGenerate[version];
      const newUuids = Array.from({ length: count }, () =>
        generate(name, namespaceToUse ?? ''),
      );
      setUuids([...newUuids]);
    }
  };

  return (
    <>
      <Section>
        <h1 className="font-condensed leading-tight-xs sm:leading-tight-sm xl:leading-tight-xl text-center text-6xl uppercase sm:text-8xl xl:text-9xl">
          UUID Generator
        </h1>
      </Section>

      <Section>
        <Form className="items-center gap-4" onSubmit={onSubmit}>
          <Select
            isRequired
            className="max-w-[400px]"
            size="lg"
            label="UUID Version"
            placeholder="Select a UUID version"
            items={availableUuidTypes}
            selectedKeys={new Set([version])}
            onSelectionChange={key => {
              const v = Array.from(key)[0] as string;
              setVersion(v);
              if (['v3', 'v5'].includes(v)) {
                setCount(1);
              }
            }}
          >
            {uuid => <SelectItem>{uuid.label}</SelectItem>}
          </Select>

          {needsExtraFields && (
            <>
              <Input
                isRequired={needsExtraFields}
                className="max-w-[400px]"
                size="lg"
                label="Name"
                placeholder="Enter your name"
                type="text"
                value={name}
                onValueChange={setName}
              />

              <Select
                isRequired={needsExtraFields}
                className="max-w-[400px]"
                size="lg"
                label="Namespace"
                placeholder="Select a namespace"
                items={availableNamespaces}
                selectedKeys={new Set([namespace])}
                onSelectionChange={key => {
                  const ns = Array.from(key)[0] as string;
                  setNamespace(ns);
                }}
              >
                {namespace => <SelectItem>{namespace.label}</SelectItem>}
              </Select>

              {namespace === 'custom' && (
                <Input
                  isRequired={needsExtraFields && namespace === 'custom'}
                  className="max-w-[400px]"
                  size="lg"
                  label="Custom Namespace"
                  placeholder="Enter your namespace"
                  pattern="^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
                  errorMessage="Please enter a valid UUID"
                  type="text"
                  value={customNamespace}
                  onValueChange={setCustomNamespace}
                />
              )}
            </>
          )}

          {!needsExtraFields && (
            <NumberInput
              isRequired
              className="max-w-[400px]"
              size="lg"
              label="How many to generate"
              maxValue={100}
              minValue={1}
              value={count}
              onValueChange={setCount}
            />
          )}

          <Button type="submit" variant="bordered">
            Generate
          </Button>
        </Form>

        <div className="mt-16 flex flex-col items-center gap-4">
          {uuids.map(uuid => (
            <div key={uuid}>{uuid}</div>
          ))}
        </div>
      </Section>
    </>
  );
};
