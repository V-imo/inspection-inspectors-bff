import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import { createInspector, deleteInspector, getInspectors } from "../../core/cognito";
const RegisterInspectorSchema = z
  .object({
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    currentAgency: z.string(),
  })
  .openapi("RegisterInspector");

const RegisterInspectorResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi("RegisterInspectorResponse");

const ErrorResponseSchema = z
  .object({
    error: z.string(),
  })
  .openapi("ErrorResponse");

const InspectorSchema = z
  .object({
    username: z.string(),
    email: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .openapi("Inspector");

export const route = new OpenAPIHono()
  .openapi(
    createRoute({
      method: "post",
      path: "/",
      request: {
        body: {
          content: {
            "application/json": {
              schema: RegisterInspectorSchema,
            },
          },
        },
      },
      responses: {
        201: {
          content: {
            "application/json": {
              schema: RegisterInspectorResponseSchema,
            },
          },
          description: "Inspector registered successfully",
        },
        400: {
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
          description: "Registration failed",
        },
        500: {
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
          description: "Server error",
        },
      },
      description: "Register a new user",
    }),
    async (c) => {
      const { email, firstName, lastName, currentAgency } = c.req.valid("json");
      try {
        await createInspector(email, firstName, lastName, currentAgency);
        return c.json({ message: "Inspector registered successfully" }, 201);
      } catch (error) {
        console.error("Error registering inspector:", JSON.stringify(error));
        return c.json({ error: "Registration failed" }, 400);
      }
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/{agencyId}",
      request: {
        params: z.object({
          agencyId: z.string(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: z.array(InspectorSchema),
            },
          },
          description: "Inspectors retrieved successfully",
        },
        404: {
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
          description: "Group not found",
        },
      },
      description: "Get users from a group",
    }),
    async (c) => {
      const { agencyId } = c.req.valid("param");
      try {
        const users = await getInspectors(agencyId);
        console.log("Retrieved inspectors:", JSON.stringify(users));
        return c.json(z.array(InspectorSchema).parse(users), 200);
      } catch (error) {
        console.error("Error retrieving inspectors:", JSON.stringify(error));
        return c.json({ error: "Group not found" }, 404);
      }
    }
  )
  .openapi(
    createRoute({
      method: "delete",
      path: "/{username}",
      request: {
        params: z.object({
          username: z.string(),
        }),
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: RegisterInspectorResponseSchema,
            },
          },
          description: "Inspector deleted successfully",
        },
        404: {
          content: {
            "application/json": {
              schema: ErrorResponseSchema,
            },
          },
          description: "Inspector not found",
        },
      },
      description: "Delete an inspector",
    }),
    async (c) => {
      const { username } = c.req.valid("param");
      try {
        await deleteInspector(username);
        return c.json({ message: "Inspector deleted successfully" }, 200);
      } catch (error) {
        console.error("Error deleting inspector:", JSON.stringify(error));
        return c.json({ error: "Inspector not found" }, 404);
      }
    }
  );
