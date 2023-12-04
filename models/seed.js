const Room = require('./Room')


Room.create([
  // Level 8
  {
    name: 'LTA 01',
    floor: 'Ground',
    capacity: 50,
    block: 'A',
    assets: {
      projector: true
    }
  },
  {
    name: 'LTA 02',
    floor: 'Ground',
    capacity: 50,
    block: 'A',
    assets: {
      projector: true
    }
  },
  {
    name: 'LTA 03',
    floor: 'Ground',
    capacity: 50,
    block: 'A',
    assets: {
      projector: true,
    }
  },
  {
    name: 'LTA 04',
    floor: 'First',
    capacity: 50,
    block: 'A',
    assets: {
      projector: true
    }
  },
  {
    name: 'LTA 05',
    floor: 'First',
    capacity: 50,
    block: 'A',
    assets: {
      projector: true
    }
  },
  {
    name: 'LTA 06',
    floor: 'First',
    capacity: 60,
    block: 'A',
    assets: {
      projector: true
    }
  },
  {
    name: 'LTA 07',
    floor: 'First',
    capacity: 50,
    block: 'A',
    assets: {
      projector: true
    }
  },
  {
    name: 'LTA 08',
    floor: 'Second',
    capacity: 50,
    block: 'A',
    assets: {
      projector: true
    }
  },
  {
    name: 'LTA 09',
    floor: 'Second',
    capacity: 60,
    block: 'A',
    assets: {
      projector: true
    }
  },
  {
    name: 'LTA 10',
    floor: 'Second',
    capacity: 50,
    block: 'A',
    assets: {
      projector: true
    }
  }
])
  .then((rooms) => {
    console.log(`Created ${rooms.length} rooms.`)
  })
  .catch((error) => {
    console.error(error)
  })