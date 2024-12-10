import Canvas, { CanvasConfig } from 'diagram-js/lib/core/Canvas';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import EventBus from 'diagram-js/lib/core/EventBus';
import GraphicsFactory from 'diagram-js/lib/core/GraphicsFactory';
import { Point, ScrollDelta } from 'diagram-js/lib/util/Types';

export default class CustomCanvas extends Canvas {
  static override $inject = ['config.canvas', 'eventBus', 'graphicsFactory', 'elementRegistry'];

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(
    config: CanvasConfig | null,
    eventBus: EventBus,
    graphicsFactory: GraphicsFactory,
    elementRegistry: ElementRegistry,
  ) {
    super(config, eventBus, graphicsFactory, elementRegistry);
  }

  override scroll(delta?: ScrollDelta): Point {
    const viewbox = this.viewbox();
    const scale = viewbox.scale || 1; // Ensure scale is not undefined or 0

    if (delta) {
      const { dx, dy } = delta;

      // Scale the deltas to match the current scale
      const scaledDx = (dx || 0) / scale;
      const scaledDy = (dy || 0) / scale;

      const nextY = viewbox.y - scaledDy;
      const nextX = viewbox.x - scaledDx;

      // Adjust limits for the scaled viewbox
      const minX = viewbox.inner.width + viewbox.inner.x - viewbox.outer.width / scale;
      const minY = viewbox.inner.height + viewbox.inner.y - viewbox.outer.height / scale;
      const maxX = viewbox.inner.x;
      const maxY = viewbox.inner.y;

      // Check if the next position is within bounds
      if (nextY < maxY && nextX < maxX && nextX > minX && nextY > minY) {
        return super.scroll({ dx: scaledDx, dy: scaledDy });
      }
    }

    return { x: viewbox.x, y: viewbox.y }; // Return the current position if out of bounds
  }
}
