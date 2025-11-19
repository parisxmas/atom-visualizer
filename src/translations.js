/**
 * Author: Baris AKIN
 */

// Turkish translations for element names
const elementNamesTR = {
    'Hydrogen': 'Hidrojen',
    'Helium': 'Helyum',
    'Lithium': 'Lityum',
    'Beryllium': 'Berilyum',
    'Boron': 'Bor',
    'Carbon': 'Karbon',
    'Nitrogen': 'Azot',
    'Oxygen': 'Oksijen',
    'Fluorine': 'Flor',
    'Neon': 'Neon',
    'Sodium': 'Sodyum',
    'Magnesium': 'Magnezyum',
    'Aluminum': 'Alüminyum',
    'Silicon': 'Silisyum',
    'Phosphorus': 'Fosfor',
    'Sulfur': 'Kükürt',
    'Chlorine': 'Klor',
    'Argon': 'Argon',
    'Potassium': 'Potasyum',
    'Calcium': 'Kalsiyum',
    'Scandium': 'Skandiyum',
    'Titanium': 'Titanyum',
    'Vanadium': 'Vanadyum',
    'Chromium': 'Krom',
    'Manganese': 'Mangan',
    'Iron': 'Demir',
    'Cobalt': 'Kobalt',
    'Nickel': 'Nikel',
    'Copper': 'Bakır',
    'Zinc': 'Çinko',
    'Gallium': 'Galyum',
    'Germanium': 'Germanyum',
    'Arsenic': 'Arsenik',
    'Selenium': 'Selenyum',
    'Bromine': 'Brom',
    'Krypton': 'Kripton',
    'Rubidium': 'Rubidyum',
    'Strontium': 'Stronsiyum',
    'Yttrium': 'İtriyum',
    'Zirconium': 'Zirkonyum',
    'Niobium': 'Niyobyum',
    'Molybdenum': 'Molibden',
    'Technetium': 'Teknesyum',
    'Ruthenium': 'Rutenyum',
    'Rhodium': 'Rodyum',
    'Palladium': 'Paladyum',
    'Silver': 'Gümüş',
    'Cadmium': 'Kadmiyum',
    'Indium': 'İndiyum',
    'Tin': 'Kalay',
    'Antimony': 'Antimon',
    'Tellurium': 'Tellür',
    'Iodine': 'İyot',
    'Xenon': 'Ksenon',
    'Cesium': 'Sezyum',
    'Barium': 'Baryum',
    'Lanthanum': 'Lantanyum',
    'Cerium': 'Seryum',
    'Praseodymium': 'Praseodimyum',
    'Neodymium': 'Neodimyum',
    'Promethium': 'Prometyum',
    'Samarium': 'Samaryum',
    'Europium': 'Evropiyum',
    'Gadolinium': 'Gadolinyum',
    'Terbium': 'Terbiyum',
    'Dysprosium': 'Disprozyum',
    'Holmium': 'Holmiyum',
    'Erbium': 'Erbiyum',
    'Thulium': 'Tulyum',
    'Ytterbium': 'İterbiyum',
    'Lutetium': 'Lutesyum',
    'Hafnium': 'Hafniyum',
    'Tantalum': 'Tantal',
    'Tungsten': 'Tungsten',
    'Rhenium': 'Renyum',
    'Osmium': 'Osmiyum',
    'Iridium': 'İridyum',
    'Platinum': 'Platin',
    'Gold': 'Altın',
    'Mercury': 'Cıva',
    'Thallium': 'Talyum',
    'Lead': 'Kurşun',
    'Bismuth': 'Bizmut',
    'Polonium': 'Polonyum',
    'Astatine': 'Astatin',
    'Radon': 'Radon',
    'Francium': 'Fransiyum',
    'Radium': 'Radyum',
    'Actinium': 'Aktinyum',
    'Thorium': 'Toryum',
    'Protactinium': 'Protaktinyum',
    'Uranium': 'Uranyum',
    'Neptunium': 'Neptünyum',
    'Plutonium': 'Plütonyum',
    'Americium': 'Amerikyum',
    'Curium': 'Küriyum',
    'Berkelium': 'Berkelyum',
    'Californium': 'Kaliforniyum',
    'Einsteinium': 'Einsteinyum',
    'Fermium': 'Fermiyum',
    'Mendelevium': 'Mendelevyum',
    'Nobelium': 'Nobelyum',
    'Lawrencium': 'Lawrensiyum',
    'Rutherfordium': 'Rutherfordiyum',
    'Dubnium': 'Dubniyum',
    'Seaborgium': 'Seaborgiyum',
    'Bohrium': 'Bohriyum',
    'Hassium': 'Hassiyum',
    'Meitnerium': 'Meitneryum',
    'Darmstadtium': 'Darmstadtiyum',
    'Roentgenium': 'Roentgenyum',
    'Copernicium': 'Kopernikyum',
    'Nihonium': 'Nihonyum',
    'Flerovium': 'Flerovyum',
    'Moscovium': 'Moskovyum',
    'Livermorium': 'Livermoryum',
    'Tennessine': 'Tenesin',
    'Oganesson': 'Oganesson'
};

// Reactivity translations
const reactivityTR = {
    'Alkali Metal (Highly Reactive)': 'Alkali Metal (Yüksek Reaktif)',
    'Alkaline Earth Metal (Reactive)': 'Toprak Alkali Metal (Reaktif)',
    'Halogen (Highly Reactive)': 'Halojen (Yüksek Reaktif)',
    'Noble Gas (Inert)': 'Soy Gaz (İnert)',
    'Transition Metal (Moderate)': 'Geçiş Metali (Orta)',
    'Post-Transition Metal (Moderate)': 'Geçiş Sonrası Metal (Orta)',
    'Metalloid (Moderate)': 'Yarı Metal (Orta)',
    'Nonmetal (Moderate)': 'Ametal (Orta)',
    'Lanthanide (Moderate)': 'Lantanit (Orta)',
    'Actinide (Radioactive)': 'Aktinit (Radyoaktif)',
    'Noble Metal (Unreactive)': 'Soy Metal (Reaktif Değil)'
};

// Get current language from browser
export function getCurrentLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('tr') ? 'tr' : 'en';
}

// Get translated element name
export function getElementName(englishName, lang = 'en') {
    if (lang === 'tr' && elementNamesTR[englishName]) {
        return elementNamesTR[englishName];
    }
    return englishName;
}

// Get translated reactivity
export function getReactivity(englishReactivity, lang = 'en') {
    if (lang === 'tr' && reactivityTR[englishReactivity]) {
        return reactivityTR[englishReactivity];
    }
    return englishReactivity;
}

// Get translated description
export function getDescription(data, lang = 'en') {
    const name = getElementName(data.name, lang);
    const reactivity = getReactivity(data.reactivity, lang);

    if (lang === 'tr') {
        return `${name}, ${data.symbol} sembolü ve ${data.atomicNumber} atom numarası ile bir kimyasal elementtir. ${reactivity} olarak sınıflandırılır.`;
    }

    return `${name} is a chemical element with symbol ${data.symbol} and atomic number ${data.atomicNumber}. It is classified as a ${reactivity}.`;
}
