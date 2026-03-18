import { EventBridgeEvent } from "aws-lambda";
import { InspectorCreatedEvent, InspectorDeletedEvent } from "vimo-events";
import { Inspector } from "../core/inspector";
import { logger } from "../core/utils";

export const handler = async (event: EventBridgeEvent<string, unknown>) => {
  switch (event["detail-type"]) {
    case InspectorCreatedEvent.type: {
      const parsed = InspectorCreatedEvent.parse(event.detail);
      await Inspector.update({
        agencyId: parsed.data.agencyId,
        email: parsed.data.email,
        firstname: parsed.data.given_name,
        lastname: parsed.data.family_name,
        oplock: parsed.timestamp,
        latched: true,
      });
      break;
    }
    case InspectorDeletedEvent.type: {
      const parsed = InspectorDeletedEvent.parse(event.detail);
      await Inspector.latchDelete(
        parsed.data.agencyId,
        parsed.data.email,
        parsed.timestamp,
      );
      break;
    }
    default:
      logger.warn("Ignoring unsupported event type", {
        detailType: event["detail-type"],
      });
  }

  return { ok: true };
};
