export const CATEGORY_OPTIONS = [
  "Mini PCs",
  "Laptop",
  "Workstation",
  "Computers",
  "Monitor",
  "TV",
  "CCTV",
  "Printers",
  "Accessories",
];

export const SPEC_FIELDS = [
  "Supported RAMs",
  "Supported Processors",
  "Supported Storage",
];

const CATEGORIES_WITH_SPECS = [
  "Mini PCs",
  "Laptop",
  "Workstation",
  "Computers",
];

export function categoryHasSpecs(category) {
  return CATEGORIES_WITH_SPECS.includes(category);
}

export const RAM_GROUPS = [
  {
    label: "DDR3",
    options: ["4GB DDR3", "8GB DDR3", "4GB DDR3L", "8GB DDR3L"],
  },
  {
    label: "DDR4",
    options: ["4GB DDR4", "8GB DDR4", "16GB DDR4", "32GB DDR4"],
  },
  { label: "DDR5", options: ["8GB DDR5", "16GB DDR5", "32GB DDR5"] },
  {
    label: "LPDDR4",
    options: [
      "4GB LPDDR4",
      "8GB LPDDR4",
      "4GB LPDDR4X",
      "8GB LPDDR4X",
      "16GB LPDDR4X",
    ],
  },
  {
    label: "LPDDR5",
    options: [
      "8GB LPDDR5",
      "16GB LPDDR5",
      "8GB LPDDR5X",
      "16GB LPDDR5X",
      "32GB LPDDR5X",
    ],
  },
];

export const PROCESSOR_GROUPS = [
  { label: "Intel Entry", options: ["Intel Celeron", "Intel Pentium"] },
  {
    label: "Intel Core i3",
    options: ["Intel i3 8th Gen", "Intel i3 10th Gen", "Intel i3 12th Gen"],
  },
  {
    label: "Intel Core i5",
    options: [
      "Intel i5 7th Gen",
      "Intel i5 8th Gen",
      "Intel i5 10th Gen",
      "Intel i5 12th Gen",
      "Intel i5 13th Gen",
    ],
  },
  {
    label: "Intel Core i7",
    options: [
      "Intel i7 7th Gen",
      "Intel i7 8th Gen",
      "Intel i7 10th Gen",
      "Intel i7 12th Gen",
      "Intel i7 13th Gen",
    ],
  },
  {
    label: "Intel Core i9",
    options: ["Intel i9 10th Gen", "Intel i9 12th Gen", "Intel i9 13th Gen"],
  },
  {
    label: "Intel Core Ultra",
    options: ["Intel Core Ultra 5", "Intel Core Ultra 7", "Intel Core Ultra 9"],
  },
  { label: "Intel Workstation", options: ["Intel Xeon"] },
  {
    label: "AMD Ryzen",
    options: [
      "AMD Ryzen 3",
      "AMD Ryzen 5",
      "AMD Ryzen 7",
      "AMD Ryzen 9",
      "AMD Ryzen Threadripper",
    ],
  },
];

export const STORAGE_GROUPS = [
  {
    label: "SSD",
    options: [
      "128GB SSD",
      "256GB SSD",
      "512GB SSD",
      "1TB SSD",
      "2TB SSD",
      "4TB SSD",
    ],
  },
  {
    label: "HDD",
    options: ["500GB HDD", "1TB HDD", "2TB HDD", "4TB HDD", "8TB HDD"],
  },
  {
    label: "SSD + HDD",
    options: [
      "256GB SSD + 1TB HDD",
      "512GB SSD + 1TB HDD",
      "512GB SSD + 2TB HDD",
    ],
  },
];

export const EMPTY_PRODUCT = {
  Title: "",
  Category: "",
  Price: "",
  Tag: "",
  Description: "",
  Featured: false,
  is_active: true,
  "Image URL": [],
  "Supported RAMs": [],
  "Supported Processors": [],
  "Supported Storage": [],
};
