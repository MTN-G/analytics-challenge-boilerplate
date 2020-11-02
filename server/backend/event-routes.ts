///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import {getAllEvents
} from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import { filter } from "bluebird";
import { fileURLToPath } from "url";
import { FileWatcherEventKind } from "typescript";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

router.post("/", (req, res) => {
  const eventDetails : Event = req.body;
  res.status(201);
  res.json({ event: eventDetails });
});


router.get('/all', (req: Request, res: Response) => {
    const allEvents : Event[] = getAllEvents()
  res.send(allEvents)
    
});

router.get('/all-filtered', (req: Request, res: Response) => {
  let allEvents : Event[] = getAllEvents()
  const filters: Filter = req.query;
  console.log(filters)
  switch (filters.sorting) {
    case '+date':
      allEvents = allEvents.sort(function(a, b){return b.date -a.date});
      break;
    case '-date': 
      allEvents = allEvents.sort(function(a, b){return b.date -a.date}).reverse();
      break;
    default:
      res.status(400).json({message: 'sorting filter must be included'});
      break;
  }
  if (filters.type) allEvents = allEvents.filter(event => event.name === filters.type);
  if (filters.browser) allEvents = allEvents.filter(event => event.browser == filters.browser);
  if (filters.search) allEvents = allEvents.filter(event => Object.values(event).includes(filters.search));
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
  res.send('/by-days/:offset')
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  res.send('/by-hours/:offset')
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

// router.post('/', (req: Request, res: Response) => {
//   res.send('/')
// });

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
