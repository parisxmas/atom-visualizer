
import colorsys

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
    print(f"    isReactive: {str(is_reactive).lower()}")
    print(f"  }},")
print("];")
