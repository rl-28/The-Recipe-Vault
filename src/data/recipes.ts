import type { Recipe } from '../types/recipe';

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'vault-rc-01',
    vaultCode: 'VLT-702-WAGYU',
    title: '72-Hour Sous-Vide Wagyu Short Rib',
    subtitle: 'A5 Miyazaki short rib with bone marrow jus reduction & smoked oak sea salt crust',
    category: 'Sous-Vide & Meats',
    difficulty: 'Master',
    prepTime: '45 Min',
    cookTime: '72 Hours',
    totalTime: '72h 45m',
    calories: 780,
    servings: 4,
    rating: 4.99,
    reviewsCount: 142,
    isClassified: true,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
    origin: 'Kyoto // San Sebastián Master Vault',
    chefNotes: 'The prolonged 55°C water bath transforms tough collagen into luxurious gelatin without denaturing delicate myofibrillar proteins.',
    flavorProfile: ['Rich Umami', 'Earth & Truffle', 'Velvety Fat', 'Charred Oak'],
    equipment: ['Immersion Circulator', 'Vacuum Chamber Sealer', 'Cast Iron Skillet', 'Blowtorch'],
    nutrition: {
      calories: 780,
      proteinG: 58,
      carbsG: 6,
      fatG: 58,
      fiberG: 1,
    },
    winePairing: {
      beverageName: 'Château Margaux Premier Grand Cru Classé',
      type: 'Bordeaux Blend (Cabernet Sauvignon/Merlot)',
      vintageOrOrigin: '2015 Bordeaux, France',
      tastingNote: 'Silky structured tannins and deep graphite notes that effortlessly cut through the marbled A5 Wagyu intramuscular fat.',
    },
    ingredients: [
      { id: 'ing-1', name: 'A5 Miyazaki Wagyu Short Rib (bone-in)', amount: 1200, unit: 'g', notes: 'Trimmed of excess hard fat' },
      { id: 'ing-2', name: 'Roasted Veal & Bone Marrow Stock', amount: 500, unit: 'ml', notes: 'Reduced by 60%' },
      { id: 'ing-3', name: 'Black Winter Truffle (Melanosporum)', amount: 25, unit: 'g', notes: 'Freshly shaved' },
      { id: 'ing-4', name: 'Aged Shoyu (10-Year Fermented)', amount: 45, unit: 'ml' },
      { id: 'ing-5', name: 'Smoked Maldon Flake Salt', amount: 8, unit: 'g' },
      { id: 'ing-6', name: 'Fresh Thyme & Rosemary Sprigs', amount: 4, unit: 'sprigs' },
      { id: 'ing-7', name: 'Cultured French Butter (Normandy)', amount: 60, unit: 'g' },
      { id: 'ing-8', name: 'Black Garlic Purée', amount: 30, unit: 'g' },
    ],
    steps: [
      {
        id: 'st-1',
        stepNumber: 1,
        title: 'Butchery & Dry Brine',
        instruction: 'Square the short rib block into 4 equal portions. Season with 1.2% by weight smoked salt and black garlic rub. Rest uncovered on a wire rack in the chill chamber for 3 hours.',
        timerDurationSec: 180,
        timerLabel: 'Quick Sear Prep Timer (3m)',
        chefTip: 'Ensures optimal pellicle formation on the beef surface before vacuum compression.'
      },
      {
        id: 'st-2',
        stepNumber: 2,
        title: 'Vacuum Compression & Immersion',
        instruction: 'Place wagyu blocks into high-barrier vacuum pouches with herb sprigs and shoyu. Seal at 99.8% vacuum pressure. Submerge in circulator bath calibrated precisely to 55.0°C (131.0°F) for 72 hours.',
        timerDurationSec: 300,
        timerLabel: 'Vacuum Chamber Seal Cycle (5m)',
        chefTip: 'Ensure bath water level is monitored and covered with thermal insulation spheres.'
      },
      {
        id: 'st-3',
        stepNumber: 3,
        title: 'Marrow Glaze Reduction',
        instruction: 'In a heavy copper saucier, reduce the roasted veal stock, bone marrow, and reserved bag juices down to a mirror-like nappe consistency. Swirl in Normandy cultured butter off heat.',
        timerDurationSec: 600,
        timerLabel: 'Reduction Saucier Timer (10m)',
        chefTip: 'Do not boil after adding butter to prevent emulsion breakdown.'
      },
      {
        id: 'st-4',
        stepNumber: 4,
        title: 'Binchotan Charcoal High-Heat Sear',
        instruction: 'Remove short rib from pouch and pat completely dry. Sear over white-hot Japanese Binchotan charcoal or in smoking hot cast iron with foaming butter for exactly 45 seconds per facet.',
        timerDurationSec: 45,
        timerLabel: 'High-Heat Sear Timer (45s)',
        chefTip: 'Aim for a mahogany micro-crust without raising the internal core temperature above 56°C.'
      },
      {
        id: 'st-5',
        stepNumber: 5,
        title: 'Plating & Truffle Shaving',
        instruction: 'Carve against grain, coat with glossy marrow reduction, and generously shave fresh black winter truffle tableside. Finish with crystals of smoked Maldon salt.',
        chefTip: 'Serve immediately on 65°C pre-warmed slate or black ceramic plates.'
      }
    ]
  },
  {
    id: 'vault-rc-02',
    vaultCode: 'VLT-108-CRUST',
    title: '100% Hydration Dark Sourdough Boule',
    subtitle: 'Wild yeast levain, ancient Emmer wheat, obsidian blistered crust & open honeycomb crumb',
    category: 'Artisan Bakery',
    difficulty: 'Advanced',
    prepTime: '24 Hours',
    cookTime: '45 Min',
    totalTime: '24h 45m',
    calories: 220,
    servings: 8,
    rating: 4.96,
    reviewsCount: 219,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
    origin: 'Copenhagen // Basque Fermentary',
    chefNotes: 'Managing 100% water hydration requires rigorous coil folds and strict temperature control at 26°C dough core.',
    flavorProfile: ['Lactic Sourness', 'Toasted Hazelnut', 'Caramelized Malt', 'Wild Ferment'],
    equipment: ['Cast Iron Dutch Oven', 'Proofing Banneton', 'Lame Razor', 'Digital Infrared Thermometer'],
    nutrition: {
      calories: 220,
      proteinG: 9,
      carbsG: 44,
      fatG: 1.5,
      fiberG: 4,
    },
    winePairing: {
      beverageName: 'Domaine de la Romanée-Conti Corton-Charlemagne',
      type: 'White Burgundy (Chardonnay)',
      vintageOrOrigin: '2018 Côte de Beaune, France',
      tastingNote: 'Crisp flint minerality and toasted brioche notes harmonize seamlessly with the caramel crust blisters.',
    },
    ingredients: [
      { id: 'ing-10', name: 'Stone-Ground Heritage Bread Flour (14% Protein)', amount: 450, unit: 'g' },
      { id: 'ing-11', name: 'Ancient Emmer Whole Wheat Flour', amount: 50, unit: 'g' },
      { id: 'ing-12', name: 'Filtered Spring Water (30°C)', amount: 500, unit: 'g' },
      { id: 'ing-13', name: 'Active Wild Levain (100% hydration)', amount: 100, unit: 'g', notes: 'At peak buoyancy' },
      { id: 'ing-14', name: 'Guerande Grey Sea Salt', amount: 11, unit: 'g' },
      { id: 'ing-15', name: 'Rice Flour (for dusting banneton)', amount: 30, unit: 'g' },
    ],
    steps: [
      {
        id: 'st-10',
        stepNumber: 1,
        title: 'Thermal Autolyse',
        instruction: 'Whisk 450g water with all flour until no dry pockets remain. Cover with a damp linen cloth and rest at 26°C for 90 minutes for enzymatic starch conversion.',
        timerDurationSec: 5400,
        timerLabel: 'Autolyse Rest Timer (90m)',
        chefTip: 'Autolyse develops gluten without oxidation, yielding a creamy translucent crumb.'
      },
      {
        id: 'st-11',
        stepNumber: 2,
        title: 'Levain & Salt Inoculation',
        instruction: 'Dimple active levain into dough using Rubaud method for 5 minutes. Rest 30 mins, then incorporate salt dissolved in remaining 50g water (bassinage technique).',
        timerDurationSec: 300,
        timerLabel: 'Rubaud Mixing Timer (5m)',
        chefTip: 'The dough will feel loose; do not panic or add raw flour.'
      },
      {
        id: 'st-12',
        stepNumber: 3,
        title: 'Lamination & Sequential Coil Folds',
        instruction: 'Perform 1 windowpane lamination followed by 4 gentle coil folds spaced 45 minutes apart in a glass proofer.',
        timerDurationSec: 2700,
        timerLabel: 'Coil Fold Interval Timer (45m)',
        chefTip: 'Wet your hands with warm water before each coil fold to prevent sticking.'
      },
      {
        id: 'st-13',
        stepNumber: 4,
        title: 'Cold Retardation',
        instruction: 'Pre-shape into a taut round, bench rest 20 mins, stitch into rice-floured wood pulp banneton. Ferment overnight at 3.5°C for 16 hours.',
        chefTip: 'Cold fermentation slows yeast while lactic acid bacteria create deep sour aromatics.'
      },
      {
        id: 'st-14',
        stepNumber: 5,
        title: 'Steam-Injection Dutch Oven Bake',
        instruction: 'Preheat cast iron to 250°C. Invert cold dough, score with curved lame razor at 30° angle. Bake covered with 2 ice cubes for 20 mins, then uncover at 220°C for 25 mins until dark mahogany blisters appear.',
        timerDurationSec: 1200,
        timerLabel: 'Steam Phase Covered Bake (20m)',
        chefTip: 'Do not cut the loaf until the interior temperature drops below 35°C (minimum 2 hours cooling).'
      }
    ]
  },
  {
    id: 'vault-rc-03',
    vaultCode: 'VLT-944-GOLD',
    title: '24K Gold Smoked Dark Chocolate Sphere',
    subtitle: 'Valrhona Guanaja 70% dome, salted yuzu caramel center & hazelnut praline crunch',
    category: 'Pastry & Desserts',
    difficulty: 'Master',
    prepTime: '2 Hours',
    cookTime: '30 Min',
    totalTime: '2h 30m',
    calories: 620,
    servings: 6,
    rating: 4.98,
    reviewsCount: 89,
    isClassified: true,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85',
    origin: 'Paris // Zurich Secret Lab',
    chefNotes: 'Tempering chocolate to precise Beta-V crystal formation is essential for the mirror sheen and signature snap.',
    flavorProfile: ['Bittersweet Cacao', 'Tart Japanese Yuzu', 'Smoke & Vanilla', 'Toasted Hazelnut'],
    equipment: ['Silicone Hemisphere Molds', 'Digital Thermometer', 'Smoking Gun & Applewood', 'Edible Gold Leaf Tweezers'],
    nutrition: {
      calories: 620,
      proteinG: 8,
      carbsG: 64,
      fatG: 38,
      fiberG: 5,
    },
    winePairing: {
      beverageName: 'Taylor Fladgate 40-Year-Old Tawny Port',
      type: 'Fortified Tawny Port',
      vintageOrOrigin: 'Douro Valley, Portugal',
      tastingNote: 'Ranció walnuts, dried fig, and rich toffee accentuate the bittersweet dark cacao and citrus yuzu heart.',
    },
    ingredients: [
      { id: 'ing-20', name: 'Valrhona Guanaja 70% Dark Chocolate', amount: 350, unit: 'g' },
      { id: 'ing-21', name: 'Mycryo Cocoa Butter', amount: 3.5, unit: 'g' },
      { id: 'ing-22', name: 'Japanese Yuzu Juice (100% Pure)', amount: 60, unit: 'ml' },
      { id: 'ing-23', name: 'Heavy Cream (36% Fat)', amount: 180, unit: 'ml' },
      { id: 'ing-24', name: 'Isomalt & Granulated Sugar', amount: 120, unit: 'g' },
      { id: 'ing-25', name: 'Piedmont Hazelnut Feuilletine Paste', amount: 90, unit: 'g' },
      { id: 'ing-26', name: 'Edible 24K Gold Leaf Sheets', amount: 3, unit: 'sheets' },
      { id: 'ing-27', name: 'Applewood Chips for Cold Smoke', amount: 15, unit: 'g' }
    ],
    steps: [
      {
        id: 'st-20',
        stepNumber: 1,
        title: 'Precision Chocolate Tempering (Beta-V)',
        instruction: 'Melt chocolate to 50°C over water bath. Cool to 34°C with continuous agitation, add Mycryo cocoa butter, and lower to 31.5°C working temperature.',
        timerDurationSec: 360,
        timerLabel: 'Agitation Cooling Timer (6m)',
        chefTip: 'Test temper on the tip of an offset spatula; it should set matte within 2 minutes.'
      },
      {
        id: 'st-21',
        stepNumber: 2,
        title: 'Sphere Shell Casting',
        instruction: 'Line polished polycarbonate hemisphere molds with tempered chocolate. Invert to drain excess, creating a 1.2mm delicate shell. Crystallize at 16°C for 45 minutes.',
        timerDurationSec: 2700,
        timerLabel: 'Crystallization Chamber Timer (45m)',
        chefTip: 'Never refrigerate below 14°C to avoid condensation dulling the gloss.'
      },
      {
        id: 'st-22',
        stepNumber: 3,
        title: 'Salted Yuzu Caramel & Feuilletine Core',
        instruction: 'Caramelize sugar dry to 175°C. Deglaze with hot yuzu cream and sea salt. Layer hazelnut feuilletine crunch at the base of the chocolate sphere followed by warm yuzu caramel.',
        timerDurationSec: 480,
        timerLabel: 'Dry Caramelization Timer (8m)',
        chefTip: 'Cool caramel to 28°C before piping into spheres to prevent melting the shell.'
      },
      {
        id: 'st-23',
        stepNumber: 4,
        title: 'Assembly & 24K Gold Leaf Gilding',
        instruction: 'Warm a clean stainless steel plate. Touch open hemisphere edges to melt slightly and fuse into a seamless orb. Apply 24K gold leaf with squirrel-hair gilding brush.',
        chefTip: 'Work in a draft-free room; gold leaf is airborne with minimal air movement.'
      },
      {
        id: 'st-24',
        stepNumber: 5,
        title: 'Cold Cloche Smoke Infusion',
        instruction: 'Cover sphere with glass cloche. Inject dense applewood cold smoke for 30 seconds before lifting tableside.',
        timerDurationSec: 30,
        timerLabel: 'Smoke Infusion Timer (30s)',
        chefTip: 'Serve with a warm pitcher of dark chocolate espresso ganache to pour over and melt open.'
      }
    ]
  },
  {
    id: 'vault-rc-04',
    vaultCode: 'VLT-330-SMOKE',
    title: 'Smoked Rosemary & Cacao Old Fashioned',
    subtitle: 'Small-batch Rye whiskey, roasted cacao nib infused bitter & flamed rosemary cloud',
    category: 'Signature Cocktails',
    difficulty: 'Intermediate',
    prepTime: '15 Min',
    cookTime: '5 Min',
    totalTime: '20 Min',
    calories: 195,
    servings: 2,
    rating: 4.95,
    reviewsCount: 164,
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=85',
    origin: 'New Orleans // Kyoto Bar Reserve',
    chefNotes: 'Infusing single-origin cacao nibs directly into angostura bitters extracts dark nutty tannins that balance the high rye proof.',
    flavorProfile: ['Smoked Pine', 'Roasted Cacao', 'Charred American Oak', 'Candied Orange Peel'],
    equipment: ['Mixing Glass & Hawthorne Strainer', 'Hand Torch', 'Clear Ice Diamond Carver', 'Cocktail Smoking Cloche'],
    nutrition: {
      calories: 195,
      proteinG: 0,
      carbsG: 6,
      fatG: 0,
    },
    winePairing: {
      beverageName: 'Highland Park 18-Year Viking Pride',
      type: 'Single Malt Scotch Whisky',
      vintageOrOrigin: 'Orkney Islands, Scotland',
      tastingNote: 'Aromatic peat smoke, heather honey, and rich fruitcake resonate with the pine-flamed rosemary.',
    },
    ingredients: [
      { id: 'ing-30', name: 'High-Rye Bourbon or Straight Rye (100 Proof)', amount: 120, unit: 'ml' },
      { id: 'ing-31', name: 'Demerara Syrup (2:1 Rich)', amount: 15, unit: 'ml' },
      { id: 'ing-32', name: 'Cacao Nib Infused House Bitters', amount: 6, unit: 'dashes' },
      { id: 'ing-33', name: 'Wild Highland Rosemary Sprigs', amount: 2, unit: 'sprigs' },
      { id: 'ing-34', name: 'Cara Cara Orange Peel (Expressed)', amount: 2, unit: 'strips' },
      { id: 'ing-35', name: 'Hand-Cut Directionally Frozen Clear Ice Block', amount: 2, unit: 'cubes' },
    ],
    steps: [
      {
        id: 'st-30',
        stepNumber: 1,
        title: 'Glassware Prep & Rosemary Smoked Chamber',
        instruction: 'Ignite fresh rosemary sprig on a cedar plank with culinary torch. Invert crystal lowball glasses over smoking herb to trap the aromatic essential oils.',
        timerDurationSec: 40,
        timerLabel: 'Smoke Trapping Rest Timer (40s)',
        chefTip: 'Trap smoke for at least 40 seconds to allow volatile pine terpenes to condense on the chilled crystal.'
      },
      {
        id: 'st-31',
        stepNumber: 2,
        title: 'Precision Stir & Dilution',
        instruction: 'In a heavy Yarai mixing glass, combine rye, rich Demerara syrup, and cacao bitters. Add cracked ice and stir smoothly for 45 revolutions (target: 22% dilution).',
        timerDurationSec: 30,
        timerLabel: 'Precision Stir Timer (30s)',
        chefTip: 'Keep the back of the bar spoon tight against the glass wall for silent, zero-aeration chilling.'
      },
      {
        id: 'st-32',
        stepNumber: 3,
        title: 'Pour & Expression',
        instruction: 'Place hand-carved clear ice block into smoked glass. Strain liquid over ice. Express orange peel oils over surface and flame lightly across the rim.',
        chefTip: 'Express peel at 45-degree angle to ignite microscopic oil droplets without charring the skin.'
      }
    ]
  },
  {
    id: 'vault-rc-05',
    vaultCode: 'VLT-512-CAVIAR',
    title: 'Truffle & Dashi Spherical Caviar',
    subtitle: 'Direct spherification pearls of aged kombu dashi, white truffle essence & gold leaf',
    category: 'Modern Gastronomy',
    difficulty: 'Advanced',
    prepTime: '40 Min',
    cookTime: '10 Min',
    totalTime: '50 Min',
    calories: 110,
    servings: 4,
    rating: 4.93,
    reviewsCount: 76,
    isClassified: true,
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85',
    origin: 'San Sebastián // Barcelona Molecular Kitchen',
    chefNotes: 'Sodium alginate hydration must be done 12 hours ahead with vacuum de-aeration to eliminate all micro-bubbles before droplet expulsion.',
    flavorProfile: ['Savory Glutamate', 'Intense White Truffle', 'Ocean Kelp', 'Clean Mineral Pop'],
    equipment: ['Spherification Dropper Box / Pipette', 'Precision Microgram Scale', 'Immersion Blender', 'Caviar Sieve Spoon'],
    nutrition: {
      calories: 110,
      proteinG: 3,
      carbsG: 12,
      fatG: 6,
    },
    winePairing: {
      beverageName: 'Dom Pérignon Vintage Brut Champagne',
      type: 'Champagne (Pinot Noir/Chardonnay)',
      vintageOrOrigin: '2013 Épernay, France',
      tastingNote: 'Vibrant acidity and fine crystalline effervescence burst in sync with the truffle spherical pop.',
    },
    ingredients: [
      { id: 'ing-40', name: 'Aged Kombu & Bonito Dashi Broth', amount: 300, unit: 'ml' },
      { id: 'ing-41', name: 'Sodium Alginate (Texturas)', amount: 2.4, unit: 'g', notes: '0.8% ratio' },
      { id: 'ing-42', name: 'Calcium Lactate Gluconate Bath', amount: 10, unit: 'g in 1L water' },
      { id: 'ing-43', name: 'White Alba Truffle Oil (Cold Pressed)', amount: 8, unit: 'ml' },
      { id: 'ing-44', name: 'Soy Sauce Shoyu Extract', amount: 10, unit: 'ml' },
      { id: 'ing-45', name: 'Pure Water Bath for Rinsing', amount: 1000, unit: 'ml' },
    ],
    steps: [
      {
        id: 'st-40',
        stepNumber: 1,
        title: 'Alginate Hydration & De-aeration',
        instruction: 'Shear sodium alginate into flavored dashi with immersion blender. Rest in vacuum chamber to evacuate all suspended oxygen micro-bubbles.',
        timerDurationSec: 600,
        timerLabel: 'Vacuum De-aeration Timer (10m)',
        chefTip: 'If bubbles remain, the droplets will float and deform into teardrops rather than spherical spheres.'
      },
      {
        id: 'st-41',
        stepNumber: 2,
        title: 'Calcium Bath Dropping Matrix',
        instruction: 'Fill multi-channel caviar dispenser. Release droplets from 8cm height into 1% calcium lactate bath. Allow membrane to set for 2 minutes with continuous gentle swirling.',
        timerDurationSec: 120,
        timerLabel: 'Spherification Gel Matrix Timer (2m)',
        chefTip: 'Strictly monitor time: leaving spheres in calcium bath longer than 3 minutes causes core gelation.'
      },
      {
        id: 'st-42',
        stepNumber: 3,
        title: 'Rinse & Preservation',
        instruction: 'Collect pearls with perforated caviar spoon. Gently rinse in cold mineral water bath. Store in light white truffle oil suspension.',
        chefTip: 'Serve within 3 hours for maximum liquid explosion sensation on palate.'
      }
    ]
  },
  {
    id: 'vault-rc-06',
    vaultCode: 'VLT-601-CURED',
    title: 'Citrus & Koji-Cured Wild Hamachi',
    subtitle: 'Yellowtail kingfish cured in rice koji, blood orange ponzu, finger lime & shiso oil',
    category: 'Fermentation & Curing',
    difficulty: 'Advanced',
    prepTime: '1 Hour',
    cookTime: '6 Hours',
    totalTime: '7 Hours',
    calories: 340,
    servings: 4,
    rating: 4.97,
    reviewsCount: 118,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=85',
    origin: 'Hokkaido // Osaka Ferment Lab',
    chefNotes: 'Rice koji enzymes (protease and amylase) break down fish proteins into sweet amino acid complexes in just 6 hours.',
    flavorProfile: ['Sweet Koji Amino', 'Floral Citrus', 'Crisp Salinity', 'Herbaceous Shiso'],
    equipment: ['Yanagiba Sashimi Knife', 'Silica Curing Paper', 'Tweezers', 'Aerator for Shiso Oil'],
    nutrition: {
      calories: 340,
      proteinG: 34,
      carbsG: 8,
      fatG: 18,
      fiberG: 1,
    },
    winePairing: {
      beverageName: 'Dassai 23 Junmai Daiginjo Sake',
      type: 'Ultra-Premium Junmai Daiginjo',
      vintageOrOrigin: 'Yamaguchi, Japan',
      tastingNote: 'Delicate white peach and melon aromatics highlight the koji-cured amino sweetness.',
    },
    ingredients: [
      { id: 'ing-50', name: 'Sashimi-Grade Wild Hamachi Loin', amount: 450, unit: 'g' },
      { id: 'ing-51', name: 'Organic Dried Rice Koji (crushed)', amount: 80, unit: 'g' },
      { id: 'ing-52', name: 'Okinawa Sea Salt & Cane Sugar', amount: 20, unit: 'g', notes: '3:1 ratio' },
      { id: 'ing-53', name: 'Blood Orange Ponzu Glaze', amount: 50, unit: 'ml' },
      { id: 'ing-54', name: 'Fresh Australian Finger Lime Pearls', amount: 30, unit: 'g' },
      { id: 'ing-55', name: 'Emerald Green Shiso Leaf Oil', amount: 20, unit: 'ml' },
    ],
    steps: [
      {
        id: 'st-50',
        stepNumber: 1,
        title: 'Koji Enzyme Rub & Wrap',
        instruction: 'Coat clean hamachi loin with sugar-salt cure and crushed rice koji. Wrap tightly in porous moisture-wicking sheet and chill at 2°C for 6 hours.',
        timerDurationSec: 3600,
        timerLabel: 'Enzymatic Cure Monitor (60m check)',
        chefTip: 'The koji produces deep natural sweetness and tightens the flesh structure.'
      },
      {
        id: 'st-51',
        stepNumber: 2,
        title: 'Yanagiba Precision Slicing',
        instruction: 'Wipe off surface koji with cold sake cloth. Cut 3mm translucent shingled slices at a 45-degree angle in a single continuous pulling stroke.',
        chefTip: 'Do not saw the knife back and forth; one smooth pull preserves the delicate cell walls.'
      },
      {
        id: 'st-52',
        stepNumber: 3,
        title: 'Dressing & Citrus Caviar Accent',
        instruction: 'Arrange sashimi in a circle. Drizzle blood orange ponzu and shiso oil around plate. Top each slice with bursting finger lime pearls and micro shiso leaves.',
        chefTip: 'Serve immediately on chilled ceramic plates.'
      }
    ]
  },
  {
    id: 'vault-rc-07',
    vaultCode: 'VLT-880-RAMEN',
    title: '48-Hour Tonkotsu & Black Garlic Mayu Ramen',
    subtitle: 'Collagen-rich Kurobuta pork bone broth, hand-rolled low-hydration noodles & torched chashu',
    category: 'Sous-Vide & Meats',
    difficulty: 'Master',
    prepTime: '2 Hours',
    cookTime: '48 Hours',
    totalTime: '50 Hours',
    calories: 890,
    servings: 4,
    rating: 4.99,
    reviewsCount: 312,
    isClassified: true,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85',
    origin: 'Fukuoka // Secret Ramen Guild',
    chefNotes: 'A relentless rolling boil for 48 hours emulsifies marrow fat with water into an opaque, silky broth with over 15% gelatin density.',
    flavorProfile: ['Deep Collagen Umami', 'Charred Black Garlic', 'Rich Pork Marrow', 'Springy Alkaline Wheat'],
    equipment: ['Commercial Stockpot (30L)', 'Rolling Pin & Pasta Machine', 'Refractometer (Brix Meter)', 'Torch'],
    nutrition: {
      calories: 890,
      proteinG: 48,
      carbsG: 78,
      fatG: 42,
    },
    winePairing: {
      beverageName: 'Echigo Koshihikari Rice Lager & Iwai Tradition Whisky Highball',
      type: 'Craft Beer / Japanese Whisky',
      vintageOrOrigin: 'Niigata & Nagano, Japan',
      tastingNote: 'Crisp carbonation and subtle malt sweetness refresh the palate between rich spoonfuls of collagen broth.',
    },
    ingredients: [
      { id: 'ing-60', name: 'Kurobuta Pork Femur & Trotter Bones', amount: 2500, unit: 'g', notes: 'Blanched and scraped' },
      { id: 'ing-61', name: 'Kurobuta Pork Belly Block (for Chashu)', amount: 800, unit: 'g' },
      { id: 'ing-62', name: 'House Black Garlic Mayu (Toasted Sesame Oil & Charred Garlic)', amount: 60, unit: 'ml' },
      { id: 'ing-63', name: 'Alkaline Kansui Noodle Dough (34% Hydration)', amount: 480, unit: 'g' },
      { id: 'ing-64', name: 'Ajitsuke Tamago (6-Minute Cured Eggs)', amount: 4, unit: 'pcs' },
      { id: 'ing-65', name: 'Kombu & Katsuobushi Tare Seasoning', amount: 120, unit: 'ml' },
    ],
    steps: [
      {
        id: 'st-60',
        stepNumber: 1,
        title: 'Bone Blanching & Marrow Cleansing',
        instruction: 'Bring pork bones to a rapid boil for 15 minutes. Drain, scrub away dark coagulated blood under cold running water, and crack femurs to expose marrow cavities.',
        timerDurationSec: 900,
        timerLabel: 'Blanching Cleanse Timer (15m)',
        chefTip: 'Thorough cleaning is the sole secret to producing a creamy white broth without bitter sediment.'
      },
      {
        id: 'st-61',
        stepNumber: 2,
        title: '48-Hour Emulsion Rolling Boil',
        instruction: 'Cover cleaned bones with spring water. Maintain high rolling boil for 48 hours, replenishing water as evaporated, until broth measures 11.5° Brix on refractometer.',
        timerDurationSec: 3600,
        timerLabel: 'Brix Density Monitor (60m check)',
        chefTip: 'Fat cannot emulsify at a gentle simmer; keep the boil turbulent to bind water and lipids.'
      },
      {
        id: 'st-62',
        stepNumber: 3,
        title: 'Noodle Rolling & Flash Boil',
        instruction: 'Cut alkaline dough into 1.2mm straight Hakata-style strands. Flash boil in bubbling water for precisely 48 seconds (Barikata stiffness).',
        timerDurationSec: 48,
        timerLabel: 'Barikata Noodle Boil Timer (48s)',
        chefTip: 'Vigorously shake noodle basket 5 times over drain to remove all excess starch water.'
      },
      {
        id: 'st-63',
        stepNumber: 4,
        title: 'Assembly & Black Mayu Drizzle',
        instruction: 'Ladle tare and boiling tonkotsu broth into pre-warmed bowls. Fold noodles neatly into broth. Top with torched chashu, halved egg, and a swirl of jet-black garlic mayu.',
        chefTip: 'Serve piping hot within 2 minutes of assembly.'
      }
    ]
  },
  {
    id: 'vault-rc-08',
    vaultCode: 'VLT-224-MATCHA',
    title: 'Matcha Mille-Crêpe with Yuzu Gelée',
    subtitle: 'Twenty whisper-thin Uji matcha crêpes, whipped white chocolate diplomat & yuzu agar pearls',
    category: 'Pastry & Desserts',
    difficulty: 'Advanced',
    prepTime: '1.5 Hours',
    cookTime: '45 Min',
    totalTime: '2h 15m',
    calories: 460,
    servings: 8,
    rating: 4.97,
    reviewsCount: 195,
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=85',
    origin: 'Kyoto // Uji Imperial Tea Master',
    chefNotes: 'Ceremonial grade Uji matcha must be sifted and folded below 30°C to preserve vivid chlorophyll emerald hue.',
    flavorProfile: ['Grassy Umami', 'Creamy White Cacao', 'Zesty Yuzu', 'Delicate Vanilla'],
    equipment: ['Non-stick 20cm Crêpe Pan', 'Palette Spatula', 'Fine Mesh Sieve', 'Rotating Cake Turntable'],
    nutrition: {
      calories: 460,
      proteinG: 7,
      carbsG: 52,
      fatG: 24,
    },
    winePairing: {
      beverageName: 'Château d’Yquem Sauternes Premier Cru Supérieur',
      type: 'Noble Rot Dessert Wine',
      vintageOrOrigin: '2016 Sauternes, France',
      tastingNote: 'Honeyed apricot, beeswax, and saffron notes enhance the vegetal elegance of ceremonial grade matcha.',
    },
    ingredients: [
      { id: 'ing-70', name: 'Ceremonial Grade Uji Matcha Powder', amount: 28, unit: 'g' },
      { id: 'ing-71', name: 'Organic Pasture Milk & Eggs', amount: 650, unit: 'ml' },
      { id: 'ing-72', name: 'Valrhona Opalys 33% White Chocolate', amount: 180, unit: 'g' },
      { id: 'ing-73', name: 'Heavy Whipping Cream (38% Fat)', amount: 400, unit: 'ml' },
      { id: 'ing-74', name: 'Japanese Yuzu Purée & Agar-Agar', amount: 80, unit: 'ml' },
      { id: 'ing-75', name: 'Clarified Butter for Pan Glaze', amount: 40, unit: 'g' },
    ],
    steps: [
      {
        id: 'st-70',
        stepNumber: 1,
        title: 'Silk Matcha Crêpe Batter',
        instruction: 'Whisk eggs, warm milk, melted butter, and sifted matcha into flour until velvety smooth. Strain through fine mesh twice and rest in refrigerator for 2 hours.',
        timerDurationSec: 7200,
        timerLabel: 'Batter Hydration Rest Timer (2h)',
        chefTip: 'Resting relaxes gluten, allowing the crêpes to cook paper-thin without tearing.'
      },
      {
        id: 'st-71',
        stepNumber: 2,
        title: '20-Layer Crêpe Cooking',
        instruction: 'In a 20cm pan over medium-low heat, pour 35ml batter, swirl instantly, and cook for 60 seconds. Flip gently and cook for 15 seconds. Stack on parchment to cool.',
        timerDurationSec: 60,
        timerLabel: 'Single Crêpe Cook Timer (60s)',
        chefTip: 'Wipe pan with buttered cloth every 3 crêpes for uniform translucence.'
      },
      {
        id: 'st-72',
        stepNumber: 3,
        title: 'White Chocolate Diplomat Cream & Assembly',
        instruction: 'Melt white chocolate into vanilla custard base. Fold in stiff whipped cream. Place first crêpe on turntable, spread 30g cream with palette knife, repeat for all 20 layers.',
        chefTip: 'Keep cream chilled to 4°C so layers do not slide during construction.'
      },
      {
        id: 'st-73',
        stepNumber: 4,
        title: 'Garnish & Chilled Setting',
        instruction: 'Chill assembled cake for 4 hours. Dust top layer heavily with ceremonial matcha. Top with yuzu gelée pearls and gold leaf accents before slicing with a hot knife.',
        timerDurationSec: 14400,
        timerLabel: 'Cake Solidification Rest Timer (4h)',
        chefTip: 'Dip slicing knife into boiling water and wipe dry between each clean cut.'
      }
    ]
  }
];
