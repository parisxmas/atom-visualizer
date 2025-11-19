
# Author: Baris AKIN
import colorsys

# Detailed element properties for all 118 elements
element_details = {
    # Period 1
    'Hydrogen': {'melting': -259.14, 'boiling': -252.87, 'density': 0.00008988, 'year': 1766, 'uses': 'Fuel cells, ammonia production, rocket fuel'},
    'Helium': {'melting': None, 'boiling': -268.93, 'density': 0.0001785, 'year': 1868, 'uses': 'Balloons, cryogenics, breathing mixtures'},
    
    # Period 2
    'Lithium': {'melting': 180.5, 'boiling': 1342, 'density': 0.534, 'year': 1817, 'uses': 'Batteries, ceramics, lubricants'},
    'Beryllium': {'melting': 1287, 'boiling': 2470, 'density': 1.85, 'year': 1798, 'uses': 'Aerospace alloys, X-ray windows'},
    'Boron': {'melting': 2075, 'boiling': 4000, 'density': 2.34, 'year': 1808, 'uses': 'Glass, detergents, semiconductors'},
    'Carbon': {'melting': 3550, 'boiling': 4027, 'density': 2.267, 'year': -3750, 'uses': 'Steel, plastics, diamonds, graphite'},
    'Nitrogen': {'melting': -210, 'boiling': -195.79, 'density': 0.0012506, 'year': 1772, 'uses': 'Fertilizers, explosives, food preservation'},
    'Oxygen': {'melting': -218.79, 'boiling': -182.95, 'density': 0.001429, 'year': 1774, 'uses': 'Respiration, steel production, water treatment'},
    'Fluorine': {'melting': -219.62, 'boiling': -188.12, 'density': 0.001696, 'year': 1886, 'uses': 'Toothpaste, refrigerants, Teflon'},
    'Neon': {'melting': -248.59, 'boiling': -246.08, 'density': 0.0008999, 'year': 1898, 'uses': 'Neon signs, lasers, cryogenic refrigerant'},
    
    # Period 3
    'Sodium': {'melting': 97.72, 'boiling': 883, 'density': 0.971, 'year': 1807, 'uses': 'Table salt, soap, street lights'},
    'Magnesium': {'melting': 650, 'boiling': 1090, 'density': 1.738, 'year': 1755, 'uses': 'Alloys, fireworks, flash photography'},
    'Aluminum': {'melting': 660.32, 'boiling': 2519, 'density': 2.698, 'year': 1825, 'uses': 'Cans, foil, aircraft, construction'},
    'Silicon': {'melting': 1414, 'boiling': 3265, 'density': 2.3296, 'year': 1824, 'uses': 'Computer chips, solar cells, glass'},
    'Phosphorus': {'melting': 44.15, 'boiling': 280.5, 'density': 1.82, 'year': 1669, 'uses': 'Fertilizers, detergents, matches'},
    'Sulfur': {'melting': 115.21, 'boiling': 444.6, 'density': 2.067, 'year': -2000, 'uses': 'Sulfuric acid, gunpowder, vulcanizing rubber'},
    'Chlorine': {'melting': -101.5, 'boiling': -34.04, 'density': 0.003214, 'year': 1774, 'uses': 'Water purification, bleach, PVC'},
    'Argon': {'melting': -189.35, 'boiling': -185.85, 'density': 0.0017837, 'year': 1894, 'uses': 'Welding, light bulbs, insulation'},
    
    # Period 4
    'Potassium': {'melting': 63.5, 'boiling': 759, 'density': 0.862, 'year': 1807, 'uses': 'Fertilizers, soap, glass'},
    'Calcium': {'melting': 842, 'boiling': 1484, 'density': 1.54, 'year': 1808, 'uses': 'Bones, cement, cheese production'},
    'Scandium': {'melting': 1541, 'boiling': 2836, 'density': 2.989, 'year': 1879, 'uses': 'Aerospace alloys, sports equipment'},
    'Titanium': {'melting': 1668, 'boiling': 3287, 'density': 4.506, 'year': 1791, 'uses': 'Aircraft, medical implants, white paint'},
    'Vanadium': {'melting': 1910, 'boiling': 3407, 'density': 6.11, 'year': 1801, 'uses': 'Steel alloys, catalysts, batteries'},
    'Chromium': {'melting': 1907, 'boiling': 2671, 'density': 7.15, 'year': 1797, 'uses': 'Stainless steel, chrome plating, dyes'},
    'Manganese': {'melting': 1246, 'boiling': 2061, 'density': 7.44, 'year': 1774, 'uses': 'Steel production, batteries, fertilizers'},
    'Iron': {'melting': 1538, 'boiling': 2862, 'density': 7.874, 'year': -1200, 'uses': 'Steel, construction, machinery, hemoglobin'},
    'Cobalt': {'melting': 1495, 'boiling': 2927, 'density': 8.86, 'year': 1735, 'uses': 'Magnets, batteries, blue pigments'},
    'Nickel': {'melting': 1455, 'boiling': 2913, 'density': 8.912, 'year': 1751, 'uses': 'Stainless steel, coins, batteries'},
    'Copper': {'melting': 1084.62, 'boiling': 2562, 'density': 8.96, 'year': -9000, 'uses': 'Electrical wiring, plumbing, coins'},
    'Zinc': {'melting': 419.53, 'boiling': 907, 'density': 7.134, 'year': 1746, 'uses': 'Galvanizing, brass, batteries'},
    'Gallium': {'melting': 29.76, 'boiling': 2204, 'density': 5.907, 'year': 1875, 'uses': 'Semiconductors, LEDs, solar cells'},
    'Germanium': {'melting': 938.25, 'boiling': 2833, 'density': 5.323, 'year': 1886, 'uses': 'Fiber optics, infrared optics, transistors'},
    'Arsenic': {'melting': 817, 'boiling': 614, 'density': 5.776, 'year': 1250, 'uses': 'Semiconductors, wood preservatives, pesticides'},
    'Selenium': {'melting': 221, 'boiling': 685, 'density': 4.809, 'year': 1817, 'uses': 'Glass manufacturing, electronics, photocopiers'},
    'Bromine': {'melting': -7.2, 'boiling': 58.8, 'density': 3.122, 'year': 1826, 'uses': 'Flame retardants, water treatment, photography'},
    'Krypton': {'melting': -157.36, 'boiling': -153.22, 'density': 0.003733, 'year': 1898, 'uses': 'Lighting, lasers, insulation'},
    
    # Period 5
    'Rubidium': {'melting': 39.31, 'boiling': 688, 'density': 1.532, 'year': 1861, 'uses': 'Atomic clocks, photocells, research'},
    'Strontium': {'melting': 777, 'boiling': 1382, 'density': 2.64, 'year': 1790, 'uses': 'Fireworks, flares, magnets'},
    'Yttrium': {'melting': 1526, 'boiling': 3345, 'density': 4.469, 'year': 1794, 'uses': 'LEDs, superconductors, cancer treatment'},
    'Zirconium': {'melting': 1855, 'boiling': 4409, 'density': 6.506, 'year': 1789, 'uses': 'Nuclear reactors, ceramics, gems'},
    'Niobium': {'melting': 2477, 'boiling': 4744, 'density': 8.57, 'year': 1801, 'uses': 'Superconductors, steel alloys, jewelry'},
    'Molybdenum': {'melting': 2623, 'boiling': 4639, 'density': 10.22, 'year': 1778, 'uses': 'Steel alloys, lubricants, catalysts'},
    'Technetium': {'melting': 2157, 'boiling': 4265, 'density': 11.5, 'year': 1937, 'uses': 'Medical imaging, corrosion inhibitor'},
    'Ruthenium': {'melting': 2334, 'boiling': 4150, 'density': 12.37, 'year': 1844, 'uses': 'Electronics, catalysts, alloys'},
    'Rhodium': {'melting': 1964, 'boiling': 3695, 'density': 12.41, 'year': 1803, 'uses': 'Catalytic converters, jewelry, mirrors'},
    'Palladium': {'melting': 1554.9, 'boiling': 2963, 'density': 12.02, 'year': 1803, 'uses': 'Catalytic converters, electronics, dentistry'},
    'Silver': {'melting': 961.78, 'boiling': 2162, 'density': 10.501, 'year': -3000, 'uses': 'Jewelry, coins, photography, electronics'},
    'Cadmium': {'melting': 321.07, 'boiling': 767, 'density': 8.69, 'year': 1817, 'uses': 'Batteries, pigments, coatings'},
    'Indium': {'melting': 156.60, 'boiling': 2072, 'density': 7.31, 'year': 1863, 'uses': 'Touch screens, solar panels, LEDs'},
    'Tin': {'melting': 231.93, 'boiling': 2602, 'density': 7.287, 'year': -3500, 'uses': 'Solder, tin cans, bronze'},
    'Antimony': {'melting': 630.63, 'boiling': 1587, 'density': 6.685, 'year': 1450, 'uses': 'Flame retardants, batteries, semiconductors'},
    'Tellurium': {'melting': 449.51, 'boiling': 988, 'density': 6.232, 'year': 1783, 'uses': 'Solar cells, thermoelectrics, metallurgy'},
    'Iodine': {'melting': 113.7, 'boiling': 184.3, 'density': 4.93, 'year': 1811, 'uses': 'Disinfectants, pharmaceuticals, photography'},
    'Xenon': {'melting': -111.75, 'boiling': -108.04, 'density': 0.005887, 'year': 1898, 'uses': 'Lighting, anesthesia, ion propulsion'},
    
    # Period 6
    'Cesium': {'melting': 28.44, 'boiling': 671, 'density': 1.873, 'year': 1860, 'uses': 'Atomic clocks, drilling fluids, photoelectric cells'},
    'Barium': {'melting': 727, 'boiling': 1870, 'density': 3.594, 'year': 1808, 'uses': 'Medical imaging, fireworks, drilling fluids'},
    'Lanthanum': {'melting': 918, 'boiling': 3464, 'density': 6.145, 'year': 1839, 'uses': 'Camera lenses, lighting, batteries'},
    'Cerium': {'melting': 798, 'boiling': 3443, 'density': 6.770, 'year': 1803, 'uses': 'Catalytic converters, lighter flints, glass polishing'},
    'Praseodymium': {'melting': 931, 'boiling': 3520, 'density': 6.773, 'year': 1885, 'uses': 'Magnets, lasers, arc lighting'},
    'Neodymium': {'melting': 1021, 'boiling': 3074, 'density': 7.007, 'year': 1885, 'uses': 'Powerful magnets, lasers, glass coloring'},
    'Promethium': {'melting': 1042, 'boiling': 3000, 'density': 7.26, 'year': 1945, 'uses': 'Luminous paint, atomic batteries, thickness gauges'},
    'Samarium': {'melting': 1072, 'boiling': 1794, 'density': 7.520, 'year': 1879, 'uses': 'Magnets, lasers, nuclear reactors'},
    'Europium': {'melting': 822, 'boiling': 1529, 'density': 5.243, 'year': 1901, 'uses': 'Phosphors, lasers, nuclear control rods'},
    'Gadolinium': {'melting': 1313, 'boiling': 3273, 'density': 7.895, 'year': 1880, 'uses': 'MRI contrast agents, magnets, neutron capture'},
    'Terbium': {'melting': 1356, 'boiling': 3230, 'density': 8.229, 'year': 1843, 'uses': 'Phosphors, magnets, fuel cells'},
    'Dysprosium': {'melting': 1412, 'boiling': 2567, 'density': 8.550, 'year': 1886, 'uses': 'Magnets, lasers, nuclear reactors'},
    'Holmium': {'melting': 1474, 'boiling': 2700, 'density': 8.795, 'year': 1878, 'uses': 'Lasers, magnets, nuclear reactors'},
    'Erbium': {'melting': 1529, 'boiling': 2868, 'density': 9.066, 'year': 1843, 'uses': 'Fiber optics, lasers, nuclear technology'},
    'Thulium': {'melting': 1545, 'boiling': 1950, 'density': 9.321, 'year': 1879, 'uses': 'Portable X-ray devices, lasers, alloys'},
    'Ytterbium': {'melting': 824, 'boiling': 1196, 'density': 6.965, 'year': 1878, 'uses': 'Lasers, metallurgy, stress gauges'},
    'Lutetium': {'melting': 1663, 'boiling': 3402, 'density': 9.840, 'year': 1907, 'uses': 'Catalysts, phosphors, dating rocks'},
    'Hafnium': {'melting': 2233, 'boiling': 4603, 'density': 13.31, 'year': 1923, 'uses': 'Nuclear reactors, microprocessors, plasma cutting'},
    'Tantalum': {'melting': 3017, 'boiling': 5458, 'density': 16.654, 'year': 1802, 'uses': 'Capacitors, surgical implants, jet engines'},
    'Tungsten': {'melting': 3422, 'boiling': 5555, 'density': 19.25, 'year': 1783, 'uses': 'Light bulb filaments, cutting tools, armor'},
    'Rhenium': {'melting': 3186, 'boiling': 5596, 'density': 21.02, 'year': 1925, 'uses': 'Jet engines, catalysts, thermocouples'},
    'Osmium': {'melting': 3033, 'boiling': 5012, 'density': 22.59, 'year': 1803, 'uses': 'Fountain pen tips, electrical contacts, catalysts'},
    'Iridium': {'melting': 2446, 'boiling': 4428, 'density': 22.56, 'year': 1803, 'uses': 'Spark plugs, crucibles, electrical contacts'},
    'Platinum': {'melting': 1768.3, 'boiling': 3825, 'density': 21.46, 'year': 1735, 'uses': 'Catalytic converters, jewelry, laboratory equipment'},
    'Gold': {'melting': 1064.18, 'boiling': 2856, 'density': 19.282, 'year': -6000, 'uses': 'Jewelry, electronics, currency, dentistry'},
    'Mercury': {'melting': -38.83, 'boiling': 356.73, 'density': 13.5336, 'year': -1500, 'uses': 'Thermometers, fluorescent lamps, dental amalgams'},
    'Thallium': {'melting': 304, 'boiling': 1473, 'density': 11.85, 'year': 1861, 'uses': 'Electronics, optics, medical imaging'},
    'Lead': {'melting': 327.46, 'boiling': 1749, 'density': 11.342, 'year': -7000, 'uses': 'Batteries, radiation shielding, ammunition'},
    'Bismuth': {'melting': 271.3, 'boiling': 1564, 'density': 9.807, 'year': 1753, 'uses': 'Cosmetics, pharmaceuticals, fire detectors'},
    'Polonium': {'melting': 254, 'boiling': 962, 'density': 9.32, 'year': 1898, 'uses': 'Antistatic devices, nuclear batteries, research'},
    'Astatine': {'melting': 302, 'boiling': 337, 'density': 7, 'year': 1940, 'uses': 'Cancer treatment research, radioactive tracers'},
    'Radon': {'melting': -71, 'boiling': -61.7, 'density': 0.00973, 'year': 1900, 'uses': 'Cancer treatment, earthquake prediction, research'},
    
    # Period 7
    'Francium': {'melting': 27, 'boiling': 677, 'density': 1.87, 'year': 1939, 'uses': 'Scientific research, atomic structure studies'},
    'Radium': {'melting': 696, 'boiling': 1737, 'density': 5, 'year': 1898, 'uses': 'Cancer treatment, luminous paint, neutron sources'},
    'Actinium': {'melting': 1051, 'boiling': 3198, 'density': 10.07, 'year': 1899, 'uses': 'Neutron sources, cancer treatment research'},
    'Thorium': {'melting': 1750, 'boiling': 4820, 'density': 11.72, 'year': 1828, 'uses': 'Nuclear fuel, gas mantles, welding electrodes'},
    'Protactinium': {'melting': 1572, 'boiling': 4000, 'density': 15.37, 'year': 1913, 'uses': 'Scientific research, nuclear studies'},
    'Uranium': {'melting': 1135, 'boiling': 4131, 'density': 18.95, 'year': 1789, 'uses': 'Nuclear fuel, weapons, depleted uranium armor'},
    'Neptunium': {'melting': 644, 'boiling': 4000, 'density': 20.45, 'year': 1940, 'uses': 'Neutron detection, plutonium production, research'},
    'Plutonium': {'melting': 640, 'boiling': 3228, 'density': 19.84, 'year': 1940, 'uses': 'Nuclear weapons, spacecraft power, research'},
    'Americium': {'melting': 1176, 'boiling': 2011, 'density': 13.69, 'year': 1944, 'uses': 'Smoke detectors, neutron sources, research'},
    'Curium': {'melting': 1345, 'boiling': 3110, 'density': 13.51, 'year': 1944, 'uses': 'Spacecraft power, alpha particle sources, research'},
    'Berkelium': {'melting': 1050, 'boiling': 2900, 'density': 14.79, 'year': 1949, 'uses': 'Scientific research, element synthesis'},
    'Californium': {'melting': 900, 'boiling': 1470, 'density': 15.1, 'year': 1950, 'uses': 'Neutron sources, cancer treatment, metal detectors'},
    'Einsteinium': {'melting': 860, 'boiling': 1130, 'density': 8.84, 'year': 1952, 'uses': 'Scientific research, element synthesis'},
    'Fermium': {'melting': 1527, 'boiling': None, 'density': None, 'year': 1952, 'uses': 'Scientific research, nuclear studies'},
    'Mendelevium': {'melting': 827, 'boiling': None, 'density': None, 'year': 1955, 'uses': 'Scientific research, nuclear physics'},
    'Nobelium': {'melting': 827, 'boiling': None, 'density': None, 'year': 1958, 'uses': 'Scientific research, nuclear studies'},
    'Lawrencium': {'melting': 1627, 'boiling': None, 'density': None, 'year': 1961, 'uses': 'Scientific research, nuclear physics'},
    'Rutherfordium': {'melting': None, 'boiling': None, 'density': None, 'year': 1964, 'uses': 'Scientific research, nuclear studies'},
    'Dubnium': {'melting': None, 'boiling': None, 'density': None, 'year': 1968, 'uses': 'Scientific research, nuclear physics'},
    'Seaborgium': {'melting': None, 'boiling': None, 'density': None, 'year': 1974, 'uses': 'Scientific research, nuclear studies'},
    'Bohrium': {'melting': None, 'boiling': None, 'density': None, 'year': 1981, 'uses': 'Scientific research, nuclear physics'},
    'Hassium': {'melting': None, 'boiling': None, 'density': None, 'year': 1984, 'uses': 'Scientific research, nuclear studies'},
    'Meitnerium': {'melting': None, 'boiling': None, 'density': None, 'year': 1982, 'uses': 'Scientific research, nuclear physics'},
    'Darmstadtium': {'melting': None, 'boiling': None, 'density': None, 'year': 1994, 'uses': 'Scientific research, nuclear studies'},
    'Roentgenium': {'melting': None, 'boiling': None, 'density': None, 'year': 1994, 'uses': 'Scientific research, nuclear physics'},
    'Copernicium': {'melting': None, 'boiling': None, 'density': None, 'year': 1996, 'uses': 'Scientific research, nuclear studies'},
    'Nihonium': {'melting': None, 'boiling': None, 'density': None, 'year': 2004, 'uses': 'Scientific research, nuclear physics'},
    'Flerovium': {'melting': None, 'boiling': None, 'density': None, 'year': 1998, 'uses': 'Scientific research, nuclear studies'},
    'Moscovium': {'melting': None, 'boiling': None, 'density': None, 'year': 2003, 'uses': 'Scientific research, nuclear physics'},
    'Livermorium': {'melting': None, 'boiling': None, 'density': None, 'year': 2000, 'uses': 'Scientific research, nuclear studies'},
    'Tennessine': {'melting': None, 'boiling': None, 'density': None, 'year': 2010, 'uses': 'Scientific research, nuclear physics'},
    'Oganesson': {'melting': None, 'boiling': None, 'density': None, 'year': 2002, 'uses': 'Scientific research, nuclear studies'},
}


