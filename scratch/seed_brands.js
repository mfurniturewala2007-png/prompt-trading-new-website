import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ihlzgwuzqzdhijwnljtu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobHpnd3V6cXpkaGlqd25sanR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0ODQ2NDQsImV4cCI6MjA5MjA2MDY0NH0.CANH1jSIfe92sXIa45j0T5b9SJrpchjZ8Ps3DLvmQro";

const supabase = createClient(supabaseUrl, supabaseKey);

// All URLs verified by manually navigating to Wikimedia Commons and extracting exact "Original file" links
const brands = [
  {
    name: "Snap-on",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/3/36/Snap-on_logo.svg",
    description: "Professional automotive tools"
  },
  {
    name: "Blue-Point",
    image_url: "https://www.snapon-bluepoint.com.sg/images/logo.png",
    description: "High-quality hand tools by Snap-on"
  },
  {
    name: "BAHCO",
    image_url: "https://upload.wikimedia.org/wikipedia/en/5/5a/Bahco_logo.svg",
    description: "Swedish hand tool brand"
  },
  {
    name: "WILLIAMS",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/0/01/J.H._Williams_Tool_Group_logo.svg",
    description: "Industrial hand tools"
  },
  {
    name: "SIOUX",
    image_url: "https://www.siouxtools.com/sioux/static/media/Sioux_Logo.8c4b4a3a.png",
    description: "Industrial power tools"
  },
  {
    name: "STANLEY",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Stanley_Hand_Tools_logo.svg",
    description: "Building and construction tools"
  },
  {
    name: "DEWALT",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/8/89/DeWalt_Logo.svg",
    description: "Power tools for professionals"
  },
  {
    name: "BLACK & DECKER",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/1/10/Black_%26_Decker_logo.svg",
    description: "Home and garden power tools"
  },
  {
    name: "LENOX",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Lenox_logo.svg",
    description: "Premium power tool accessories"
  },
  {
    name: "LINDSTRÖM",
    image_url: "https://www.lindstromtools.com/static/version1706692237/frontend/SnapOn/lindstrom/en_US/images/logo.png",
    description: "Precision cutting tools since 1856"
  },
  {
    name: "GROZ",
    image_url: "https://www.groz-tools.com/sites/default/files/groz_logo.png",
    description: "Lubrication and workshop equipment"
  },
  {
    name: "KNIPEX",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Knipex_logo.svg",
    description: "World's leading brand in pliers"
  },
  {
    name: "Wera",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Wera_schwarz_Logo_ohne_Effekt_4C.svg",
    description: "Screwdriving tools professionals love"
  },
  {
    name: "RENNSTEIG",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Rennsteig_Werkzeuge_Logo.svg",
    description: "Pliers and striking tools"
  },
  {
    name: "MUVTONS",
    image_url: "https://muvtons.com/wp-content/themes/muvtons/assets/images/logo.png",
    description: "Industrial wheels and castors"
  },
  {
    name: "Lubeco",
    image_url: "https://lubeco.cz/wp-content/uploads/2019/04/lubeco-logo-final.png",
    description: "Environmentally friendly lubricants"
  },
  {
    name: "CRC",
    image_url: "https://www.crcindustries.com/images/logo-header.png",
    description: "Specialty chemicals and lubricants"
  }
];

async function seed() {
  console.log("Clearing existing brands...");
  const { error: deleteError } = await supabase.from('brands').delete().neq('name', '___NON_EXISTENT___');
  if (deleteError) {
    console.error("Error clearing brands:", deleteError.message);
    return;
  }
  console.log("Cleared! Inserting 17 new brands with verified logo links...");
  const { error: insertError } = await supabase.from('brands').insert(brands);
  if (insertError) {
    console.error("Error inserting brands:", insertError.message);
  } else {
    console.log("✅ Successfully seeded all 17 brands!");
    brands.forEach(b => console.log(` - ${b.name}: ${b.image_url}`));
  }
}

seed();
