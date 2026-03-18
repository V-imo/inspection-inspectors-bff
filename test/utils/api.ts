import { hc } from "hono/client";
import type { Routes } from "../../src/functions/apis/index";

export type InspectorInput = {
  email: string;
  firstName: string;
  lastName: string;
  agencyId: string;
};

export type InspectorResponse = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  agencyId: string;
};

export class ApiClient {
  client: ReturnType<typeof hc<Routes>>;

  constructor(baseUrl: string, userId?: string) {
    this.client = hc<Routes>(baseUrl, {
      headers: { Authorization: userId ?? "" },
    });
  }

  async createInspector(inspector: InspectorInput) {
    const response = await this.client.inspector.$post({
      json: inspector,
    });
    return response.json();
  }

  async getInspectors(agencyId: string) {
    const response = await this.client.inspector[":agencyId"].$get({
      param: { agencyId },
    });
    return response.json() as Promise<InspectorResponse[]>;
  }

  async deleteInspector(agencyId: string, email: string) {
    const response = await this.client.inspector[":agencyId"][":email"].$delete(
      {
        param: { agencyId, email },
      },
    );
    return response.json();
  }
}
