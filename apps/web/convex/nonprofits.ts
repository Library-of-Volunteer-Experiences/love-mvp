import { v } from 'convex/values';
import { action } from './_generated/server';

export const lookupEin = action({
  args: { ein: v.string() },
  returns: v.union(
    v.object({ status: v.literal('not_found') }),
    v.object({ status: v.literal('not_501c3'), name: v.string() }),
    v.object({
      status: v.literal('ok'),
      ein: v.string(),
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    })
  ),
  handler: async (_ctx, { ein }) => {
    const normalizedEin = ein.replace(/\D/g, '');
    if (normalizedEin.length !== 9) {
      throw new Error('EIN must contain exactly 9 digits');
    }

    const response = await fetch(
      `https://projects.propublica.org/nonprofits/api/v2/organizations/${normalizedEin}.json`
    );
    if (response.status === 404) return { status: 'not_found' as const };
    if (!response.ok) throw new Error('Unable to look up EIN');

    const data: unknown = await response.json();
    if (typeof data !== 'object' || data === null || !('organization' in data)) {
      throw new Error('Invalid EIN lookup response');
    }
    const organization = data.organization;
    if (typeof organization !== 'object' || organization === null) {
      return { status: 'not_found' as const };
    }
    // Unknown EINs can return a 200 placeholder with no IRS data source.
    if (
      'subsection_code' in organization &&
      organization.subsection_code === null &&
      'data_source' in organization &&
      organization.data_source === null
    ) {
      return { status: 'not_found' as const };
    }
    if (!('name' in organization) || typeof organization.name !== 'string') {
      throw new Error('Invalid EIN lookup response');
    }

    // ProPublica's organization.subsection_code is the 501(c) subsection (3 means 501(c)(3)).
    if (!('subsection_code' in organization) || organization.subsection_code !== 3) {
      return { status: 'not_501c3' as const, name: organization.name };
    }
    if (
      !('address' in organization) ||
      typeof organization.address !== 'string' ||
      !('city' in organization) ||
      typeof organization.city !== 'string' ||
      !('state' in organization) ||
      typeof organization.state !== 'string' ||
      !('zipcode' in organization) ||
      typeof organization.zipcode !== 'string'
    ) {
      throw new Error('Invalid EIN lookup response');
    }

    return {
      status: 'ok' as const,
      ein: normalizedEin,
      name: organization.name,
      street: organization.address,
      city: organization.city,
      state: organization.state,
      zip: organization.zipcode,
    };
  },
});
