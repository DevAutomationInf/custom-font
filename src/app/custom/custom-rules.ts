import { is } from 'bpmn-js/lib/util/ModelUtil';
import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

export default class CustomRules extends RuleProvider {
  static override $inject = ['bpmnRules', 'eventBus', 'spaceTool'];
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _bpmnRules: any;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _spaceTool: any;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(bpmnRules: any, eventBus: any, spaceTool: any) {
    super(eventBus);

    this._bpmnRules = bpmnRules;
    this._spaceTool = spaceTool;
  }

  override init(): void {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    super.addRule('shape.resize', Infinity, ({ shape, newBounds }: any) => {
      return (
        (!is(shape, 'bpmn:SequenceFlow') &&
          !is(shape, 'bpmn:MessageFlow') &&
          !is(shape, 'bpmn:Association') &&
          !this._spaceTool.isActive()) ||
        this._bpmnRules.canResize(shape, newBounds)
      );
    });
  }
}
