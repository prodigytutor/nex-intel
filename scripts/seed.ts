import { prisma } from '@/lib/prisma';

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { email: 'demo@example.com', name: 'Demo User' }
  });

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'WhoAmI Intel Demo',
      category: 'Link in bio',
      targetICP: 'Coaches & creators',
      region: 'US',
      inputs: {
        create: {
          problem: 'Founders need competitor intel fast',
          solution: 'Auto-generated analysis with citations',
          platforms: ['Web'],
          priceTarget: '$10-50/mo',
          keywords: ['link in bio', 'creator storefront', 'coaching'],
          competitors: ['Stan', 'Beacons', 'Pensight'],
          urls: [],
        }
      }
    }
  });

  console.log('Seeded project:', project.id);
}

main().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});