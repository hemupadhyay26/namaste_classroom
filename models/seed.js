const Room = require("./Room");

Room.create([
  {
    name: "Lab 02",
    floor: "Second",
    capacity: 36,
    block: "A",
    assets: {
      pcLab: true,
    },
  },
  {
    name: "LT-A 7",
    floor: "Fourth",
    capacity: 60,
    block: "A",
    assets: {
      projector: true,
    },
  },
  {
    name: "LT-A 3",
    floor: "Second",
    capacity: 50,
    block: "B",
    assets: {
      projector: true,
      whiteBoard: true,
    },
  },
  {
    name: "CR 4",
    floor: "Third",
    capacity: 40,
    block: "B",
  },
  {
    name: "Lab 05",
    floor: "Third",
    capacity: 40,
    block: "A",
    assets: {
      whiteBoard: true,
    },
  },
  {
    name: "CL-B 6",
    floor: "Second",
    capacity: 50,
    block: "A",
  },
  {
    name: "LT-B 7",
    floor: "Fourth",
    capacity: 50,
    block: "B",
  },
  {
    name: "LT-A 8",
    floor: "Fourth",
    capacity: 45,
    block: "A",
  },
  {
    name: "CR 1",
    floor: "Second",
    capacity: 50,
    block: "A",
  },
  {
    name: "Lab 01",
    floor: "Second",
    capacity: 40,
    block: "B",
  },
  {
    name: "CL-B 1",
    floor: "First",
    capacity: 60,
    block: "B",
  },
  {
    name: "LT-A 2",
    floor: "First",
    capacity: 70,
    block: "A",
    assets: {
      projector: true,
    },
  },
  {
    name: "Lab 03",
    floor: "Second",
    capacity: 50,
    block: "B",
  },
  {
    name: "LT-A 4",
    floor: "Second",
    capacity: 60,
    block: "A",
    assets: {
      projector: true,
    },
  },
  {
    name: "CR 5",
    floor: "Third",
    capacity: 40,
    block: "A",
    assets: {
      projector: true,
    },
  },
  {
    name: "Lab 04",
    floor: "Second",
    capacity: 35,
    block: "B",
  },
  {
    name: "LT-A 6",
    floor: "Third",
    capacity: 50,
    block: "A",
  },
  {
    name: "LT-B 4",
    floor: "Second",
    capacity: 45,
    block: "A",
  },
  {
    name: "LT-B 3",
    floor: "Second",
    capacity: 40,
    block: "B",
  },
  {
    name: "LT-A 4",
    floor: "Second",
    capacity: 50,
    block: "B",
  },
  {
    name: "Lab 01",
    floor: "Second",
    capacity: 40,
    block: "B",
    assets: {
      seminar: true,
    },
  },
  {
    name: "LT-B 1",
    floor: "First",
    capacity: 40,
    block: "A",
    assets: {
      whiteBoard: true,
    },
  },
  {
    name: "LT-A 2",
    floor: "First",
    capacity: 60,
    block: "B",
    assets: {
      whiteBoard: true,
    },
  },
  {
    name: "Lab 03",
    floor: "Second",
    capacity: 50,
    block: "A",
    assets: {
      whiteBoard: true,
    },
  },
  {
    name: "CR 4",
    floor: "Third",
    capacity: 50,
    block: "B",
    assets: {
      projector: true,
      whiteBoard: true,
    },
  },
  {
    name: "CL-B 5",
    floor: "Second",
    capacity: 40,
    block: "A",
    assets: {
      projector: true,
    },
  },
  {
    name: "CL-B 2",
    floor: "First",
    capacity: 45,
    block: "A",
    assets: {
      projector: true,
    },
  },
  {
    name: "LT-B 7",
    floor: "Fourth",
    capacity: 60,
    block: "A",
    assets: {
      projector: true,
    },
  },
  {
    name: "CL-A 3",
    floor: "Second",
    capacity: 40,
    block: "B",
    assets: {
      projector: true,
    },
  },
  {
    name: "Lab 01",
    floor: "Second",
    capacity: 40,
    block: "B",
  },
  {
    name: "CL-A 1",
    floor: "First",
    capacity: 50,
    block: "A",
  },
  {
    name: "Lab 05",
    floor: "Third",
    capacity: 45,
    block: "A",
  },
  {
    name: "CL-B 2",
    floor: "Second",
    capacity: 30,
    block: "B",
    assets: {
      Seminar: true,
    },
  },
  {
    name: "LT-A 6",
    floor: "Third",
    capacity: 60,
    block: "A",
    assets: {
      pcLab: true,
    },
  },
  {
    name: "Lab 04",
    floor: "Second",
    capacity: 40,
    block: "B",
    assets: {
      pcLab: true,
    },
  },
  {
    name: "LT-A 8",
    floor: "Fourth",
    capacity: 55,
    block: "B",
    assets: {
      pcLab: true,
    },
  },
  {
    name: "CL-B 7",
    floor: "Fourth",
    capacity: 50,
    block: "B",
  },
  {
    name: "LT-B 8",
    floor: "Fourth",
    capacity: 50,
    block: "A",
  },
  {
    name: "Green Screen Room",
    floor: "Second",
    capacity: 100,
    block: "A",
    assets: {
      projector: true,
    },
  },
  {
    name: "CR 2",
    floor: "Second",
    capacity: 50,
    block: "B",
    assets: {
      whiteBoard: true,
    },
  },
])
  .then((rooms) => {
    console.log(`Created ${rooms.length} rooms.`);
  })
  .catch((error) => {
    console.error(error);
  });
