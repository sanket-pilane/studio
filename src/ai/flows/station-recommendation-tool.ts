
// station-recommendation-tool.ts
'use server';

/**
 * @fileOverview A tool to recommend EV charging stations based on historical booking trends and real-time availability.
 *
 * - getStationRecommendation - A function that returns a recommendation of the best EV charging stations.
 * - StationRecommendationInput - The input type for the getStationRecommendation function.
 * - StationRecommendationOutput - The return type for the getStationRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getStations } from './station-management-flow';

const StationRecommendationInputSchema = z.object({
  latitude: z
    .number()
    .describe('The latitude of the user.'),
  longitude: z
    .number()
    .describe('The longitude of the user.'),
  time: z
    .string()
    .describe('The time the user wants to charge, in ISO 8601 format.'),
  connectorType: z
    .string()
    .describe('The type of connector the user needs (e.g., Tesla, CCS).'),
});

export type StationRecommendationInput = z.infer<
  typeof StationRecommendationInputSchema
>;

const StationRecommendationOutputSchema = z.object({
  stationName: z.string().describe('The name of the recommended station.'),
  reason: z.string().describe('The reasoning behind the recommendation.'),
});

export type StationRecommendationOutput = z.infer<
  typeof StationRecommendationOutputSchema
>;

export async function getStationRecommendation(
  input: StationRecommendationInput
): Promise<StationRecommendationOutput> {
  return stationRecommendationFlow(input);
}

const stationRecommendationPrompt = ai.definePrompt({
  name: 'stationRecommendationPrompt',
  input: {
    schema: z.object({
      ...StationRecommendationInputSchema.shape,
      stations: z.string().describe("JSON string of available stations."),
      currentTime: z.string().describe("The current time in ISO 8601 format, for context."),
    }),
  },
  output: {
    schema: StationRecommendationOutputSchema,
  },
  prompt: `You are an expert EV charging station recommender.
Based on the user's location (latitude: {{{latitude}}}, longitude: {{{longitude}}}),
the time they want to charge ({{{time}}}), and their connector type ({{{connectorType}}}),
recommend the best EV charging station for them from the following list of available stations:

{{{stations}}}

The current time is {{{currentTime}}}. Consider the user's desired time, current availability, distance, and station ratings.
Provide a concise, user-friendly reason for your recommendation.

Return only the station name and the reason.`,
});

const stationRecommendationFlow = ai.defineFlow(
  {
    name: 'stationRecommendationFlow',
    inputSchema: StationRecommendationInputSchema,
    outputSchema: StationRecommendationOutputSchema,
  },
  async input => {
    const stations = await getStations();
    const stationsJson = JSON.stringify(stations.map(s => ({
        name: s.name,
        address: s.address,
        availableChargers: s.availableChargers,
        totalChargers: s.totalChargers,
        connectors: s.connectors.map(c => c.type),
        rating: s.rating,
        coordinates: s.coordinates,
    })));

    const {output} = await stationRecommendationPrompt({ 
      ...input, 
      stations: stationsJson,
      currentTime: new Date().toISOString(),
    });
    return output!;
  }
);
