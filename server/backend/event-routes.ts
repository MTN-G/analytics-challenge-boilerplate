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
  const {dayZero} = req.query
  res.send('/retention')
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
