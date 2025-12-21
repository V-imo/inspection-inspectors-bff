import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"

export interface InspectionInspectorsBffProps extends cdk.StackProps {
  serviceName: string;
  stage: string;
}

export class InspectionInspectorsBff extends cdk.Stack {
  constructor(scope: Construct, id: string, props: InspectionInspectorsBffProps) {
    super(scope, id, props)
    // Add your infra here...
  }
}
