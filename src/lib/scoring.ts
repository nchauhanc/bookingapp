export interface ScoredPro {
  bio: string | null;
  speciality: string | null;
  city: string | null;
  country: string | null;
  name: string | null;
  _count: { slots: number; recentBookings: number };
}

/**
 * Compute a relevance score for a professional.
 *
 * Signals:
 *   +2  profile completeness (has both bio AND speciality)
 *   +2  has at least one future available slot
 *   +1  had at least one booking in the last 30 days
 *   +2  speciality matches search keyword
 *   +1  name matches search keyword (but speciality didn't)
 *   +3  city matches customer's city
 *   +1  country matches customer's country (city didn't match)
 */
export function scoreProfessional(
  pro: ScoredPro,
  search = "",
  customerCity = "",
  customerCountry = ""
): number {
  let score = 0;

  // Profile completeness
  if (pro.bio && pro.speciality) score += 2;

  // Active slots
  if (pro._count.slots > 0) score += 2;

  // Recent activity
  if (pro._count.recentBookings > 0) score += 1;

  // Keyword relevance
  if (search) {
    const q = search.toLowerCase();
    if (pro.speciality?.toLowerCase().includes(q)) {
      score += 2; // speciality match is stronger
    } else if (pro.name?.toLowerCase().includes(q)) {
      score += 1; // name-only match
    }
  }

  // Location proximity
  if (customerCity) {
    if (pro.city?.toLowerCase() === customerCity.toLowerCase()) {
      score += 3;
    } else if (
      customerCountry &&
      pro.country?.toLowerCase() === customerCountry.toLowerCase()
    ) {
      score += 1;
    }
  }

  return score;
}
