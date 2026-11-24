import { v } from 'convex/values';
import { action } from './_generated/server';

export const geocodeAddress = action({
  args: { address: v.string() },
  returns: v.union(v.object({ lat: v.number(), lng: v.number() }), v.null()),
  handler: async (ctx, { address }) => {
    if (!(await ctx.auth.getUserIdentity())) throw new Error('Not authenticated');
    const trimmedAddress = address.trim();
    if (!trimmedAddress || trimmedAddress.length > 300) {
      throw new Error('Address must be between 1 and 300 characters');
    }

    const url = new URL('https://geocoding.geo.census.gov/geocoder/locations/onelineaddress');
    url.search = new URLSearchParams({
      address: trimmedAddress,
      benchmark: 'Public_AR_Current',
      format: 'json',
    }).toString();
    const response = await fetch(url);
    if (!response.ok) throw new Error('Unable to geocode address');

    const data: unknown = await response.json();
    if (typeof data !== 'object' || data === null || !('result' in data)) {
      throw new Error('Invalid geocoding response');
    }
    const result = data.result;
    if (typeof result !== 'object' || result === null || !('addressMatches' in result)) {
      throw new Error('Invalid geocoding response');
    }
    const matches = result.addressMatches;
    if (!Array.isArray(matches)) throw new Error('Invalid geocoding response');
    if (matches.length === 0) return null;

    const match: unknown = matches[0];
    if (typeof match !== 'object' || match === null || !('coordinates' in match)) {
      throw new Error('Invalid geocoding response');
    }
    const coordinates = match.coordinates;
    if (
      typeof coordinates !== 'object' ||
      coordinates === null ||
      !('y' in coordinates) ||
      !('x' in coordinates) ||
      typeof coordinates.y !== 'number' ||
      typeof coordinates.x !== 'number' ||
      !Number.isFinite(coordinates.y) ||
      !Number.isFinite(coordinates.x) ||
      Math.abs(coordinates.y) > 90 ||
      Math.abs(coordinates.x) > 180
    ) {
      throw new Error('Invalid geocoding response');
    }
    return { lat: coordinates.y, lng: coordinates.x };
  },
});
