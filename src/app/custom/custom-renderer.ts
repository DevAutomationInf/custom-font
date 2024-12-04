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
import {getBounds, getLabelColor, getSemantic} from "bpmn-js/lib/draw/BpmnRenderUtil";

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
      svgAppend(parentGfx, text);

      return text;
    } else {

      element?.di.label?.set('style', {fontSize:40, 'stroke': 'blue'});
      console.log('label',element?.di.label)
      return super.drawShape(parentGfx, element);
    }





  }

   // @ts-ignore attempt to override method, not working
  override renderEmbeddedLabel(parentGfx: SVGElement, element:Shape, align: any, attrs = {}){
    console.log('renderEmbeddedLabel style',element.di.label.labelStyle);

    const semantic = getSemantic(element);

    const box = getBounds({
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height
    }, attrs);

    // @ts-ignore
    return super.renderLabel(parentGfx, semantic.name, {
      align,
      box,
      padding: 7,
      style: {
        // @ts-ignore
        fill: getLabelColor(element, super.defaultLabelColor, super.defaultStrokeColor, attrs.stroke),
        ...element.di.label.labelStyle,
      }
    });
  }
}
