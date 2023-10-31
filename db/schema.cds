using { managed } from '@sap/cds/common';
namespace sap.fe.cap.travel;

entity Travel : managed {
  key TravelUUID : UUID;
  TravelID       : Integer @readonly default 0;
  BeginDate      : Date;
}
