export interface HotspotZone {
  id: string;
  name: string;
  category: string;
  center: [number, number];
  radius: number; // meters
  severity: 'Critical' | 'High' | 'Medium';
  recurringCount: number;
  description: string;
  rootCause: string;
  preventivePlan: string;
  affectedWards: string[];
}

export const REWA_HOTSPOT_ZONES: HotspotZone[] = [
  {
    id: 'hotspot-bus-stand',
    name: 'New Bus Stand - Venkat Bypassing Culvert Corridor',
    category: 'Waterlogging / Drainage',
    center: [24.5480, 81.2930],
    radius: 420,
    severity: 'Critical',
    recurringCount: 14,
    description: 'Repeated monsoon flooding >45cm depth stalling public transit buses and 2-wheelers.',
    rootCause: 'Low elevation culvert gradient bottleneck combined with plastic silt blockage.',
    preventivePlan: 'Pre-monsoon mechanized desilting + installation of 25HP auto-drain pump.',
    affectedWards: ['Demo Ward 05 - New Bus Stand Area', 'Demo Ward 01 - Civil Lines'],
  },
  {
    id: 'hotspot-college-chowk',
    name: 'College Chowk - TRS Junction Arterial Sector',
    category: 'Road / Pothole',
    center: [24.5422, 81.3058],
    radius: 360,
    severity: 'High',
    recurringCount: 11,
    description: 'High-density asphalt cavities recurring every 90 days across heavy student commute corridor.',
    rootCause: 'Deficient lateral storm drain slope causes road base moisture retention and bitumen peeling.',
    preventivePlan: 'Replace recurring cold patches with full 75mm milling, lateral drain grading, and dense bituminous premix.',
    affectedWards: ['Demo Ward 04 - College Chowk & TRS'],
  },
  {
    id: 'hotspot-shilpi-plaza',
    name: 'Shilpi Plaza & Central Bazaar Commercial Hub',
    category: 'Garbage & Waste Spillage',
    center: [24.5342, 81.3018],
    radius: 320,
    severity: 'High',
    recurringCount: 19,
    description: 'Commercial secondary waste bins overflowing into pedestrian sidewalks during peak hours.',
    rootCause: 'Evening commercial footfall peaks Saturday/Sunday, exceeding bin volumetric capacity by 180%.',
    preventivePlan: 'Scheduled secondary compactor sweep at 18:00 daily + merchant wet/dry segregation bins.',
    affectedWards: ['Demo Ward 03 - Shilpi Plaza & Bazaar'],
  },
  {
    id: 'hotspot-hospital-pipeline',
    name: 'Sanjay Gandhi Hospital Emergency Main Water Feeder',
    category: 'Water Leakage / Pipe Burst',
    center: [24.5370, 81.3080],
    radius: 280,
    severity: 'Critical',
    recurringCount: 8,
    description: 'Repeated high-pressure pipeline joints bursting near regional hospital entrance.',
    rootCause: '35-year-old cast-iron conduit experiencing hydraulic hammer from booster pump start-ups.',
    preventivePlan: 'Trenchless slip-lining with modern HDPE pressure pipe along 450m healthcare segment.',
    affectedWards: ['Demo Ward 07 - Sanjay Gandhi Hospital Zone'],
  },
  {
    id: 'hotspot-apsu-lighting',
    name: 'APSU University Ring Road Streetlight Dark Zone',
    category: 'Streetlight / Power Fluctuation',
    center: [24.5210, 81.3150],
    radius: 380,
    severity: 'Medium',
    recurringCount: 7,
    description: 'Frequent LED driver burnout causing prolonged dark stretches along university boundary.',
    rootCause: 'Substation terminal phase unbalance creates transient high-voltage surges in evening load.',
    preventivePlan: 'Deploy motorized line voltage stabilizers and surge arrestor enclosures at Ward 02 transformers.',
    affectedWards: ['Demo Ward 02 - APSU University Road'],
  },
];
