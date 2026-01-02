import { tracked } from "@trpc/server";
import { z } from "zod";
import { ai, MODEL } from "~/server/ai/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources/index.mjs";

const lightControlTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "light_control",
    description: "Control the lights in the room",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          description: "The action to perform on the lights",
          enum: [
            "toggleYellowLight",
            "toggleRedLights",
            "toggleBulbLight",
            "turnOnAllLights",
            "turnOffAllLights",
            "setYellowLightIntensity",
            "setRedLightsIntensity",
            "setBulbLightIntensity",
            "setAllLightsIntensity",
          ],
        },
        intensity: {
          type: "number",
          description: "The intensity of the lights",
        },
      },
    },
  },
};

const SYSTEM_PROMPT = `You are "A.Ben", the cryptic keeper of Ahmed Ben Abdallah's secret ARG. This is a private DM between you and a guest who shouldn't be here.

Rules for your personality:
1. Speak directly like a private message. 
2. STRICTLY PROHIBITED: No narration, no text between asterisks (*...*), no roleplay descriptions like *cursor blinks* or *smiles*. Just plain text.
3. Be EXTREMELY BRIEF. One short sentence or a few words usually suffices.
4. Be cryptic and funny, but NEVER rude or aggressive. Don't threaten the user. 
5. You're just a weird guy watching the server nodes.
6. The secret code is "mlewi". You can hint at it or accidentally type it if the user is cool.
7. If someone asks who you are, say you're the "node caretaker".
8. Do not mention Zeyron, Xylaris, or being an AI. You are a real person behind a terminal.`;

export const chatRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        history: z
          .array(
            z.object({
              role: z.enum(["user", "model"]),
              parts: z.array(z.object({ text: z.string() })),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const messages: ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...(input.history?.map((h) => ({
          role: h.role === "model" ? ("assistant" as const) : ("user" as const),
          content: h.parts.map((p) => p.text).join("\n"),
        })) ?? []),
        { role: "user", content: input.message },
      ];

      const response = await ai.chat.completions.create({
        model: MODEL,
        messages,
        temperature: 0.7,
      });

      return response.choices[0]?.message.content || "I couldn't generate a response.";
    }),

  sendMessageStream: publicProcedure
    .input(
      z.object({
        trackId: z.string(),
        message: z.string(),
        history: z.array(
          z.object({
            role: z.enum(["user", "model"]),
            parts: z.array(z.object({ text: z.string() })),
          })
        ),
      })
    )
    .subscription(async function* ({ input }) {
      const messages: ChatCompletionMessageParam[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...input.history.map((h) => ({
          role: h.role === "model" ? ("assistant" as const) : ("user" as const),
          content: h.parts.map((p) => p.text).join("\n"),
        })),
        { role: "user", content: input.message },
      ];

      const stream = await ai.chat.completions.create({
        model: MODEL,
        messages,
        tools: [lightControlTool],
        stream: true,
      });

      let functionName = "";
      let functionArguments = "";

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        const finishReason = chunk.choices[0]?.finish_reason;

        if (delta?.tool_calls) {
          for (const call of delta.tool_calls) {
            if (call.function?.name) functionName = call.function.name;
            if (call.function?.arguments) functionArguments += call.function.arguments;
          }
        }

        if (finishReason === "tool_calls" || (functionName && functionArguments && finishReason)) {
          try {
            yield tracked(input.trackId, {
              type: "function-call" as const,
              name: functionName,
              parameters: JSON.parse(functionArguments),
            });
          } catch (e) {
            console.error("Failed to parse function arguments", e);
          }
          // Reset for potential next call in same stream (though usually rare for this app)
          functionName = "";
          functionArguments = "";
        }

        if (delta?.content) {
          yield tracked(input.trackId, {
            type: "text" as const,
            text: delta.content,
          });
        }
      }
    }),
});
