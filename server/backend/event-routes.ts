///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {getAllEvents, createEvent} from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import {OneDay,OneHour,OneWeek} from './timeFrames'
import { v4 } from "uuid";
import shortid from "shortid";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import { filter } from "bluebird";
import { fileURLToPath } from "url";
import { FileWatcherEventKind } from "typescript";
import { type } from "os";
import { session } from "passport";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

type ByDay = {
  date: string;
  count: number; 
  session_id?: string[];
}
type ByHour = {
  hour: string;
  count: number; 
  sessions?: string[];
}

router.get('/all', (req: Request, res: Response) => {
  const allEvents : Event[] = getAllEvents()
  res.send(allEvents)
  
});

router.get('/all-filtered', (req: Request, res: Response) => {
  let allEvents : Event[] = getAllEvents()
  const filters: Filter = req.query;
  switch (filters.sorting) {
    case '-date':
      allEvents = allEvents.sort((a, b) => b.date -a.date);
      break;
      case '+date': 
      allEvents = allEvents.sort((a, b) => b.date -a.date).reverse();
      break;
      default:
        break;
  }
  if (filters.type) allEvents = allEvents.filter(event => event.name === filters.type);
  if (filters.browser) allEvents = allEvents.filter(event => event.browser == filters.browser);
  if (filters.search) allEvents = allEvents.filter(event => event.session_id.includes(filters.search));
  let more = false
  if (filters.offset < allEvents.length) {
    more = true; 
    allEvents = allEvents.slice(0, filters.offset);
  }
  res.send(
    {
      events: allEvents,
      more
    });
});
      
router.get('/by-days/:offset', (req: Request, res: Response) => {
  let allEvents : Event[] = getAllEvents();

  const daysBack: number = parseInt(req.params.offset);
  const today: number = new Date (new Date().setHours(23, 59, 59, 9)).getTime()
  const lastDay : number =  today - ( daysBack * OneDay);
  const firstDay : number = (lastDay - OneWeek)

  allEvents = allEvents.filter(event => event.date >= firstDay && event.date <= lastDay);

  const response: ByDay[] = [];
  
  allEvents.forEach(event => {
    let date = new Date(event.date).toLocaleDateString()
    const dateIsExist = response.find(e => e.date === date);
    if (!dateIsExist) response.push({
      date,
      count: 1,
      session_id: [event.session_id]
    });
    if (dateIsExist && !dateIsExist.session_id?.some(e => e === event.session_id)) {
          dateIsExist.session_id?.push(event.session_id)
          dateIsExist.count += 1
    };
  });
  response.map(obj => delete obj.session_id);
  res.send(response)
});
          
router.get('/by-hours/:offset', (req: Request, res: Response) => {
  let allEvents : Event[] = getAllEvents();

  const daysBack: number = parseInt(req.params.offset);
  const today: number = new Date (new Date().setHours(23, 59, 59, 9)).getTime();
  const offsetDay = today - (daysBack * OneDay)
  const response : ByHour[] = []
  for (let i = 0; i < 24; i++) {
    response.push({
      hour: `0${i}:00`.slice(-5),
      count: 0,
      sessions: []
    });
  };

  allEvents.forEach(event => {
    const difference: number = event.date - (offsetDay - OneDay);
    if (difference < OneDay && difference > 0) {
      const hour: number = new Date(difference).getHours();
      const relevantHour: ByHour = response[hour];
      if (!relevantHour.sessions?.some(e => e === event.session_id)) {
        relevantHour.sessions?.push(event.session_id);
        relevantHour.count += 1;
      ;}   
    };
  });
  response.map(obj => delete obj.sessions);
  res.send(response)
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {
  const allEvents: Event[] = getAllEvents()
  const dayZero: number = parseInt(req.query.dayZero)
  const today: number = new Date (new Date().setHours(23, 59, 59, 9)).getTime();
  const difference: number = today - dayZero;
  const numberOfWeeks: number = Math.ceil(difference / OneWeek)
  console.log(dayZero, today, difference)
  const eventByWeek: Event[][] = []
  const userIdByWeek: string[][] = []
  const response: weeklyRetentionObject[] = [];

  for (let i = 0; i < numberOfWeeks; i++) {

    const weekStart = new Date (new Date(dayZero + (i * OneWeek)).setHours(0,0,0,0)).getTime();
    const weekEnd = (weekStart + OneWeek);

    const weeklyEvents: Event[] = allEvents.filter(event => event.date > weekStart && event.date < weekEnd);
    eventByWeek.push(weeklyEvents);

    const weeklySignupEvents: Event[] = weeklyEvents.filter(event => event.name === "signup");
    const newUsers: number = weeklySignupEvents.length;

    const newUsersId: string[] = weeklySignupEvents.map(event => event.distinct_user_id);
    userIdByWeek.push(newUsersId);

    response.push({
      registrationWeek: i + 1,
      newUsers,
      weeklyRetention: [],
      start: new Date(weekStart).toLocaleString(),
      end: new Date(weekEnd).toLocaleString()
    });

  }
  
  response.forEach((obj, index) => {
    for (let i = index; i < numberOfWeeks; i++) {
      const weeklyLoginEvents: Event[] = eventByWeek[i]
        .filter(event => 
          (event.name === "login" || event.name === "signup") && 
          userIdByWeek[index].some(userId => event.distinct_user_id === userId))
      const validationArray: Event[] = []
      weeklyLoginEvents.forEach(event => {
        validationArray.some(e => e.distinct_user_id === event.distinct_user_id) ?
        null : validationArray.push(event)
      })
      obj.weeklyRetention.push(Math.round((validationArray.length / userIdByWeek[index].length ) * 100))
    }
  })
  
  res.send(response)
});

router.get('/:eventId',(req : Request, res : Response) => {
  res.send('/:eventId')
});

router.post('/', (req: Request, res: Response) => {
  createEvent(req.body)
  res.send('created')
});

router.get('/chart/os/:time',(req: Request, res: Response) => {
  res.send('/chart/os/:time')
})

  
router.get('/chart/pageview/:time',(req: Request, res: Response) => {
  res.send('/chart/pageview/:time')
})

router.get('/chart/timeonurl/:time',(req: Request, res: Response) => {
  res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})


export default router;
// response.forEach(obj => {
//     for (let i = 0; i < obj.registrationWeek; i++) {
//       const weeklyLoginEvents: number = eventByWeek[i]
//       .filter(event => 
//         (event.name === "login" || event.name === "signup") &&
//         userIdByWeek[obj.registrationWeek - 1].some(userId => event.distinct_user_id === userId))
//       .length
//       const percents: number = (weeklyLoginEvents / userIdByWeek[obj.registrationWeek - 1].length ) * 100
//       obj.weeklyRetention.push(percents)
//     } 
//   })