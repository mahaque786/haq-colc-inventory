import { PrismaClient, TCGBrand } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Item Types
  const itemTypes = [
    { code: 'coin_ngc', label: 'Coin - NGC Graded', description: 'NGC professionally graded coin', sortOrder: 1 },
    { code: 'coin_pcgs', label: 'Coin - PCGS Graded', description: 'PCGS professionally graded coin', sortOrder: 2 },
    { code: 'coin_us_precious', label: 'Coin - US Ungraded (Precious Metal)', description: 'Raw US coin in precious metal', sortOrder: 3 },
    { code: 'coin_us_non_precious', label: 'Coin - US Ungraded (Non-Precious)', description: 'Raw US coin in non-precious metal', sortOrder: 4 },
    { code: 'coin_foreign_precious', label: 'Coin - Foreign Ungraded (Precious Metal)', description: 'Raw foreign coin in precious metal', sortOrder: 5 },
    { code: 'coin_foreign_non_precious', label: 'Coin - Foreign Ungraded (Non-Precious)', description: 'Raw foreign coin in non-precious metal', sortOrder: 6 },
    { code: 'paper_currency', label: 'Paper Currency', description: 'Paper notes and banknotes', sortOrder: 7 },
    { code: 'tcg_single_graded', label: 'TCG - Single Card (Graded)', description: 'Professionally graded TCG card', sortOrder: 8 },
    { code: 'tcg_single_ungraded', label: 'TCG - Single Card (Ungraded)', description: 'Raw TCG single card', sortOrder: 9 },
    { code: 'tcg_sealed_product', label: 'TCG - Sealed Product', description: 'Sealed booster box, ETB, etc.', sortOrder: 10 },
    { code: 'tcg_sealed_pack', label: 'TCG - Sealed Pack', description: 'Individual sealed booster pack', sortOrder: 11 },
  ]

  for (const itemType of itemTypes) {
    await prisma.itemType.upsert({
      where: { code: itemType.code },
      update: itemType,
      create: itemType,
    })
  }
  console.log('✓ Item types seeded')

  // Sealed Product Types (Pokemon)
  const pokemonProducts = [
    'Booster Box',
    'Elite Trainer Box',
    'Blister Pack',
    'Bundle',
    'Collection Box',
    'Premium Collection',
    'Ultra Premium Collection',
    'Tin',
    'Binder',
    'Theme Deck',
    'Starter Deck',
    'Gift Box',
  ]

  for (let i = 0; i < pokemonProducts.length; i++) {
    await prisma.sealedProductType.upsert({
      where: { brand_name: { brand: TCGBrand.POKEMON, name: pokemonProducts[i] } },
      update: { sortOrder: i },
      create: { brand: TCGBrand.POKEMON, name: pokemonProducts[i], sortOrder: i },
    })
  }
  console.log('✓ Sealed product types seeded')

  // Image Slot Templates
  const imageSlots = [
    // Graded coins (NGC/PCGS)
    { itemTypeCode: 'coin_ngc', slotKey: 'slab_front', label: 'Slab Front', sortOrder: 0 },
    { itemTypeCode: 'coin_ngc', slotKey: 'slab_back', label: 'Slab Back', sortOrder: 1 },
    { itemTypeCode: 'coin_ngc', slotKey: 'coin_obverse', label: 'Coin Obverse', sortOrder: 2 },
    { itemTypeCode: 'coin_ngc', slotKey: 'coin_reverse', label: 'Coin Reverse', sortOrder: 3 },
    { itemTypeCode: 'coin_ngc', slotKey: 'label_detail', label: 'Label Detail', sortOrder: 4 },
    { itemTypeCode: 'coin_pcgs', slotKey: 'slab_front', label: 'Slab Front', sortOrder: 0 },
    { itemTypeCode: 'coin_pcgs', slotKey: 'slab_back', label: 'Slab Back', sortOrder: 1 },
    { itemTypeCode: 'coin_pcgs', slotKey: 'coin_obverse', label: 'Coin Obverse', sortOrder: 2 },
    { itemTypeCode: 'coin_pcgs', slotKey: 'coin_reverse', label: 'Coin Reverse', sortOrder: 3 },
    { itemTypeCode: 'coin_pcgs', slotKey: 'label_detail', label: 'Label Detail', sortOrder: 4 },
    // Ungraded coins
    { itemTypeCode: 'coin_us_precious', slotKey: 'obverse', label: 'Obverse', sortOrder: 0 },
    { itemTypeCode: 'coin_us_precious', slotKey: 'reverse', label: 'Reverse', sortOrder: 1 },
    { itemTypeCode: 'coin_us_precious', slotKey: 'edge', label: 'Edge', sortOrder: 2, recommended: false },
    { itemTypeCode: 'coin_us_non_precious', slotKey: 'obverse', label: 'Obverse', sortOrder: 0 },
    { itemTypeCode: 'coin_us_non_precious', slotKey: 'reverse', label: 'Reverse', sortOrder: 1 },
    { itemTypeCode: 'coin_foreign_precious', slotKey: 'obverse', label: 'Obverse', sortOrder: 0 },
    { itemTypeCode: 'coin_foreign_precious', slotKey: 'reverse', label: 'Reverse', sortOrder: 1 },
    { itemTypeCode: 'coin_foreign_non_precious', slotKey: 'obverse', label: 'Obverse', sortOrder: 0 },
    { itemTypeCode: 'coin_foreign_non_precious', slotKey: 'reverse', label: 'Reverse', sortOrder: 1 },
    // Paper currency
    { itemTypeCode: 'paper_currency', slotKey: 'front', label: 'Front', sortOrder: 0 },
    { itemTypeCode: 'paper_currency', slotKey: 'back', label: 'Back', sortOrder: 1 },
    { itemTypeCode: 'paper_currency', slotKey: 'serial_number', label: 'Serial Number', sortOrder: 2 },
    // TCG graded
    { itemTypeCode: 'tcg_single_graded', slotKey: 'slab_front', label: 'Slab Front', sortOrder: 0 },
    { itemTypeCode: 'tcg_single_graded', slotKey: 'slab_back', label: 'Slab Back', sortOrder: 1 },
    { itemTypeCode: 'tcg_single_graded', slotKey: 'card_front', label: 'Card Front', sortOrder: 2 },
    { itemTypeCode: 'tcg_single_graded', slotKey: 'label_detail', label: 'Label Detail', sortOrder: 3 },
    // TCG ungraded
    { itemTypeCode: 'tcg_single_ungraded', slotKey: 'card_front', label: 'Card Front', sortOrder: 0 },
    { itemTypeCode: 'tcg_single_ungraded', slotKey: 'card_back', label: 'Card Back', sortOrder: 1 },
    // TCG sealed
    { itemTypeCode: 'tcg_sealed_product', slotKey: 'box_front', label: 'Box Front', sortOrder: 0 },
    { itemTypeCode: 'tcg_sealed_product', slotKey: 'box_back', label: 'Box Back', sortOrder: 1 },
    { itemTypeCode: 'tcg_sealed_product', slotKey: 'box_side', label: 'Box Side', sortOrder: 2 },
    { itemTypeCode: 'tcg_sealed_product', slotKey: 'seal_detail', label: 'Seal Detail', sortOrder: 3 },
    { itemTypeCode: 'tcg_sealed_pack', slotKey: 'pack_front', label: 'Pack Front', sortOrder: 0 },
    { itemTypeCode: 'tcg_sealed_pack', slotKey: 'pack_back', label: 'Pack Back', sortOrder: 1 },
  ]

  for (const slot of imageSlots) {
    await prisma.imageSlotTemplate.upsert({
      where: { itemTypeCode_slotKey: { itemTypeCode: slot.itemTypeCode, slotKey: slot.slotKey } },
      update: { label: slot.label, sortOrder: slot.sortOrder },
      create: {
        itemTypeCode: slot.itemTypeCode,
        slotKey: slot.slotKey,
        label: slot.label,
        recommended: slot.recommended ?? true,
        sortOrder: slot.sortOrder,
      },
    })
  }
  console.log('✓ Image slot templates seeded')

  // Pricing Platforms (fee rates as of 2025 — verify before production use)
  const platforms = [
    {
      code: 'ebay',
      name: 'eBay',
      feePercent: 0.1295,
      paymentFeePercent: 0.03,
      paymentFeeFixed: 0.30,
      promotedListingPercent: 0.05,
      sortOrder: 0,
    },
    {
      code: 'tcgplayer',
      name: 'TCGplayer',
      feePercent: 0.1099,
      paymentFeePercent: 0.025,
      paymentFeeFixed: 0.00,
      promotedListingPercent: null,
      sortOrder: 1,
    },
    {
      code: 'whatnot',
      name: 'Whatnot',
      feePercent: 0.08,
      paymentFeePercent: 0.029,
      paymentFeeFixed: 0.30,
      promotedListingPercent: null,
      sortOrder: 2,
    },
  ]

  for (const platform of platforms) {
    await prisma.pricingPlatform.upsert({
      where: { code: platform.code },
      update: platform,
      create: platform,
    })
  }
  console.log('✓ Pricing platforms seeded')

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
