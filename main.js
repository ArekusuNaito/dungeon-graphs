let fs = require('fs');
let dungeonFileName = "dungeon-2";
// let dungeon =  JSON.parse(fs.readFileSync("dungeon-object.json","utf-8"));
let dungeon =  JSON.parse(fs.readFileSync(`dungeons/${dungeonFileName}.json`,"utf-8"));
let open = [];
let closed = Object.assign({},dungeon);
open.push("Start");
delete closed.Start;
console.log(`Entering The Dungeon`);
while(closed.End)
{
  for(let roomName in closed)
  {
    let currentRoom = closed[roomName];
    currentRoom.name = roomName; //Injecting the name to the room
    if(RoomRequirementsMet(currentRoom))
    {
      VisitRoom(currentRoom);
    }
  }
}

console.log("Solve order is...");
console.log(open);


//--------------
function VisitRoom(room)
{
    console.log(`Visiting ${room.name}`);
    // open[room.name]=room;
    open.push(room.name)
    delete closed[room.name];
    console.log(`Completed Room ${room.name}`);
    if(room.unlocks)
    {
      UnlockRooms(room);
      delete room.unlocks;
    }
}


function UnlockRooms(room)
{
  room.unlocks.forEach((unlockedRoomName)=>
  {
    console.log(`${room.name} has a switch for ${unlockedRoomName}`);
    let unlockedRoom = closed[unlockedRoomName];
    RemoveRoomRequirement(unlockedRoom,room.name);
    if(RoomRequirementsMet(unlockedRoom))
    {
      console.log(`You unlocked ${unlockedRoomName} in ${room.name}`);
    }
    else
    {
      console.log(`...but ${unlockedRoomName} is still locked. You need ${unlockedRoom.requirements}`);
    }
  });
}


function RemoveRoomRequirement(unlockedRoom,unlockerRoomName)
{
  unlockedRoom.requirements = unlockedRoom.requirements.filter(filteredRoomName => unlockerRoomName != filteredRoomName);
}

function RoomRequirementsMet(room)
{
  if(!room.requirements || room.requirements.length===0)
  {
    delete room.requirements;
    return true;
  }
  else return false;
}
