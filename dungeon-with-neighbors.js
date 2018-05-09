let fs = require('fs');
let dungeonFileName = "optional-dungeon-1";
// let dungeon =  JSON.parse(fs.readFileSync("dungeon-object.json","utf-8"));
let dungeon =  JSON.parse(fs.readFileSync(`dungeons/${dungeonFileName}.json`,"utf-8"));
let open = {}
let path = [];
let closed = Object.assign({},dungeon);
let inventory = [];
//Start node actions
dungeon.Start.name = "Start";
open["Start"] = dungeon.Start;
let counter = 0;
let currentRoom = dungeon.Start;
currentRoom.name = "Start";
currentRoom.comingFrom = null;
let doorIndex = 0;
VisitRoom(currentRoom);
while(closed.End)
{
  CheckDoor(currentRoom,doorIndex);
}
//
console.log();
console.log(`Unvisited Rooms: ${Object.keys(closed).length}`);
console.log(`Your loot: ${inventory}`);
console.log(path);
console.log();
// path.map(room=>console.log(room.name))

////----------- Functions

function CheckDoor(currentRoom,doorIndex)
{
  console.log();
  let neighborName = currentRoom.neighbors[doorIndex];
  if(!neighborName)
  {
    console.log(`Where... am I...? I came from ${currentRoom.comingFrom}`);
    // process.exit();
    return;
  }
  let neighbor = GetRoomData(neighborName)
  if(neighbor.comingFrom == currentRoom.name)
  {
    console.log("That's where I came from...");
    CheckDoor(currentRoom,doorIndex+1)
  }
  console.log(`You are looking at the door of ${neighborName}`);
  //Can we enter that room?

  if(RoomRequirementsMet(neighbor))
  {
    neighbor.comingFrom = currentRoom.name;
    VisitRoom(neighbor);
    CheckDoor(neighbor,doorIndex)
  }
  else
  {
    console.log(`${neighborName} its locked... Requires ${neighbor.requirements}`);
    CheckDoor(currentRoom,doorIndex+1)
  }
  console.log("When are we supposed to see this?");
}


function GetRoomData(roomName)
{
  console.log(roomName);
  let room = open[roomName] || closed[roomName]
  room.name = roomName;
  return room;
}

function VisitRoom(room)
{

  console.log(`Entering ${room.name}`);
  path.push(room.name);
  if(RoomAwardSomething(room))
  {
    console.log(`${room.name} awards ${room.awards}`);
    room.awards.map(item=>inventory.push(item));
    delete room.awards;

  }
  else
  {
    //Message: Nothing to award, kbyethx
  }
  if(!room.awards && !room.unlocks)
  { //No more useful stuff here
    // console.log(`There's nothing else to get in ${room.name}`);
    delete closed[room.name];
  }
}

function RoomAwardSomething(room)
{
  return room.awards
}

function RoomRequirementsMet(room)
{
  //Check for a Key
  if(room.requirements)
  {
    for(let index in room.requirements)
    {
      let requirement = room.requirements[index];
      if(inventory.includes(requirement))
      {
        console.log(`To Open: ${room.requirements} and You have ${inventory}`);
        let itemIndex = inventory.indexOf(requirement);
        inventory.splice(itemIndex,1);
        room.requirements.splice(index,1);
        console.log("Used a key to open the door");
        console.log(`And now requires: ${room.requirements} and You have ${inventory}`);
      }
    }

  }
  if(room.name == "Locked-Door")
  {
    // process.exit();
  }
  if(!room.requirements || room.requirements.length===0)
  {
    delete room.requirements;
    console.log(`You are allowed to enter ${room.name}`);
    open[room.name]=room;
    return true;
  }
  else
  {
    return false;
  }
}
