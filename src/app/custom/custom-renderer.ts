import BaseRenderer, { BpmnRendererConfig } from 'bpmn-js/lib/draw/BpmnRenderer.js';
import PathMap from 'bpmn-js/lib/draw/PathMap';
import TextRenderer from 'bpmn-js/lib/draw/TextRenderer';
import { getLabel } from 'bpmn-js/lib/features/label-editing/LabelUtil';
import { Shape } from 'bpmn-js/lib/model/Types';
import EventBus from 'diagram-js/lib/core/EventBus';
import Styles from 'diagram-js/lib/draw/Styles';
import Canvas from 'diagram-js/lib/core/Canvas';
import TextUtil from 'diagram-js/lib/util/Text';
import { append as svgAppend, attr as svgAttr,} from 'tiny-svg';

export class CustomRenderer extends BaseRenderer {
  static override $inject = ['config.bpmnRenderer', 'eventBus', 'styles', 'pathMap', 'canvas', 'textRenderer'];
  textRenderer: TextRenderer;
  bpmnRenderer: BpmnRendererConfig;
  private readonly svgBox = {
    width: 39,
    height: 39,
  };

  constructor(
    bpmnRenderer: BpmnRendererConfig,
    eventBus: EventBus,
    styles: Styles,
    pathMap: PathMap,
    canvas: Canvas,
    textRenderer: TextRenderer,
  ) {
    super(bpmnRenderer, eventBus, styles, pathMap, canvas, textRenderer, 1500);
    this.bpmnRenderer = bpmnRenderer;
    this.textRenderer = textRenderer;
  }

  override canRender(element: Shape): boolean {
    return true;
  }

  override drawShape(parentGfx: SVGElement, element: Shape): SVGElement {
    console.log(element);
    const fontSize = element?.businessObject?.extensionElements?.values.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ name }: any) => name === 'fontSize',
    )?.value;

    const textUtil = new TextUtil({
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize,
        fontWeight: 'normal',
        lineHeight: 1.2,
      },
    });
    if(element.type === 'label'){

      const label = getLabel(element);
      const box = this.textRenderer.getExternalLabelBounds({ width: 90, height: 30, x: 0, y: 9.8 }, label);
      let text = textUtil.createText(label, {
        align: 'center-top',
        box,
      });
      if (element.di?.label?.bounds) {
        const { width, height } = element.di.label.bounds;
        text = textUtil.createText(getLabel(element), { box: { width, height } });
      }
      svgAppend(parentGfx, text);

      return text;
    } else {

      // const shape = super.drawShape(parentGfx, element);
      // console.log('shape',shape);
      // console.log('parentGfx',parentGfx);
      const text = textUtil.createText(getLabel(element), { style: {fontSize: '40'} });
      // const style = {...text.style, fontSize:40};
      // svgAttr(text,{style} );
      // console.log('text',text);
      // console.log('label',element?.di.label);
      // element?.di.label.set('fontSize', 90)
      // element?.di?.set('label', text);
      // element?.di?.set('stroke', 'blue');
      element?.di.label?.set('fontSize', '40');
      return super.drawShape(parentGfx, element);
    }





  }
}