elements = [
    ("Hydrogen", "H"), ("Helium", "He"), ("Lithium", "Li"), ("Beryllium", "Be"), ("Boron", "B"), ("Carbon", "C"), ("Nitrogen", "N"), ("Oxygen", "O"), ("Fluorine", "F"), ("Neon", "Ne"),
    ("Sodium", "Na"), ("Magnesium", "Mg"), ("Aluminum", "Al"), ("Silicon", "Si"), ("Phosphorus", "P"), ("Sulfur", "S"), ("Chlorine", "Cl"), ("Argon", "Ar"), ("Potassium", "K"), ("Calcium", "Ca"),
    ("Scandium", "Sc"), ("Titanium", "Ti"), ("Vanadium", "V"), ("Chromium", "Cr"), ("Manganese", "Mn"), ("Iron", "Fe"), ("Cobalt", "Co"), ("Nickel", "Ni"), ("Copper", "Cu"), ("Zinc", "Zn"),
    ("Gallium", "Ga"), ("Germanium", "Ge"), ("Arsenic", "As"), ("Selenium", "Se"), ("Bromine", "Br"), ("Krypton", "Kr"), ("Rubidium", "Rb"), ("Strontium", "Sr"), ("Yttrium", "Y"), ("Zirconium", "Zr"),
    ("Niobium", "Nb"), ("Molybdenum", "Mo"), ("Technetium", "Tc"), ("Ruthenium", "Ru"), ("Rhodium", "Rh"), ("Palladium", "Pd"), ("Silver", "Ag"), ("Cadmium", "Cd"), ("Indium", "In"), ("Tin", "Sn"),
    ("Antimony", "Sb"), ("Tellurium", "Te"), ("Iodine", "I"), ("Xenon", "Xe"), ("Cesium", "Cs"), ("Barium", "Ba"), ("Lanthanum", "La"), ("Cerium", "Ce"), ("Praseodymium", "Pr"), ("Neodymium", "Nd"),
    ("Promethium", "Pm"), ("Samarium", "Sm"), ("Europium", "Eu"), ("Gadolinium", "Gd"), ("Terbium", "Tb"), ("Dysprosium", "Dy"), ("Holmium", "Ho"), ("Erbium", "Er"), ("Thulium", "Tm"), ("Ytterbium", "Yb"),
    ("Lutetium", "Lu"), ("Hafnium", "Hf"), ("Tantalum", "Ta"), ("Tungsten", "W"), ("Rhenium", "Re"), ("Osmium", "Os"), ("Iridium", "Ir"), ("Platinum", "Pt"), ("Gold", "Au"), ("Mercury", "Hg"),
    ("Thallium", "Tl"), ("Lead", "Pb"), ("Bismuth", "Bi"), ("Polonium", "Po"), ("Astatine", "At"), ("Radon", "Rn"), ("Francium", "Fr"), ("Radium", "Ra"), ("Actinium", "Ac"), ("Thorium", "Th"),
    ("Protactinium", "Pa"), ("Uranium", "U"), ("Neptunium", "Np"), ("Plutonium", "Pu"), ("Americium", "Am"), ("Curium", "Cm"), ("Berkelium", "Bk"), ("Californium", "Cf"), ("Einsteinium", "Es"), ("Fermium", "Fm"),
    ("Mendelevium", "Md"), ("Nobelium", "No"), ("Lawrencium", "Lr"), ("Rutherfordium", "Rf"), ("Dubnium", "Db"), ("Seaborgium", "Sg"), ("Bohrium", "Bh"), ("Hassium", "Hs"), ("Meitnerium", "Mt"), ("Darmstadtium", "Ds"),
    ("Roentgenium", "Rg"), ("Copernicium", "Cn"), ("Nihonium", "Nh"), ("Flerovium", "Fl"), ("Moscovium", "Mc"), ("Livermorium", "Lv"), ("Tennessine", "Ts"), ("Oganesson", "Og")
]

