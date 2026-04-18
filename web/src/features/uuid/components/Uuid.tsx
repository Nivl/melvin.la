"use client";

import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  NumberField,
  Select,
  TextField,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  NIL as uuidNIL,
  v1 as uuidV1,
  v3 as uuidV3,
  v5 as uuidV5,
  v6 as uuidV6,
  v7 as uuidV7,
} from "uuid";

import { Section } from "#shared/components/layout/Section";

const availableNamespaces = [
  {
    label: "DNS",
    key: "dns",
    uuid: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  },
  {
    label: "URL",
    uuid: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    key: "url",
  },
  {
    label: "OID",
    uuid: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
    key: "oid",
  },
  {
    label: "X.500",
    uuid: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
    key: "x500",
  },
  {
    label: "Custom",
    key: "custom",
  },
];

const namespaceKeyToUuid: Record<string, string> = {};
for (const ns of availableNamespaces) {
  if (ns.uuid) {
    namespaceKeyToUuid[ns.key] = ns.uuid;
  }
}

const availableUuidTypes = [
  {
    label: "Null",
    generate: (_name: string, _namespace: string) => uuidNIL,
    needNamespace: false,
    key: "null",
  },
  {
    label: "v1",
    generate: (_name: string, _namespace: string) => uuidV1(),
    needNamespace: false,
    key: "v1",
  },
  {
    label: "v3",
    generate: (name: string, namespace: string) => uuidV3(name, namespace),
    needNamespace: true,
    key: "v3",
  },
  {
    label: "v4",
    generate: (_name: string, _namespace: string) => crypto.randomUUID(),
    needNamespace: false,
    key: "v4",
  },
  {
    label: "v5",
    generate: (name: string, namespace: string) => uuidV5(name, namespace),
    needNamespace: true,
    key: "v5",
  },
  {
    label: "v6",
    generate: (_name: string, _namespace: string) => uuidV6(),
    needNamespace: false,
    key: "v6",
  },
  {
    label: "v7",
    generate: (_name: string, _namespace: string) => uuidV7(),
    needNamespace: false,
    key: "v7",
  },
];

const uuidKeyToGenerate: Record<string, (name: string, namespace: string) => string> = {};
for (const ns of availableUuidTypes) {
  uuidKeyToGenerate[ns.key] = ns.generate;
}

export const Uuid = () => {
  const t = useTranslations("uuid");

  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState("v4");
  const [name, setName] = useState("");
  const [namespace, setNamespace] = useState("");
  const [customNamespace, setCustomNamespace] = useState("");

  const needsExtraFields = ["v3", "v5"].includes(version);
  const uniqueUUID = ["null", "v3", "v5"].includes(version);

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (uuidKeyToGenerate[version]) {
      const namespaceToUse =
        namespace === "custom" ? customNamespace : namespaceKeyToUuid[namespace];

      const generate = uuidKeyToGenerate[version];
      const newUuids = Array.from({ length: count }, () => generate(name, namespaceToUse ?? ""));
      setUuids([...newUuids]);
    }
  };

  return (
    <>
      <Section>
        <h1 className="text-center font-condensed text-6xl leading-tight-xs font-bold uppercase sm:text-8xl sm:leading-tight-sm xl:text-9xl xl:leading-tight-xl">
          {t("title")}
        </h1>
      </Section>

      <Section>
        <Form className="flex flex-col items-center gap-4" onSubmit={onSubmit}>
          <Select
            isRequired
            placeholder={t("versionPlaceholder")}
            className="w-full max-w-[400px]"
            value={version}
            onChange={(value) => {
              if (!value) {
                return;
              }

              const key = value.toString();
              setVersion(key);
              if (["null", "v3", "v5"].includes(key)) {
                setCount(1);
              }
            }}
          >
            <Label>{t("versionLabel")}</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {availableUuidTypes.map((uuid) => (
                  <ListBox.Item key={uuid.key} id={uuid.key} textValue={uuid.label}>
                    {uuid.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          {needsExtraFields && (
            <>
              <TextField
                isRequired={needsExtraFields}
                className="w-full max-w-[400px]"
                type="text"
                value={name}
                onChange={setName}
              >
                <Label>{t("nameLabel")}</Label>
                <Input placeholder={t("namePlaceholder")} />
              </TextField>

              <Select
                isRequired={needsExtraFields}
                placeholder={t("namespacePlaceholder")}
                className="w-full max-w-[400px]"
                value={namespace}
                onChange={(value) => {
                  if (!value) {
                    return;
                  }
                  setNamespace(value.toString());
                }}
              >
                <Label>{t("namespaceLabel")}</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {availableNamespaces.map((ns) => (
                      <ListBox.Item key={ns.key} id={ns.key} textValue={ns.label}>
                        {ns.label}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              {namespace === "custom" && (
                <TextField
                  validate={(value) => {
                    const isValidCustomNamespace =
                      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
                    return isValidCustomNamespace ? undefined : t("customNamespaceError");
                  }}
                  isRequired={needsExtraFields && namespace === "custom"}
                  className="w-full max-w-[400px]"
                  type="text"
                  value={customNamespace}
                  onChange={setCustomNamespace}
                >
                  <Label>{t("customNamespaceLabel")}</Label>
                  <Input placeholder={t("customNamespacePlaceholder")} />
                  <FieldError />
                </TextField>
              )}
            </>
          )}
          {!uniqueUUID && (
            <NumberField
              isRequired
              className="w-full max-w-[400px]"
              maxValue={100}
              minValue={1}
              value={count}
              onChange={setCount}
            >
              <Label>{t("countLabel")}</Label>
              <NumberField.Group>
                <NumberField.DecrementButton />
                <NumberField.Input />
                <NumberField.IncrementButton />
              </NumberField.Group>
            </NumberField>
          )}

          <Button type="submit" variant="outline">
            {t("actionGenerate")}
          </Button>
        </Form>

        <div className="mt-16 flex flex-col items-center gap-4">
          {uuids.map((uuid) => (
            <div key={uuid}>{uuid}</div>
          ))}
        </div>
      </Section>
    </>
  );
};
