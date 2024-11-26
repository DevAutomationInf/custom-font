import {ModdleElement, ModdleExtension} from "bpmn-js/lib/model/Types";

 const EXTENSION_TAG= 'ipi:attribute';

export const MODDLE_EXTENSIONS = {
  processInteligence: {
    name: 'Process Intelligence',
    prefix: 'ipi',
    uri: 'http://www.infor.com/ipi',
    types: [
      {
        name: 'attribute',
        superClass: ['Element'],
        properties: [
          {
            name: 'name',
            isAttr: true,
            type: 'String',
          },
          {
            name: 'value',
            isAttr: true,
            type: 'String',
          },
        ],
      },
    ],
  },
};
export const getUpdatedExtensions = (
  modeler: any,
  key: string,
  value: string,
): ModdleExtension => {
  const moddle = modeler.get('moddle');
  const extensionElements = moddle.create('bpmn:ExtensionElements');
  if (value) {
    const attribute = moddle.create(EXTENSION_TAG);
    attribute.name = key;
    attribute.value = value;
    extensionElements.set('values', [attribute]);
  }

  return extensionElements;
};

export const updateProperties = (modeler: any, element: ModdleElement, property: unknown): void => {
  modeler.get('modeling').updateProperties(element, property);
};