print("export const atoms = [")
for i, (name, symbol) in enumerate(elements):
    atomic_number = i + 1
    protons = atomic_number
    # Rough estimate of neutrons: Mass number approx 2 * Z for light, 2.5 * Z for heavy
    mass = atomic_number * 2
    if atomic_number > 20: mass = int(atomic_number * 2.2)
    if atomic_number > 50: mass = int(atomic_number * 2.4)
    if atomic_number > 80: mass = int(atomic_number * 2.5)
    neutrons = mass - protons
    electrons = protons
    
    # Color generation (HSL to Hex)
    hue = (i * 137.5) % 360 # Golden angle approximation for distribution
    # Simple hex conversion (mock)
    color = f"0x{int(hue/360*16777215):06x}" # Randomish color based on index
    
    # Atom color
    rgb = colorsys.hsv_to_rgb(hue/360.0, 1.0, 1.0)
    color_hex = "0x{:02x}{:02x}{:02x}".format(int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255))

    # Electron color: Shift hue by 180 degrees (complementary) or just different offset
    electron_hue = (hue + 180) % 360
    electron_rgb = colorsys.hsv_to_rgb(electron_hue/360.0, 1.0, 1.0)
    electron_color_hex = "0x{:02x}{:02x}{:02x}".format(int(electron_rgb[0]*255), int(electron_rgb[1]*255), int(electron_rgb[2]*255))

    # Determine position in periodic table
    # Standard 18-column layout
    xpos = 1
    ypos = 1
    
    if atomic_number == 1: xpos, ypos = 1, 1 # H
    elif atomic_number == 2: xpos, ypos = 18, 1 # He
    elif 3 <= atomic_number <= 10: # Period 2
        ypos = 2
        if atomic_number <= 4: xpos = atomic_number - 2
        else: xpos = atomic_number + 13 - 5 # B(5) -> 13
    elif 11 <= atomic_number <= 18: # Period 3
        ypos = 3
        if atomic_number <= 12: xpos = atomic_number - 10
        else: xpos = atomic_number + 13 - 13 # Al(13) -> 13
    elif 19 <= atomic_number <= 36: # Period 4
        ypos = 4
        xpos = atomic_number - 18
    elif 37 <= atomic_number <= 54: # Period 5
        ypos = 5
        xpos = atomic_number - 36
    elif 55 <= atomic_number <= 86: # Period 6
        ypos = 6
        if 57 <= atomic_number <= 71: # Lanthanides
            ypos = 9 # Separate row
            xpos = atomic_number - 57 + 4 # Start at col 4? Usually 3 or 4. Let's put them below.
            # Standard: La is often in group 3, but usually the block is separate.
            # Let's put them in row 8 (period 8 visual) starting col 3
            ypos = 8
            xpos = atomic_number - 57 + 3
        else:
            if atomic_number < 57: xpos = atomic_number - 54
            else: xpos = atomic_number - 54 - 14 # Skip lanthanides
    elif 87 <= atomic_number <= 118: # Period 7
        ypos = 7
        if 89 <= atomic_number <= 103: # Actinides
            ypos = 9
            xpos = atomic_number - 89 + 3
        else:
            if atomic_number < 89: xpos = atomic_number - 86
            else: xpos = atomic_number - 86 - 14

    # Determine Reactivity
    reactivity = "Moderate"
    is_reactive = False
    
    if atomic_number == 1:
        reactivity = "Explosive"
        is_reactive = True
    elif xpos == 18:
        reactivity = "Noble Gas (Inert)"
        is_reactive = False
    elif xpos == 1 and atomic_number != 1:
        reactivity = "Alkali Metal (Highly Reactive)"
        is_reactive = True
    elif xpos == 2:
        reactivity = "Alkaline Earth Metal (Reactive)"
        is_reactive = True
    elif xpos == 17:
        reactivity = "Halogen (Highly Reactive)"
        is_reactive = True
    elif xpos == 16:
        reactivity = "Chalcogen (Reactive)"
        is_reactive = True
    elif 57 <= atomic_number <= 71 or 89 <= atomic_number <= 103:
        reactivity = "Radioactive/Reactive"
        is_reactive = True # Broad generalization
    
    # Special cases for noble metals
    if symbol in ["Au", "Pt", "Ag", "Ir", "Os", "Pd", "Rh", "Ru"]:
        reactivity = "Noble Metal (Unreactive)"
        is_reactive = False

    description = f"{name} is a chemical element with symbol {symbol} and atomic number {atomic_number}. It is classified as a {reactivity}."
    
    # Get detailed properties if available
    details = element_details.get(name, {})
    melting = details.get('melting', None)
    boiling = details.get('boiling', None)
    density = details.get('density', None)
    year_discovered = details.get('year', None)
    uses = details.get('uses', 'Various industrial and scientific applications')
    
    # Convert None to 'null' for JavaScript
    melting_str = 'null' if melting is None else str(melting)
    boiling_str = 'null' if boiling is None else str(boiling)
    density_str = 'null' if density is None else str(density)
    year_str = 'null' if year_discovered is None else str(year_discovered)
    
    print(f"  {{")
    print(f"    name: \"{name}\",")
    print(f"    symbol: \"{symbol}\",")
    print(f"    atomicNumber: {atomic_number},")
    print(f"    protons: {protons},")
    print(f"    neutrons: {neutrons},")
    print(f"    electrons: {electrons},")
    print(f"    color: {color_hex},")
    print(f"    electronColor: {electron_color_hex},")
    print(f"    xpos: {xpos},")
    print(f"    ypos: {ypos},")
    print(f"    reactivity: \"{reactivity}\",")
    print(f"    isReactive: {str(is_reactive).lower()},")
    print(f"    description: \"{description}\",")
    print(f"    melting: {melting_str},")
    print(f"    boiling: {boiling_str},")
    print(f"    density: {density_str},")
    print(f"    yearDiscovered: {year_str},")
    print(f"    uses: \"{uses}\"")
    print(f"  }},")
print("];")
