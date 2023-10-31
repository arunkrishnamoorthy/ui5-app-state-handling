using { sap.fe.cap.travel as my } from '../db/schema';

service demoService @(path: 'browse') {
    function helloWorld() returns String;
    entity Travel as projection on my.Travel;
}