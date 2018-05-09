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
let deadEndCounter = 0;
let currentRoom = dungeon.Start;
currentRoom.name = "Start";
currentRoom.comingFrom = null;
VisitRoom(currentRoom);
while(closed.End)
{
  for(let index in currentRoom.neighbors)
  {
    let neighborName = currentRoom.neighbors[index];
    let neighbor = GetRoomData(neighborName);
    if(currentRoom.comingFrom == neighbor && currentRoom.neighbors.length>1)
    {
      console.log(`That's where I come from... ${neighbor.name}`);
      deadEndCounter++;
      if(deadEndCounter>=30) //If you reached a lot of dead ends, end the exploration
      {
        EndExploration();
        process.exit();
      }
      continue;
    }
    DoICarryTheRequirement(neighbor,(requirementIndex,inventoryIndex)=>
    {
      UseItem(neighbor,inventoryIndex,requirementIndex);
    });
    if(CanYouOpen(neighbor))
    {

      VisitRoom(neighbor);
      neighbor.comingFrom = currentRoom;
      currentRoom=neighbor;
      break;
    }
    else
    {
      console.log(`I can't open ${neighbor.name}`);
    }
  }
}
//
EndExploration();
// path.map(room=>console.log(room.name))

////----------- Functions

function EndExploration()
{
  console.log();
  console.log(`Unvisited Rooms: ${Object.keys(closed).length}`);
  console.log(`Your loot: ${inventory}`);
  console.log(path);
  console.log();
}

function DoICarryTheRequirement(room,action)
{
  if(room.requirements)
  {
    for(let requirementIndex in room.requirements)
    {
      let requirement = room.requirements[requirementIndex];
      if(inventory.includes(requirement))
      {
        let inventoryIndex = inventory.indexOf(requirement);
        action(requirementIndex,inventoryIndex);
      }
    }
  }
}


function GetRoomData(roomName)
{
  let room = open[roomName] || closed[roomName]
  room.name = roomName;
  return room;
}

function VisitRoom(room)
{

  console.log(`Entering ${room.name}`);
  open[room.name]=room;
  path.push(room.name);
  if(RoomAwardSomething(room))
  {
    room.awards.map(item=>inventory.push(item));
    console.log(`${room.name} awards ${room.awards}. Your inventory:[${inventory}]`);
    delete room.awards;

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

function UseItem(room,inventoryIndex,requirementIndex)
{
  let item = inventory[inventoryIndex];
  console.log(`Using ${item} to clear a requirement of ${room.name}`);
  inventory.splice(inventoryIndex,1);
  room.requirements.splice(requirementIndex,1);
}

function CanYouOpen(room)
{

  if(!room.requirements || room.requirements.length===0)
  {
    console.log(`You are allowed to enter ${room.name}`);
    return true;
  }
  else
  {
    return false;
  }
}
